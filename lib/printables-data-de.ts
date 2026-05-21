// lib/printables-data-de.ts

export const CDN_BASE_URL =
  "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600;

export interface PrintableItem {
  id: string;
  title: string;
  description: string;
  difficulty: string; // Anzeige in Deutsch: Einfach, Mittel, etc.
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
  // Extrahiere Dateinamen ohne Erweiterung als eindeutige ID
  const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, "");

  // Behalte die ursprüngliche Suffix-Logik
  const detailPage = customDetails.detailPage || `/printables/${detailPageId}`;

  // Schwierigkeitsgrad-Mapping (deutscher Anzeigetext)
  const difficultyMap: Record<string, string> = {
    Easy: "Einfach",
    Medium: "Mittel",
    Hard: "Schwer",
    Extreme: "Extrem",
  };

  const difficulty = customDetails.difficulty || "Easy";
  const difficultyDE = difficultyMap[difficulty] || difficulty;

  const dotRange = customDetails.dotRange || [1, 50];
  const dotRangeString = Array.isArray(dotRange)
    ? dotRange[0] === dotRange[1]
      ? dotRange[0]
      : `${dotRange[0]}-${dotRange[1]}`
    : dotRange;
  const categories = customDetails.category || ["Allgemein"];

  // SEO-optimierter Standardtext für Deutsch
  const defaultAltText = `Punkt-zu-Punkt-Malvorlage Level ${difficultyDE.toLowerCase()}: ${title} (Punkte: ${dotRangeString}).`;
  const defaultSolutionAltText = `Lösung der Punkt-zu-Punkt-Aktivität von ${title} (Zahlen von ${dotRangeString}).`;
  const defaultDescription = `Eine unterhaltsame Punkt-zu-Punkt-Aktivität von ${title.toLowerCase()} für Kinder. Bildungsaktivität ideal zum Lernen der Zahlen und Verbessern der Feinmotorik. Perfekt für ${
    customDetails.ageRecommendation || "alle Altersgruppen"
  }.`;

  return {
    id: detailPageId, // Verwende Dateinamen als Haupt-ID für SSG-Slug
    title: title,
    description: customDetails.description || defaultDescription,
    difficulty: difficultyDE,
    tagColor: customDetails.tagColor || "bg-gray-500",
    imageUrl: CDN_BASE_URL + puzzleFilename,
    imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
    altText: customDetails.altText || defaultAltText,
    detailPage: detailPage,
    solutionUrl: CDN_BASE_URL + solutionFilename,
    solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,

    category: categories,
    dotRange: dotRange,
    ageRecommendation: customDetails.ageRecommendation || "Alle Altersgruppen",
    popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,
  };
}

export const printablesData: Record<string, PrintableItem[]> = {
  easy: [
    createPrintableItem(
      "bluey-playful-01",
      "Spielerische Bluey",
      "easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp",
      "easy-bluey-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 25],
        category: ["Cartoon", "Tiere"],
        ageRecommendation: "3-6 Jahre",
        popularity: 98,
        description:
          "Lass Bluey zum Leben erwecken, indem du die Punkte verbindest! Eine Punkt-zu-Punkt-Aktivität von 1 bis 25, ideal für kleine Fans der Serie.",
      }
    ),
    createPrintableItem(
      "happy-sun-03",
      "Fröhliche Sonne 3",
      "easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp",
      "easy-happy-sun-03-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 22],
        category: ["Natur"],
        ageRecommendation: "3-6 Jahre",
        popularity: 85,
        description:
          "Einfache Punkt-zu-Punkt-Malvorlage mit strahlender Sonne für Vorschulkinder.",
      }
    ),
    createPrintableItem(
      "rainbow",
      "Regenbogen",
      "easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp",
      "easy-rainbow-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 15],
        category: ["Natur"],
        ageRecommendation: "3-5 Jahre",
        popularity: 92,
        description:
          "Ein fröhlicher Regenbogen mit Wolken zum Verbinden der Punkte, perfekt zum Lernen der Zahlen von 1 bis 15.",
      }
    ),
    createPrintableItem(
      "robot-01",
      "Freundlicher Roboter",
      "easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp",
      "easy-robot-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 25],
        category: ["Fahrzeuge", "Roboter"],
        ageRecommendation: "4-7 Jahre",
        popularity: 78,
        description:
          "Einfache Punkt-zu-Punkt-Übung mit einem winkenden Roboter. Ideal für die Entwicklung motorischer Fähigkeiten.",
      }
    ),
    createPrintableItem(
      "sailboat",
      "Segelboot",
      "easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp",
      "easy-sailboat-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 20],
        category: ["Fahrzeuge"],
        ageRecommendation: "4-6 Jahre",
        popularity: 88,
        description:
          "Punkt-zu-Punkt-Aktivität von 1 bis 20 mit einem Segelboot auf dem Wasser. Ideal für den numerischen Einstieg.",
      }
    ),
    createPrintableItem(
      "dinosaur-01",
      "Langhals-Dinosaurier",
      "easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp",
      "easy-dinosaur-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 20],
        category: ["Tiere"],
        ageRecommendation: "4-7 Jahre",
        popularity: 89,
        description:
          "Punkt-zu-Punkt-Malvorlage eines sympatischen Dinosauriers für Kindergartenkinder.",
      }
    ),
    createPrintableItem(
      "dinosaur-02",
      "T-Rex-Dinosaurier",
      "easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp",
      "easy-dinosaur-02-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 25],
        category: ["Tiere"],
        ageRecommendation: "4-7 Jahre",
        popularity: 82,
        description:
          "Verbinde die Zahlen von 1 bis 25, um diesen lustigen T-Rex zu entdecken. Einfache Punkt-zu-Punkt-Aktivität.",
      }
    ),
    createPrintableItem(
      "flower-pot",
      "Blume in Topf",
      "easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp",
      "easy-flower-pot-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 18],
        category: ["Natur"],
        ageRecommendation: "3-6 Jahre",
        popularity: 75,
        description:
          "Punkt-zu-Punkt-Aktivität von 1 bis 18 mit einer blühenden Blume. Perfekt für Frühlingsaktivitäten.",
      }
    ),
    createPrintableItem(
      "happy-sun-01",
      "Fröhliche Sonne 1",
      "easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp",
      "easy-happy-sun-01-connect-the-dots-solution.webp",
      {
        difficulty: "Easy",
        tagColor: "bg-green-600",
        dotRange: [1, 20],
        category: ["Natur"],
        ageRecommendation: "3-6 Jahre",
        popularity: 87,
        description:
          "Punkt-zu-Punkt-Malvorlage einer Sonne mit Strahlen. Ausgezeichnet zum Üben der ersten Zahlen.",
      }
    ),
  ],
  medium: [
    createPrintableItem(
      "spongebob-classic-01",
      "Klassischer SpongeBob",
      "medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp",
      "medium-spongebob-01-connect-the-dots-solution.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 50],
        category: ["Cartoon", "Unter Wasser"],
        ageRecommendation: "5-8 Jahre",
        popularity: 95,
        description:
          "Verbinde 50 Punkte, um den Lieblingsschwamm von Bikini Bottom zu enthüllen. Ideal zum Üben der Zahlen von 1 bis 50.",
      }
    ),
    createPrintableItem(
      "castle-01",
      "Majestätisches Schloss",
      "medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp",
      "medium-castle-01-connect-the-dots-solution-1-80-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 80],
        category: ["Gebäude", "Fantasy"],
        ageRecommendation: "7-10 Jahre",
        popularity: 70,
        description:
          "Ein Punkt-zu-Punkt-Rätsel von 1 bis 80 mit einem Märchenschloss.",
      }
    ),
    createPrintableItem(
      "halloween-pumpkin-01",
      "Halloween-Kürbis",
      "medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp",
      "medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 65],
        category: ["Feiertage"],
        ageRecommendation: "7-10 Jahre",
        popularity: 80,
        description:
          "Punkt-zu-Punkt-Malvorlage eines Kürbisses. Themabasiertes Halloween-Spiel.",
      }
    ),
    createPrintableItem(
      "lighthouse-01",
      "Küstener Leuchtturm",
      "medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp",
      "medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 75],
        category: ["Gebäude", "Natur"],
        ageRecommendation: "8-11 Jahre",
        popularity: 65,
        description:
          "Detaillierte Punkt-zu-Punkt-Aktivität eines Leuchtturms vor dem Meer. Eine entspannende Szene zum Vervollständigen.",
      }
    ),
    createPrintableItem(
      "magical-unicorn-01",
      "Magisches Einhorn",
      "medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp",
      "medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 70],
        category: ["Fantasy", "Tiere"],
        ageRecommendation: "6-9 Jahre",
        popularity: 91,
        description:
          "Punkt-zu-Punkt-Malvorlage eines magischen Einhorns für Fantasy-Fans.",
      }
    ),
    createPrintableItem(
      "mushroom-house-01",
      "Zauberhafter Pilzhaus",
      "medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp",
      "medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 70],
        category: ["Fantasy"],
        ageRecommendation: "7-10 Jahre",
        popularity: 72,
        description:
          "Ein Pilzhaus zum Verbinden der Punkte, perfekt für junge Abenteurer.",
      }
    ),
    createPrintableItem(
      "pirate-ship-01",
      "Abenteuerliches Piratenschiff",
      "medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp",
      "medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 90],
        category: ["Fahrzeuge", "Abenteuer"],
        ageRecommendation: "8-12 Jahre",
        popularity: 86,
        description:
          "Herausforderung zum Verbinden der Punkte mit einem Piratenschiff. Befahre die Meere, indem du die Zahlen verbindest.",
      }
    ),
    createPrintableItem(
      "rocket-ship-01",
      "Weltraumrakete",
      "medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp",
      "medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 60],
        category: ["Weltraum", "Fahrzeuge"],
        ageRecommendation: "7-10 Jahre",
        popularity: 79,
        description:
          "Punkt-zu-Punkt-Aktivität einer Weltraumrakete für kleine Astronauten.",
      }
    ),
    createPrintableItem(
      "sports-car-01",
      "Sportwagen",
      "medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp",
      "medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 85],
        category: ["Fahrzeuge"],
        ageRecommendation: "8-11 Jahre",
        popularity: 83,
        description:
          "Ein Sportwagen zum Verbinden der Punkte. Perfekt für Autofans.",
      }
    ),
    createPrintableItem(
      "train-01",
      "Alter Zug",
      "medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp",
      "medium-train-01-connect-the-dots-solution-1-60-numbers.webp",
      {
        difficulty: "Medium",
        tagColor: "bg-yellow-600",
        dotRange: [1, 60],
        category: ["Fahrzeuge"],
        ageRecommendation: "7-10 Jahre",
        popularity: 76,
        description:
          "Punkt-zu-Punkt-Übung eines klassischen Zuges mit vielen Details.",
      }
    ),
  ],
  hard: [
    createPrintableItem(
      "mountain-landscape-html-original",
      "Berglandschaft",
      "6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif",
      "6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif",
      {
        difficulty: "Hard",
        tagColor: "bg-orange-600",
        dotRange: [100, 200],
        category: ["Natur", "Landschaften"],
        ageRecommendation: "12+ Jahre",
        popularity: 60,
        description:
          "Fortgeschrittene Punkt-zu-Punkt-Malvorlage einer Berglandschaft für Erwachsene. Entdecke eine malerische Aussicht.",
        detailPage: "/printables/adults",
      }
    ),
  ],
  extreme: [
    createPrintableItem(
      "extreme-mandala-html-original",
      "Extremes Mandala",
      "7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif",
      "7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots-solution.avif",
      {
        difficulty: "Extreme",
        tagColor: "bg-red-700",
        dotRange: [200, 300],
        category: ["Abstrakt", "Kunst"],
        ageRecommendation: "Erwachsene",
        popularity: 50,
        description:
          "Komplexes Mandala-Design mit extremer Schwierigkeit für Erwachsene. Eine echte intrikate Herausforderung.",
        detailPage: "/printables/hard",
      }
    ),
  ],
};

// Hole flaches Array aller Daten
export const getAllPrintables = () => {
  return Object.values(printablesData).flat();
};

// Hole Gesamtanzahl
export const getTotalCount = () => {
  return getAllPrintables().length;
};
