import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  category: "javascript" | "php" | "css" | "general";
  completed: boolean;
  createdAt: string;
}

export async function generateDailyQuests(): Promise<Quest[]> {
  if (!openai) {
    console.log("OpenAI API key tidak dikonfigurasi, menggunakan quest fallback");
    return getFallbackQuests();
  }

  const prompt = `Buat 7 quest seru untuk siswa pemula. Sertakan campuran:
- Quest belajar pemrograman (JavaScript, PHP, CSS)
- Quest kehidupan/produktivitas umum (olahraga, membaca, organisasi, kreativitas, perawatan diri)

Quest harus:
- Sederhana dan dapat diselesaikan dalam 15-30 menit
- Memotivasi dan menyemangati
- Campuran kategori berbeda
- Berbagai tingkat kesulitan tapi kebanyakan mudah

Balas dengan objek JSON berisi array quest. Setiap quest harus memiliki:
- title: Judul singkat menarik dalam Bahasa Indonesia (maks 50 karakter)
- description: Deskripsi jelas tentang apa yang harus dilakukan dalam Bahasa Indonesia (maks 150 karakter)
- points: Hadiah poin (10-50 berdasarkan kesulitan)
- difficulty: "easy", "medium", atau "hard" (kebanyakan easy)
- category: "javascript", "php", "css", atau "general" (gunakan "general" untuk quest non-pemrograman)

Sertakan minimal 3 quest kehidupan/umum dan 4 quest pemrograman.
PENTING: Semua title dan description HARUS dalam Bahasa Indonesia.

Format: { "quests": [...] }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Kamu adalah life coach dan tutor pemrograman yang membantu membuat tantangan seru dan mudah. Buat quest sederhana dan menyemangati. Campurkan pembelajaran pemrograman dengan kebiasaan hidup sehat. Balas dengan JSON valid saja. SEMUA teks harus dalam Bahasa Indonesia.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Tidak ada respons dari AI");
    }

    const parsed = JSON.parse(content);
    const now = new Date().toISOString();

    const quests: Quest[] = parsed.quests.map((q: any, index: number) => ({
      id: `quest-${Date.now()}-${index}`,
      title: String(q.title || "Quest Harian").slice(0, 50),
      description: String(q.description || "Selesaikan quest ini untuk mendapat poin!").slice(0, 150),
      points: Math.min(50, Math.max(10, Number(q.points) || 15)),
      difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "easy",
      category: ["javascript", "php", "css", "general"].includes(q.category) ? q.category : "general",
      completed: false,
      createdAt: now,
    }));

    return quests;
  } catch (error) {
    console.error("Gagal membuat quest:", error);
    return getFallbackQuests();
  }
}

const programmingQuests = [
  {
    title: "Ahli Console Log",
    description: "Tulis 3 statement console.log berbeda di JavaScript",
    points: 15,
    difficulty: "easy" as const,
    category: "javascript" as const,
  },
  {
    title: "Penjelajah Warna CSS",
    description: "Buat div dengan warna latar dan border kustom",
    points: 15,
    difficulty: "easy" as const,
    category: "css" as const,
  },
  {
    title: "PHP Halo Dunia",
    description: "Tulis script PHP yang menampilkan 'Halo Dunia'",
    points: 10,
    difficulty: "easy" as const,
    category: "php" as const,
  },
  {
    title: "Latihan Variabel",
    description: "Buat 5 variabel dengan tipe berbeda di JavaScript",
    points: 20,
    difficulty: "easy" as const,
    category: "javascript" as const,
  },
  {
    title: "Bermain Flexbox",
    description: "Buat layout flexbox sederhana dengan 3 item",
    points: 20,
    difficulty: "easy" as const,
    category: "css" as const,
  },
  {
    title: "Metode Array",
    description: "Latihan menggunakan map, filter, atau reduce pada array",
    points: 25,
    difficulty: "medium" as const,
    category: "javascript" as const,
  },
  {
    title: "Loop Array PHP",
    description: "Buat array dan loop dengan foreach",
    points: 15,
    difficulty: "easy" as const,
    category: "php" as const,
  },
  {
    title: "Animasi CSS",
    description: "Buat animasi atau efek transisi CSS sederhana",
    points: 25,
    difficulty: "medium" as const,
    category: "css" as const,
  },
];

const generalQuests = [
  {
    title: "Pahlawan Hidrasi",
    description: "Minum 2 gelas air sekarang juga",
    points: 10,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Waktu Peregangan",
    description: "Lakukan 5 menit latihan peregangan",
    points: 15,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Momen Mindful",
    description: "Ambil 5 menit untuk bernapas dalam dan rileks",
    points: 10,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Tantangan Rapikan Meja",
    description: "Bersihkan dan rapikan area kerja selama 10 menit",
    points: 15,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Waktu Membaca",
    description: "Baca artikel atau bab buku selama 15 menit",
    points: 20,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Jalan-Jalan Santai",
    description: "Jalan kaki 10 menit di luar atau sekitar rumah",
    points: 20,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Jurnal Syukur",
    description: "Tulis 3 hal yang kamu syukuri hari ini",
    points: 15,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Belajar Hal Baru",
    description: "Tonton video edukasi singkat tentang topik apapun",
    points: 15,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Terhubung dengan Seseorang",
    description: "Kirim pesan ke teman atau anggota keluarga",
    points: 10,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Istirahat Mata",
    description: "Alihkan pandangan dari layar selama 5 menit (aturan 20-20-20)",
    points: 10,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Rencanakan Besok",
    description: "Tulis 3 tujuan atau tugas untuk besok",
    points: 15,
    difficulty: "easy" as const,
    category: "general" as const,
  },
  {
    title: "Camilan Sehat",
    description: "Makan buah atau camilan sehat",
    points: 10,
    difficulty: "easy" as const,
    category: "general" as const,
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getFallbackQuests(): Quest[] {
  const now = new Date().toISOString();
  
  const selectedProgramming = shuffleArray(programmingQuests).slice(0, 4);
  const selectedGeneral = shuffleArray(generalQuests).slice(0, 3);
  
  const allSelected = shuffleArray([...selectedProgramming, ...selectedGeneral]);
  
  return allSelected.map((quest, index) => ({
    id: `quest-${Date.now()}-${index}`,
    title: quest.title,
    description: quest.description,
    points: quest.points,
    difficulty: quest.difficulty,
    category: quest.category,
    completed: false,
    createdAt: now,
  }));
}
