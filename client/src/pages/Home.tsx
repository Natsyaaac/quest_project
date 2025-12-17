import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LearningResources } from "@/components/LearningResources";
import { DailyQuests } from "@/components/DailyQuests";
import { Achievements } from "@/components/Achievements";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { QuestHistory } from "@/components/QuestHistory";
import { DataExport } from "@/components/DataExport";
import { 
  loadProgress, 
  saveProgress, 
  loadDailyQuests, 
  saveDailyQuests,
  updateStreak,
  DEFAULT_ACHIEVEMENTS,
  getTodayDateString,
  checkAndResetAchievements,
  resetAchievements
} from "@/lib/storage";
import { apiRequest } from "@/lib/queryClient";
import type { Quest, UserProgress, Achievement } from "@shared/schema";
import { Code, Trophy } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [progress, setProgress] = useState<UserProgress>(() => {
    const loaded = loadProgress();
    if (!loaded.achievements || loaded.achievements.length === 0) {
      loaded.achievements = [...DEFAULT_ACHIEVEMENTS];
    }
    return loaded;
  });
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateQuestsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/quests/generate");
      const data = await response.json();
      return data as { quests: Quest[] };
    },
    onSuccess: (data) => {
      if (data && data.quests && data.quests.length > 0) {
        setDailyQuests(data.quests);
        saveDailyQuests(data.quests);
        toast({
          title: "Quest Baru Dibuat!",
          description: "Tantangan harianmu sudah diperbarui.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Gagal membuat quest",
        description: "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const { shouldReset, lastResetDate } = checkAndResetAchievements();
    if (shouldReset && lastResetDate) {
      resetAchievements();
      const newProgress = loadProgress();
      if (!newProgress.achievements || newProgress.achievements.length === 0) {
        newProgress.achievements = [...DEFAULT_ACHIEVEMENTS];
      }
      setProgress(newProgress);
      toast({
        title: "Periode Baru Dimulai!",
        description: "Pencapaian bulan ini sudah direset. Ayo mulai petualangan baru!",
      });
    }
  }, [toast]);

  useEffect(() => {
    const storedQuests = loadDailyQuests();
    if (storedQuests && storedQuests.length > 0) {
      setDailyQuests(storedQuests);
      setIsLoading(false);
    } else {
      generateQuestsMutation.mutate();
      setIsLoading(false);
    }
  }, []);

  const checkAchievements = useCallback((currentProgress: UserProgress): Achievement[] => {
    const achievements = currentProgress.achievements || DEFAULT_ACHIEVEMENTS;
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;
      
      if (achievement.id.includes("streak")) {
        shouldUnlock = currentProgress.currentStreak >= achievement.requirement;
      } else if (achievement.id.includes("_points")) {
        shouldUnlock = currentProgress.totalScore >= achievement.requirement;
      } else if (achievement.id.includes("_quests") || achievement.id === "first_quest") {
        shouldUnlock = currentProgress.questsCompleted >= achievement.requirement;
      }

      if (shouldUnlock) {
        toast({
          title: "Pencapaian Terbuka!",
          description: `${achievement.title} - ${achievement.description}`,
        });
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      return achievement;
    });

    return updatedAchievements;
  }, [toast]);

  const handleCompleteQuest = useCallback((questId: string) => {
    const quest = dailyQuests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    const updatedQuests = dailyQuests.map(q =>
      q.id === questId ? { ...q, completed: true } : q
    );
    setDailyQuests(updatedQuests);
    saveDailyQuests(updatedQuests);

    const today = getTodayDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    let newStreak = progress.currentStreak;
    let newLongestStreak = progress.longestStreak;

    if (progress.lastActiveDate !== today) {
      if (progress.lastActiveDate === yesterdayString) {
        newStreak = progress.currentStreak + 1;
      } else {
        newStreak = 1;
      }
      newLongestStreak = Math.max(progress.longestStreak, newStreak);
    }

    let updatedProgress: UserProgress = {
      ...progress,
      totalScore: progress.totalScore + quest.points,
      questsCompleted: progress.questsCompleted + 1,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
      completedQuests: [{ ...quest, completed: true }, ...(progress.completedQuests || [])],
      achievements: progress.achievements || [...DEFAULT_ACHIEVEMENTS],
    };

    const updatedAchievements = checkAchievements(updatedProgress);
    updatedProgress.achievements = updatedAchievements;

    setProgress(updatedProgress);
    saveProgress(updatedProgress);

    toast({
      title: "Quest Selesai!",
      description: `Kamu mendapat +${quest.points} poin!`,
    });
  }, [dailyQuests, progress, checkAchievements, toast]);

  const handleRefreshQuests = useCallback(() => {
    generateQuestsMutation.mutate();
  }, [generateQuestsMutation]);

  const handleDataImported = useCallback(() => {
    const newProgress = loadProgress();
    if (!newProgress.achievements || newProgress.achievements.length === 0) {
      newProgress.achievements = [...DEFAULT_ACHIEVEMENTS];
    }
    const newQuests = loadDailyQuests();
    setProgress(newProgress);
    if (newQuests) {
      setDailyQuests(newQuests);
    }
  }, []);

  const handleResetAchievements = useCallback(() => {
    if (window.confirm("Apakah kamu yakin ingin mereset semua pencapaian? Semua progres akan direset ke awal.")) {
      resetAchievements();
      const newProgress = loadProgress();
      setProgress(newProgress);
      toast({
        title: "Pencapaian Direset",
        description: "Semua pencapaian sudah direset. Ayo mulai petualangan baru!",
      });
    }
  }, [toast]);

  const safeAchievements = progress.achievements && progress.achievements.length > 0 
    ? progress.achievements 
    : DEFAULT_ACHIEVEMENTS;

  const safeCompletedQuests = progress.completedQuests || [];

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg md:text-xl">Perjalanan Belajar Pemrograman</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Belajar. Latihan. Raih.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500/10">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-lg" data-testid="text-total-score">{progress.totalScore}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-8">
        <ScoreDisplay
          totalScore={progress.totalScore}
          questsCompleted={progress.questsCompleted}
          currentStreak={progress.currentStreak}
          longestStreak={progress.longestStreak}
        />

        <LearningResources />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DailyQuests
              quests={dailyQuests}
              isLoading={isLoading && dailyQuests.length === 0}
              onCompleteQuest={handleCompleteQuest}
              onRefreshQuests={handleRefreshQuests}
              isRefreshing={generateQuestsMutation.isPending}
            />

            <QuestHistory completedQuests={safeCompletedQuests} />
          </div>

          <div className="space-y-6">
            <Achievements
              achievements={safeAchievements}
              questsCompleted={progress.questsCompleted}
              totalScore={progress.totalScore}
              currentStreak={progress.currentStreak}
              onResetRequest={handleResetAchievements}
            />

            <DataExport onDataImported={handleDataImported} />
          </div>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 text-center text-sm text-muted-foreground">
          <p>Terus belajar, terus berkembang! Progresmu disimpan secara lokal.</p>
        </div>
      </footer>
    </div>
  );
}
