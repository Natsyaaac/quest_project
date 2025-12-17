import type { Quest, Achievement, UserProgress } from "@shared/schema";
import * as XLSX from "xlsx";

const STORAGE_KEYS = {
  USER_PROGRESS: "learning_dashboard_progress",
  DAILY_QUESTS: "learning_dashboard_daily_quests",
  QUESTS_DATE: "learning_dashboard_quests_date",
  ACHIEVEMENT_RESET_DATE: "learning_dashboard_achievement_reset",
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_quest",
    title: "Langkah Pertama",
    description: "Selesaikan quest pertamamu",
    icon: "Trophy",
    unlocked: false,
    requirement: 1,
  },
  {
    id: "five_quests",
    title: "Mulai Berjalan",
    description: "Selesaikan 5 quest",
    icon: "Star",
    unlocked: false,
    requirement: 5,
  },
  {
    id: "ten_quests",
    title: "Pelajar Tekun",
    description: "Selesaikan 10 quest",
    icon: "Award",
    unlocked: false,
    requirement: 10,
  },
  {
    id: "twenty_five_quests",
    title: "Pencari Ilmu",
    description: "Selesaikan 25 quest",
    icon: "Medal",
    unlocked: false,
    requirement: 25,
  },
  {
    id: "fifty_quests",
    title: "Master Pemrograman",
    description: "Selesaikan 50 quest",
    icon: "Crown",
    unlocked: false,
    requirement: 50,
  },
  {
    id: "hundred_quests",
    title: "Legenda Coding",
    description: "Selesaikan 100 quest",
    icon: "Rocket",
    unlocked: false,
    requirement: 100,
  },
  {
    id: "two_hundred_quests",
    title: "Grandmaster",
    description: "Selesaikan 200 quest",
    icon: "Gem",
    unlocked: false,
    requirement: 200,
  },
  {
    id: "hundred_points",
    title: "Klub Seratus",
    description: "Dapatkan 100 poin",
    icon: "Zap",
    unlocked: false,
    requirement: 100,
  },
  {
    id: "five_hundred_points",
    title: "Pemburu Poin",
    description: "Dapatkan 500 poin",
    icon: "TrendingUp",
    unlocked: false,
    requirement: 500,
  },
  {
    id: "thousand_points",
    title: "Raja Poin",
    description: "Dapatkan 1000 poin",
    icon: "Crown",
    unlocked: false,
    requirement: 1000,
  },
  {
    id: "five_thousand_points",
    title: "Dewa Poin",
    description: "Dapatkan 5000 poin",
    icon: "Sparkles",
    unlocked: false,
    requirement: 5000,
  },
  {
    id: "streak_three",
    title: "Sedang Membara",
    description: "Streak 3 hari berturut-turut",
    icon: "Flame",
    unlocked: false,
    requirement: 3,
  },
  {
    id: "streak_seven",
    title: "Pejuang Mingguan",
    description: "Streak 7 hari berturut-turut",
    icon: "Target",
    unlocked: false,
    requirement: 7,
  },
  {
    id: "streak_fourteen",
    title: "Konsisten Sejati",
    description: "Streak 14 hari berturut-turut",
    icon: "Shield",
    unlocked: false,
    requirement: 14,
  },
  {
    id: "streak_thirty",
    title: "Warrior Sebulan",
    description: "Streak 30 hari berturut-turut",
    icon: "Sword",
    unlocked: false,
    requirement: 30,
  },
  {
    id: "perfect_day",
    title: "Hari Sempurna",
    description: "Selesaikan semua 7 quest dalam satu hari",
    icon: "CheckCircle",
    unlocked: false,
    requirement: 7,
  },
  {
    id: "hard_quest_master",
    title: "Penakluk Tantangan",
    description: "Selesaikan 10 quest sulit",
    icon: "Mountain",
    unlocked: false,
    requirement: 10,
  },
  {
    id: "hard_quest_legend",
    title: "Legenda Tantangan",
    description: "Selesaikan 50 quest sulit",
    icon: "Trophy",
    unlocked: false,
    requirement: 50,
  },
  {
    id: "early_bird",
    title: "Burung Awal",
    description: "Selesaikan quest sebelum jam 8 pagi",
    icon: "Sun",
    unlocked: false,
    requirement: 1,
  },
  {
    id: "night_owl",
    title: "Burung Hantu",
    description: "Selesaikan quest setelah jam 10 malam",
    icon: "Moon",
    unlocked: false,
    requirement: 1,
  },
];

export function getDefaultProgress(): UserProgress {
  return {
    totalScore: 0,
    questsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    achievements: [...DEFAULT_ACHIEVEMENTS],
    completedQuests: [],
  };
}

export function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Gagal memuat progres:", e);
  }
  return getDefaultProgress();
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error("Gagal menyimpan progres:", e);
  }
}

export function loadDailyQuests(): Quest[] | null {
  try {
    const storedDate = localStorage.getItem(STORAGE_KEYS.QUESTS_DATE);
    const today = new Date().toDateString();
    
    if (storedDate === today) {
      const quests = localStorage.getItem(STORAGE_KEYS.DAILY_QUESTS);
      if (quests) {
        return JSON.parse(quests);
      }
    }
  } catch (e) {
    console.error("Gagal memuat quest harian:", e);
  }
  return null;
}

export function saveDailyQuests(quests: Quest[]): void {
  try {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(quests));
    localStorage.setItem(STORAGE_KEYS.QUESTS_DATE, today);
  } catch (e) {
    console.error("Gagal menyimpan quest harian:", e);
  }
}

export function exportDataToExcel(): Blob {
  const progress = loadProgress();
  const quests = loadDailyQuests() || [];
  
  const progressData = [{
    "Total Skor": progress.totalScore,
    "Quest Selesai": progress.questsCompleted,
    "Streak Saat Ini": progress.currentStreak,
    "Streak Terbaik": progress.longestStreak,
    "Tanggal Terakhir Aktif": progress.lastActiveDate,
  }];
  
  const achievementsData = progress.achievements.map(a => ({
    "ID": a.id,
    "Judul": a.title,
    "Deskripsi": a.description,
    "Icon": a.icon,
    "Terbuka": a.unlocked ? "Ya" : "Tidak",
    "Tanggal Terbuka": a.unlockedAt || "-",
    "Syarat": a.requirement,
  }));
  
  const questsData = quests.map(q => ({
    "ID": q.id,
    "Judul": q.title,
    "Deskripsi": q.description,
    "Poin": q.points,
    "Kesulitan": q.difficulty,
    "Kategori": q.category,
    "Selesai": q.completed ? "Ya" : "Tidak",
    "Dibuat Pada": q.createdAt,
  }));
  
  const completedQuestsData = progress.completedQuests.map(q => ({
    "ID": q.id,
    "Judul": q.title,
    "Deskripsi": q.description,
    "Poin": q.points,
    "Kesulitan": q.difficulty,
    "Kategori": q.category,
    "Dibuat Pada": q.createdAt,
  }));
  
  const wb = XLSX.utils.book_new();
  
  const wsProgress = XLSX.utils.json_to_sheet(progressData);
  XLSX.utils.book_append_sheet(wb, wsProgress, "Progres");
  
  const wsAchievements = XLSX.utils.json_to_sheet(achievementsData);
  XLSX.utils.book_append_sheet(wb, wsAchievements, "Pencapaian");
  
  if (questsData.length > 0) {
    const wsQuests = XLSX.utils.json_to_sheet(questsData);
    XLSX.utils.book_append_sheet(wb, wsQuests, "Quest Hari Ini");
  }
  
  if (completedQuestsData.length > 0) {
    const wsCompleted = XLSX.utils.json_to_sheet(completedQuestsData);
    XLSX.utils.book_append_sheet(wb, wsCompleted, "Quest Selesai");
  }
  
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

export async function importDataFromExcel(file: File): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: "array" });
    
    const progressSheet = wb.Sheets["Progres"];
    if (progressSheet) {
      const progressData = XLSX.utils.sheet_to_json(progressSheet)[0] as Record<string, unknown>;
      
      const achievementsSheet = wb.Sheets["Pencapaian"];
      let achievements: Achievement[] = DEFAULT_ACHIEVEMENTS;
      
      if (achievementsSheet) {
        const achievementsData = XLSX.utils.sheet_to_json(achievementsSheet) as Array<Record<string, unknown>>;
        achievements = achievementsData.map(a => ({
          id: String(a["ID"] || ""),
          title: String(a["Judul"] || ""),
          description: String(a["Deskripsi"] || ""),
          icon: String(a["Icon"] || "Trophy"),
          unlocked: a["Terbuka"] === "Ya",
          unlockedAt: a["Tanggal Terbuka"] === "-" ? undefined : String(a["Tanggal Terbuka"]),
          requirement: Number(a["Syarat"] || 0),
        }));
      }
      
      let completedQuests: Quest[] = [];
      const completedSheet = wb.Sheets["Quest Selesai"];
      if (completedSheet) {
        const completedData = XLSX.utils.sheet_to_json(completedSheet) as Array<Record<string, unknown>>;
        completedQuests = completedData.map(q => ({
          id: String(q["ID"] || ""),
          title: String(q["Judul"] || ""),
          description: String(q["Deskripsi"] || ""),
          points: Number(q["Poin"] || 0),
          difficulty: String(q["Kesulitan"] || "easy") as "easy" | "medium" | "hard",
          category: String(q["Kategori"] || "general") as "javascript" | "php" | "css" | "general",
          completed: true,
          createdAt: String(q["Dibuat Pada"] || new Date().toISOString()),
        }));
      }
      
      const progress: UserProgress = {
        totalScore: Number(progressData["Total Skor"] || 0),
        questsCompleted: Number(progressData["Quest Selesai"] || 0),
        currentStreak: Number(progressData["Streak Saat Ini"] || 0),
        longestStreak: Number(progressData["Streak Terbaik"] || 0),
        lastActiveDate: String(progressData["Tanggal Terakhir Aktif"] || ""),
        achievements,
        completedQuests,
      };
      
      saveProgress(progress);
    }
    
    const questsSheet = wb.Sheets["Quest Hari Ini"];
    if (questsSheet) {
      const questsData = XLSX.utils.sheet_to_json(questsSheet) as Array<Record<string, unknown>>;
      const quests: Quest[] = questsData.map(q => ({
        id: String(q["ID"] || ""),
        title: String(q["Judul"] || ""),
        description: String(q["Deskripsi"] || ""),
        points: Number(q["Poin"] || 0),
        difficulty: String(q["Kesulitan"] || "easy") as "easy" | "medium" | "hard",
        category: String(q["Kategori"] || "general") as "javascript" | "php" | "css" | "general",
        completed: q["Selesai"] === "Ya",
        createdAt: String(q["Dibuat Pada"] || new Date().toISOString()),
      }));
      saveDailyQuests(quests);
    }
    
    return true;
  } catch (e) {
    console.error("Gagal mengimpor data dari Excel:", e);
    return false;
  }
}

export function checkAndResetAchievements(): { shouldReset: boolean; lastResetDate: string | null } {
  const lastResetDate = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENT_RESET_DATE);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  if (!lastResetDate) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENT_RESET_DATE, now.toISOString());
    return { shouldReset: false, lastResetDate: null };
  }
  
  const lastReset = new Date(lastResetDate);
  const lastResetMonth = lastReset.getMonth();
  const lastResetYear = lastReset.getFullYear();
  
  if (currentYear > lastResetYear || (currentYear === lastResetYear && currentMonth > lastResetMonth)) {
    return { shouldReset: true, lastResetDate };
  }
  
  return { shouldReset: false, lastResetDate };
}

export function resetAchievements(): void {
  const progress = loadProgress();
  const now = new Date();
  
  const resetProgress: UserProgress = {
    ...progress,
    questsCompleted: 0,
    totalScore: 0,
    currentStreak: 0,
    achievements: [...DEFAULT_ACHIEVEMENTS],
    completedQuests: [],
  };
  
  saveProgress(resetProgress);
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENT_RESET_DATE, now.toISOString());
}

export function getNextResetDate(): Date {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
}

export function getLastResetDate(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACHIEVEMENT_RESET_DATE);
}

export function getTodayDateString(): string {
  return new Date().toDateString();
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  if (progress.lastActiveDate === today) {
    return progress;
  }

  if (progress.lastActiveDate === yesterdayString) {
    const newStreak = progress.currentStreak + 1;
    return {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastActiveDate: today,
    };
  }

  return {
    ...progress,
    currentStreak: 1,
    lastActiveDate: today,
  };
}
