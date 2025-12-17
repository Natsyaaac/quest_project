import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Target, RefreshCw, Sparkles, Clock, Zap, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import type { Quest } from "@shared/schema";

interface DailyQuestsProps {
  quests: Quest[];
  isLoading: boolean;
  onCompleteQuest: (questId: string) => void;
  onRefreshQuests: () => void;
  isRefreshing: boolean;
}

const difficultyColors = {
  easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const difficultyLabels = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

const categoryColors = {
  javascript: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  php: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  css: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  general: "bg-gray-500/10 text-gray-700 dark:text-gray-300",
};

const categoryLabels = {
  javascript: "JAVASCRIPT",
  php: "PHP",
  css: "CSS",
  general: "UMUM",
};

const questExplanations: Record<string, string> = {
  javascript: "Quest ini membantu kamu memperdalam pemahaman JavaScript, bahasa pemrograman yang paling banyak digunakan untuk pengembangan web. Dengan menyelesaikan quest ini, kamu akan semakin mahir dalam manipulasi DOM, async programming, dan konsep-konsep penting lainnya.",
  php: "Quest PHP ini akan meningkatkan kemampuanmu dalam server-side programming. PHP adalah bahasa yang powerful untuk membangun aplikasi web dinamis dan backend systems.",
  css: "Quest CSS ini akan mempertajam skill styling dan layouting-mu. Kamu akan belajar cara membuat tampilan web yang menarik dan responsive.",
  general: "Quest umum ini mencakup berbagai aspek programming yang penting. Ini akan memperluas wawasan dan skill programming secara keseluruhan.",
};

const difficultyExplanations: Record<string, string> = {
  easy: "Quest dengan tingkat kesulitan mudah. Cocok untuk pemanasan dan membangun kepercayaan diri. Biasanya membutuhkan waktu sekitar 10-15 menit.",
  medium: "Quest dengan tingkat kesulitan sedang. Membutuhkan pemikiran lebih dan pemahaman konsep yang baik. Estimasi waktu 20-30 menit.",
  hard: "Quest dengan tingkat kesulitan tinggi. Ini adalah tantangan yang akan menguji batas kemampuanmu. Membutuhkan waktu 30-60 menit dan pemahaman mendalam.",
};

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}j ${minutes}m`;
}

function QuestItem({ 
  quest, 
  onCompleteQuest 
}: { 
  quest: Quest; 
  onCompleteQuest: (questId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={`rounded-md border transition-all ${
          quest.completed
            ? "bg-muted/50 border-muted"
            : "bg-card border-border"
        }`}
        data-testid={`quest-item-${quest.id}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={quest.completed}
              onCheckedChange={() => !quest.completed && onCompleteQuest(quest.id)}
              disabled={quest.completed}
              className="mt-1"
              data-testid={`checkbox-quest-${quest.id}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className={`font-medium ${quest.completed ? "line-through text-muted-foreground" : ""}`}>
                  {quest.title}
                </h4>
                <Badge variant="outline" className={`text-xs ${difficultyColors[quest.difficulty]}`}>
                  {difficultyLabels[quest.difficulty]}
                </Badge>
                <Badge variant="secondary" className={`text-xs ${categoryColors[quest.category]}`}>
                  {categoryLabels[quest.category]}
                </Badge>
              </div>
              <p className={`text-sm ${quest.completed ? "text-muted-foreground" : "text-muted-foreground"}`}>
                {quest.description}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 text-primary font-medium">
                <Zap className="w-4 h-4" />
                <span>+{quest.points}</span>
              </div>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="shrink-0"
                  data-testid={`button-expand-quest-${quest.id}`}
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-2">
            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-sm font-medium mb-1">Tentang Quest Ini</h5>
                  <p className="text-sm text-muted-foreground">
                    {questExplanations[quest.category]}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-sm font-medium mb-1">Tingkat Kesulitan: {difficultyLabels[quest.difficulty]}</h5>
                  <p className="text-sm text-muted-foreground">
                    {difficultyExplanations[quest.difficulty]}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-md p-3">
                <h5 className="text-sm font-medium mb-2">Tips Menyelesaikan:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Baca dan pahami deskripsi quest dengan teliti</li>
                  <li>2. Pecah masalah menjadi bagian-bagian kecil</li>
                  <li>3. Jangan ragu untuk mencari referensi di dokumentasi</li>
                  <li>4. Praktikkan langsung di code editor favoritmu</li>
                </ul>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function DailyQuests({ quests, isLoading, onCompleteQuest, onRefreshQuests, isRefreshing }: DailyQuestsProps) {
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilMidnight);
  const completedCount = quests.filter(q => q.completed).length;
  const totalPoints = quests.filter(q => q.completed).reduce((sum, q) => sum + q.points, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilReset(getTimeUntilMidnight());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card data-testid="card-daily-quests-loading">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20" data-testid="card-daily-quests">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Quest Hari Ini</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Reset dalam {timeUntilReset}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Dibuat AI
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={onRefreshQuests}
              disabled={isRefreshing}
              data-testid="button-refresh-quests"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="text-muted-foreground">
            Progres: <span className="font-medium text-foreground">{completedCount}/{quests.length}</span>
          </span>
          <span className="text-muted-foreground">
            Poin didapat: <span className="font-medium text-primary">+{totalPoints}</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Klik panah di sebelah kanan quest untuk melihat penjelasan detail
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {quests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada quest. Klik refresh untuk membuat quest baru!</p>
          </div>
        ) : (
          quests.map((quest) => (
            <QuestItem 
              key={quest.id} 
              quest={quest} 
              onCompleteQuest={onCompleteQuest}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
