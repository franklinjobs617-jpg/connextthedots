// lib/printables-data-fr.ts

export const CDN_BASE_URL =
  "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600;

export interface PrintableItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tagColor: string;
  imageUrl: string;
  imageSrcset: string;
  altText: string;
  detailPage: string;
  solutionUrl: string;
  solutionAltText: string;
  category: string[];
  dotRange: number[] | string;
  ageRecommendation: string;
  popularity: number;
}

interface CustomDetails {
  difficulty?: string;
  dotRange?: number[] | string;
  category?: string[];
  ageRecommendation?: string;
  tagColor?: string;
  description?: string;
  altText?: string;
  solutionAltText?: string;
  popularity?: number;
  detailPage?: string;
  [key: string]: any;
}

export function createPrintableItem(
  id: string,
  title: string,
  puzzleFilename: string,
  solutionFilename: string,
  customDetails: CustomDetails = {}
): PrintableItem {
  const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, "");
  const detailPage = customDetails.detailPage || `/printables/${detailPageId}`;

  const difficultyMap: Record<string, string> = {
    Easy: "Facile",
    Medium: "Moyen",
    Hard: "Difficile",
    Extreme: "Extrême",
  };

  const difficulty = customDetails.difficulty || "Easy";
  const difficultyFR = difficultyMap[difficulty] || difficulty;

  const dotRange = customDetails.dotRange || [1, 50];
  const dotRangeString = Array.isArray(dotRange)
    ? dotRange[0] === dotRange[1]
      ? dotRange[0]
      : `${dotRange[0]}-${dotRange[1]}`
    : dotRange;
  const categories = customDetails.category || ["Général"];

  const defaultAltText = `Fiche point à relier à imprimer niveau ${difficultyFR.toLowerCase()} : ${title} (Points : ${dotRangeString}).`;
  const defaultSolutionAltText = `Solution du dessin points à relier de ${title} (Numéros de ${dotRangeString}).`;
  const defaultDescription = `Une activité amusante de points à relier ${title.toLowerCase()} pour enfants. Fiche éducative idéale pour apprendre les nombres. Parfait pour ${
    customDetails.ageRecommendation || "tous les âges"
  }.`;

  return {
    id: detailPageId,
    title: title,
    description: customDetails.description || defaultDescription,
    difficulty: difficultyFR,
    tagColor: customDetails.tagColor || "bg-gray-500",
    imageUrl: CDN_BASE_URL + puzzleFilename,
    imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
    altText: customDetails.altText || defaultAltText,
    detailPage: detailPage,
    solutionUrl: CDN_BASE_URL + solutionFilename,
    solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,
    category: categories,
    dotRange: dotRange,
    ageRecommendation: customDetails.ageRecommendation || "4-8 ans",
    popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,
  };
}

export const printablesData: Record<string, PrintableItem[]> = {
  easy: [
    createPrintableItem(
      "bluey-playful-01",
      "Bluey Joueur",
      "easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp",
      "easy-bluey-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 25],
        category: ["Dessins Animés", "Animaux"],
        ageRecommendation: "3-6 ans",
        popularity: 98,
      }
    ),
    createPrintableItem(
      "happy-sun-03",
      "Soleil Joyeux 3",
      "easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp",
      "easy-happy-sun-03-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 22],
        category: ["Nature"],
        ageRecommendation: "3-6 ans",
        popularity: 85,
      }
    ),
    createPrintableItem(
      "rainbow",
      "Arc-en-ciel",
      "easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp",
      "easy-rainbow-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 15],
        category: ["Nature"],
        ageRecommendation: "3-5 ans",
        popularity: 92,
      }
    ),
    createPrintableItem(
      "robot-01",
      "Robot Amical",
      "easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp",
      "easy-robot-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 25],
        category: ["Véhicules", "Robots"],
        ageRecommendation: "4-7 ans",
        popularity: 78,
      }
    ),
    createPrintableItem(
      "sailboat",
      "Voilier",
      "easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp",
      "easy-sailboat-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 20],
        category: ["Véhicules", "Mer"],
        ageRecommendation: "4-6 ans",
        popularity: 88,
      }
    ),
    createPrintableItem(
      "dinosaur-01",
      "Dinosaure Long-Cou",
      "easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp",
      "easy-dinosaur-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 20],
        category: ["Animaux"],
        ageRecommendation: "4-7 ans",
        popularity: 89,
      }
    ),
    createPrintableItem(
      "dinosaur-02",
      "Dinosaure T-Rex",
      "easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp",
      "easy-dinosaur-02-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 25],
        category: ["Animaux"],
        ageRecommendation: "4-7 ans",
        popularity: 82,
      }
    ),
    createPrintableItem(
      "flower-pot",
      "Pot de Fleurs",
      "easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp",
      "easy-flower-pot-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 18],
        category: ["Nature"],
        ageRecommendation: "3-6 ans",
        popularity: 75,
      }
    ),
    createPrintableItem(
      "happy-sun-01",
      "Soleil Joyeux 1",
      "easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp",
      "easy-happy-sun-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 20],
        category: ["Nature"],
        ageRecommendation: "3-6 ans",
        popularity: 87,
      }
    ),
  ],
  medium: [
    createPrintableItem(
      "spongebob-classic-01",
      "Bob l'Éponge Classique",
      "medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp",
      "medium-spongebob-01-connect-the-dots-solution.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 50],
        category: ["Dessins Animés", "Sous la mer"],
        ageRecommendation: "5-8 ans",
        popularity: 95,
      }
    ),
    createPrintableItem(
      "castle-01",
      "Château Majestueux",
      "medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp",
      "medium-castle-01-connect-the-dots-solution-1-80-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 80],
        category: ["Architecture", "Fantaisie"],
        ageRecommendation: "7-10 ans",
        popularity: 70,
      }
    ),
    createPrintableItem(
      "halloween-pumpkin-01",
      "Citrouille d'Halloween",
      "medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp",
      "medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 65],
        category: ["Festivals"],
        ageRecommendation: "7-10 ans",
        popularity: 80,
      }
    ),
    createPrintableItem(
      "lighthouse-01",
      "Phare Côtier",
      "medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp",
      "medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 75],
        category: ["Architecture", "Nature"],
        ageRecommendation: "8-11 ans",
        popularity: 65,
      }
    ),
    createPrintableItem(
      "magical-unicorn-01",
      "Licorne Magique",
      "medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp",
      "medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 70],
        category: ["Fantaisie", "Animaux"],
        ageRecommendation: "6-9 ans",
        popularity: 91,
      }
    ),
    createPrintableItem(
      "mushroom-house-01",
      "Maison Champignon",
      "medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp",
      "medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 70],
        category: ["Fantaisie"],
        ageRecommendation: "7-10 ans",
        popularity: 72,
      }
    ),
    createPrintableItem(
      "pirate-ship-01",
      "Navire Pirate",
      "medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp",
      "medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 90],
        category: ["Véhicules", "Aventure"],
        ageRecommendation: "8-12 ans",
        popularity: 86,
      }
    ),
    createPrintableItem(
      "rocket-ship-01",
      "Fusée Spatiale",
      "medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp",
      "medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 60],
        category: ["Espace", "Véhicules"],
        ageRecommendation: "7-10 ans",
        popularity: 79,
      }
    ),
    createPrintableItem(
      "sports-car-01",
      "Voiture de Sport",
      "medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp",
      "medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 85],
        category: ["Véhicules"],
        ageRecommendation: "8-11 ans",
        popularity: 83,
      }
    ),
    createPrintableItem(
      "train-01",
      "Train Ancien",
      "medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp",
      "medium-train-01-connect-the-dots-solution-1-60-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 60],
        category: ["Véhicules"],
        ageRecommendation: "7-10 ans",
        popularity: 76,
      }
    ),
  ],
  hard: [
    createPrintableItem(
      "dragon-flight",
      "Vol du Dragon",
      "hard-dragon-flight-connect-the-dots-puzzle-1-80-numbers.webp",
      "hard-dragon-flight-connect-the-dots-solution.webp",
      {
        difficulty: "Hard",
        tagColor: "bg-purple-600",
        dotRange: [1, 80],
        category: ["Fantaisie", "Créatures"],
        ageRecommendation: "9-12 ans",
        popularity: 91,
      }
    ),
    createPrintableItem(
      "eagle-soaring",
      "Aigle en Vol",
      "hard-eagle-soaring-connect-the-dots-puzzle-1-75-numbers.webp",
      "hard-eagle-soaring-connect-the-dots-solution.webp",
      {
        difficulty: "Hard",
        tagColor: "bg-purple-600",
        dotRange: [1, 75],
        category: ["Animaux", "Oiseaux"],
        ageRecommendation: "9-12 ans",
        popularity: 86,
      }
    ),
    createPrintableItem(
      "pirate-ship",
      "Navire Pirate",
      "hard-pirate-ship-connect-the-dots-puzzle-1-85-numbers.webp",
      "hard-pirate-ship-connect-the-dots-solution.webp",
      {
        difficulty: "Hard",
        tagColor: "bg-purple-600",
        dotRange: [1, 85],
        category: ["Aventure", "Mer"],
        ageRecommendation: "10-14 ans",
        popularity: 88,
      }
    ),
  ],
  extreme: [
    createPrintableItem(
      "detailed-mandala",
      "Mandala Détaillé",
      "extreme-detailed-mandala-connect-the-dots-puzzle-1-120-numbers.webp",
      "extreme-detailed-mandala-connect-the-dots-solution.webp",
      {
        difficulty: "Extreme",
        tagColor: "bg-red-600",
        dotRange: [1, 120],
        category: ["Art", "Méditation"],
        ageRecommendation: "12+ ans",
        popularity: 85,
      }
    ),
    createPrintableItem(
      "phoenix-rising",
      "Phénix Renaissant",
      "extreme-phoenix-rising-connect-the-dots-puzzle-1-150-numbers.webp",
      "extreme-phoenix-rising-connect-the-dots-solution.webp",
      {
        difficulty: "Extreme",
        tagColor: "bg-red-600",
        dotRange: [1, 150],
        category: ["Fantaisie", "Mythologie"],
        ageRecommendation: "14+ ans",
        popularity: 92,
      }
    ),
  ],
};

export const getAllPrintables = () => {
  return Object.values(printablesData).flat();
};

export const getTotalCount = () => {
  return getAllPrintables().length;
};
