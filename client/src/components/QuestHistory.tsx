import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, ChevronDown, ChevronUp, CheckCircle, Zap } from "lucide-react";
import type { Quest } from "@shared/schema";

interface QuestHistoryProps {
  completedQuests: Quest[];
}

const difficultyColors = {
  easy: "bg-green-500/10 text-green-600 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const difficultyLabels = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

export function QuestHistory({ completedQuests }: QuestHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayQuests = isExpanded ? completedQuests : completedQuests.slice(0, 5);
  const totalPoints = completedQuests.reduce((sum, q) => sum + q.points, 0);

  return (
    <Card data-testid="card-quest-history">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-green-500/10">
              <History className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Riwayat Quest</CardTitle>
              <p className="text-sm text-muted-foreground">
                {completedQuests.length} quest selesai ({totalPoints} poin didapat)
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {completedQuests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>Belum ada quest selesai. Mulai perjalananmu!</p>
          </div>
        ) : (
          <>
            <ScrollArea className={isExpanded ? "h-64" : "h-auto"}>
              <div className="space-y-2">
                {displayQuests.map((quest, index) => (
                  <div
                    key={`${quest.id}-${index}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/30 border border-muted"
                    data-testid={`history-quest-${quest.id}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{quest.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-xs ${difficultyColors[quest.difficulty]}`}>
                            {difficultyLabels[quest.difficulty]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(quest.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-medium text-sm shrink-0">
                      <Zap className="w-3 h-3" />
                      <span>+{quest.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {completedQuests.length > 5 && (
              <Button
                variant="ghost"
                className="w-full mt-3"
                onClick={() => setIsExpanded(!isExpanded)}
                data-testid="button-toggle-history"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Tampilkan Lebih Sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Tampilkan Semua ({completedQuests.length} quest)
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
