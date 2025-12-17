import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Award, 
  Medal, 
  Crown, 
  Zap, 
  Flame, 
  Target,
  Lock,
  Rocket,
  Gem,
  TrendingUp,
  Sparkles,
  Shield,
  Sword,
  CheckCircle,
  Mountain,
  Sun,
  Moon,
  RotateCcw,
  Calendar
} from "lucide-react";
import type { Achievement } from "@shared/schema";
import { getNextResetDate, getLastResetDate } from "@/lib/storage";

interface AchievementsProps {
  achievements: Achievement[];
  questsCompleted: number;
  totalScore: number;
  currentStreak: number;
  onResetRequest?: () => void;
}

const iconMap: Record<string, typeof Trophy> = {
  Trophy,
  Star,
  Award,
  Medal,
  Crown,
  Zap,
  Flame,
  Target,
  Rocket,
  Gem,
  TrendingUp,
  Sparkles,
  Shield,
  Sword,
  CheckCircle,
  Mountain,
  Sun,
  Moon,
};

function getProgressForAchievement(achievement: Achievement, questsCompleted: number, totalScore: number, currentStreak: number): number {
  if (achievement.unlocked) return 100;
  
  let current = 0;
  if (achievement.id.includes("streak")) {
    current = currentStreak;
  } else if (achievement.id.includes("points") || achievement.id.includes("hundred_points") || achievement.id.includes("thousand_points") || achievement.id.includes("five_hundred_points") || achievement.id.includes("five_thousand_points")) {
    current = totalScore;
  } else {
    current = questsCompleted;
  }
  
  return Math.min((current / achievement.requirement) * 100, 100);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function Achievements({ achievements, questsCompleted, totalScore, currentStreak, onResetRequest }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const nextReset = getNextResetDate();
  const lastReset = getLastResetDate();
  
  const daysUntilReset = Math.ceil((nextReset.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card data-testid="card-achievements">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-yellow-500/10">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Pencapaian</CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Calendar className="w-3 h-3" />
                <span>Reset dalam {daysUntilReset} hari</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {unlockedCount}/{achievements.length} Terbuka
            </Badge>
            {onResetRequest && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={onResetRequest}
                title="Reset Pencapaian"
                data-testid="button-reset-achievements"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {lastReset && (
          <p className="text-xs text-muted-foreground mt-2">
            Reset terakhir: {formatDate(lastReset)} | Reset berikutnya: {nextReset.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((achievement) => {
            const IconComponent = iconMap[achievement.icon] || Trophy;
            const progress = getProgressForAchievement(achievement, questsCompleted, totalScore, currentStreak);
            
            return (
              <div
                key={achievement.id}
                className={`relative p-3 rounded-md border text-center transition-all ${
                  achievement.unlocked
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/30 border-muted opacity-60"
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  achievement.unlocked
                    ? "bg-primary/10"
                    : "bg-muted"
                }`}>
                  {achievement.unlocked ? (
                    <IconComponent className="w-5 h-5 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <h4 className="font-medium text-sm mb-1 truncate">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <Progress value={progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progress)}%
                    </p>
                  </div>
                )}
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-primary">
                    {new Date(achievement.unlockedAt).toLocaleDateString("id-ID")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
