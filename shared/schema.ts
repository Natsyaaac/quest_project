import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Quest schema
export const questSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  points: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.enum(["javascript", "php", "css", "general"]),
  completed: z.boolean(),
  createdAt: z.string(),
});

export type Quest = z.infer<typeof questSchema>;

// Achievement schema
export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  unlocked: z.boolean(),
  unlockedAt: z.string().optional(),
  requirement: z.number(),
});

export type Achievement = z.infer<typeof achievementSchema>;

// User progress schema
export const userProgressSchema = z.object({
  totalScore: z.number(),
  questsCompleted: z.number(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  lastActiveDate: z.string(),
  achievements: z.array(achievementSchema),
  completedQuests: z.array(questSchema),
});

export type UserProgress = z.infer<typeof userProgressSchema>;

// Daily quests response
export const dailyQuestsResponseSchema = z.object({
  quests: z.array(questSchema),
  generatedAt: z.string(),
});

export type DailyQuestsResponse = z.infer<typeof dailyQuestsResponseSchema>;
