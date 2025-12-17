import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, Target, Zap } from "lucide-react";

interface ScoreDisplayProps {
  totalScore: number;
  questsCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

export function ScoreDisplay({ totalScore, questsCompleted, currentStreak, longestStreak }: ScoreDisplayProps) {
  const stats = [
    {
      label: "Total Skor",
      value: totalScore,
      icon: Trophy,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Quest Selesai",
      value: questsCompleted,
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Streak Saat Ini",
      value: `${currentStreak} hari`,
      icon: Flame,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Streak Terbaik",
      value: `${longestStreak} hari`,
      icon: Zap,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="score-display">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.label} className="hover-elevate" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
