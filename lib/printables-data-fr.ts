// lib/printables-data-fr.ts

export const CDN_BASE_URL = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600;

export interface PrintableItem {
    id: string;
    title: string;
    description: string;
    difficulty: string; // Affichage en français: Facile, Moyen, etc.
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
    // Extraire le nom de fichier sans extension comme ID unique
    const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, '');

    // Conserver la logique de suffixe originale
    const detailPage = customDetails.detailPage || `/printables/${detailPageId}`;

    // Carte de difficulté (texte d'affichage en français)
    const difficultyMap: Record<string, string> = {
        'Easy': 'Facile',
        'Medium': 'Moyen',
        'Hard': 'Difficile',
        'Extreme': 'Extrême'
    };

    const difficulty = customDetails.difficulty || 'Easy';
    const difficultyFR = difficultyMap[difficulty] || difficulty;

    const dotRange = customDetails.dotRange || [1, 50];
    const dotRangeString = Array.isArray(dotRange) ?
        (dotRange[0] === dotRange[1] ? dotRange[0] : `${dotRange[0]}-${dotRange[1]}`) :
        dotRange;
    const categories = customDetails.category || ['Général'];

    // Texte par défaut optimisé pour le SEO en français
    const defaultAltText = `Feuille de points à relier niveau ${difficultyFR.toLowerCase()}: ${title} (Points: ${dotRangeString}).`;
    const defaultSolutionAltText = `Solution de l'activité de points à relier de ${title} (Chiffres de ${dotRangeString}).`;
    const defaultDescription = `Une activité amusante de points à relier de ${title.toLowerCase()} pour enfants. Activité éducative idéale pour apprendre les chiffres et améliorer la motricité fine. Parfait pour ${customDetails.ageRecommendation || 'tous les âges'}.`;

    return {
        id: detailPageId, // Utiliser le nom de fichier comme ID principal pour le slug SSG
        title: title,
        description: customDetails.description || defaultDescription,
        difficulty: difficultyFR,
        tagColor: customDetails.tagColor || 'bg-gray-500',
        imageUrl: CDN_BASE_URL + puzzleFilename,
        imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
        altText: customDetails.altText || defaultAltText,
        detailPage: detailPage,
        solutionUrl: CDN_BASE_URL + solutionFilename,
        solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,

        category: categories,
        dotRange: dotRange,
        ageRecommendation: customDetails.ageRecommendation || 'Tous les âges',
        popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,
    };
}

export const printablesData: Record<string, PrintableItem[]> = {
    easy: [
        createPrintableItem(
            'bluey-playful-01', 'Bluey Joueuse',
            'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-bluey-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy',
                tagColor: 'bg-green-600',
                dotRange: [1, 25],
                category: ['Dessins animés', 'Animaux'],
                ageRecommendation: '3-6 ans',
                popularity: 98,
                description: 'Faites vivre Bluey en reliant les points ! Une activité de points à relier de 1 à 25, idéale pour les petits fans de la série.'
            }
        ),
        createPrintableItem(
            'happy-sun-03', 'Soleil Heureux 3',
            'easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp',
            'easy-happy-sun-03-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 22], category: ['Nature'], ageRecommendation: '3-6 ans', popularity: 85,
                description: 'Feuille de points à relier facile avec un soleil rayonnant pour les enfants en maternelle.'
            }
        ),
        createPrintableItem(
            'rainbow', 'Arc-en-ciel',
            'easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp',
            'easy-rainbow-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 15], category: ['Nature'], ageRecommendation: '3-5 ans', popularity: 92,
                description: 'Un arc-en-ciel joyeux avec des nuages à relier, parfait pour apprendre les chiffres de 1 à 15.'
            }
        ),
        createPrintableItem(
            'robot-01', 'Robot Amical',
            'easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-robot-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Véhicules', 'Robots'], ageRecommendation: '4-7 ans', popularity: 78,
                description: 'Exercice facile de points à relier avec un robot qui salue. Idéal pour développer les capacités motrices.'
            }
        ),
        createPrintableItem(
            'sailboat', 'Voilier',
            'easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-sailboat-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Véhicules'], ageRecommendation: '4-6 ans', popularity: 88,
                description: 'Activité de points à relier de 1 à 20 avec un voilier sur l\'eau. Idéale pour l\'initiation numérique.'
            }
        ),
        createPrintableItem(
            'dinosaur-01', 'Dinosaure à Long Cou',
            'easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-dinosaur-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Animaux'], ageRecommendation: '4-7 ans', popularity: 89,
                description: 'Feuille de points à relier d\'un dinosaure sympathique pour les enfants en maternelle.'
            }
        ),
        createPrintableItem(
            'dinosaur-02', 'Dinosaure T-Rex',
            'easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-dinosaur-02-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Animaux'], ageRecommendation: '4-7 ans', popularity: 82,
                description: 'Reliez les chiffres de 1 à 25 pour découvrir ce T-Rex amusant. Activité facile de points à relier.'
            }
        ),
        createPrintableItem(
            'flower-pot', 'Fleur dans un Pot',
            'easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp',
            'easy-flower-pot-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 18], category: ['Nature'], ageRecommendation: '3-6 ans', popularity: 75,
                description: 'Activité de points à relier de 1 à 18 avec une fleur en fleur. Parfaite pour les activités printanières.'
            }
        ),
        createPrintableItem(
            'happy-sun-01', 'Soleil Heureux 1',
            'easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-happy-sun-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Nature'], ageRecommendation: '3-6 ans', popularity: 87,
                description: 'Feuille de points à relier d\'un soleil avec des rayons. Excellent pour pratiquer les premiers chiffres.'
            }
        ),
    ],
    medium: [
        createPrintableItem(
            'spongebob-classic-01', 'Bob l\'éponge Classique',
            'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp',
            'medium-spongebob-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Medium',
                tagColor: 'bg-yellow-600',
                dotRange: [1, 50],
                category: ['Dessins animés', 'Sous-marin'],
                ageRecommendation: '5-8 ans',
                popularity: 95,
                description: 'Reliez 50 points pour découvrir l\'éponge préférée de Bikini Bottom. Idéal pour pratiquer les chiffres de 1 à 50.'
            }
        ),
        createPrintableItem(
            'castle-01', 'Château Majestueux',
            'medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp',
            'medium-castle-01-connect-the-dots-solution-1-80-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 80], category: ['Bâtiments', 'Fantaisie'], ageRecommendation: '7-10 ans', popularity: 70,
                description: 'Un puzzle de points à relier de 1 à 80 avec un château de conte de fées.'
            }
        ),
        createPrintableItem(
            'halloween-pumpkin-01', 'Citrouille d\'Halloween',
            'medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp',
            'medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 65], category: ['Fêtes'], ageRecommendation: '7-10 ans', popularity: 80,
                description: 'Feuille de points à relier d\'une citrouille. Divertissement thématique pour Halloween.'
            }
        ),
        createPrintableItem(
            'lighthouse-01', 'Phare Côtiers',
            'medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp',
            'medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 75], category: ['Bâtiments', 'Nature'], ageRecommendation: '8-11 ans', popularity: 65,
                description: 'Activité détaillée de points à relier d\'un phare face à la mer. Une scène relaxante à compléter.'
            }
        ),
        createPrintableItem(
            'magical-unicorn-01', 'Licorne Magique',
            'medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantaisie', 'Animaux'], ageRecommendation: '6-9 ans', popularity: 91,
                description: 'Feuille de points à relier d\'une licorne magique pour les fans de fantasy.'
            }
        ),
        createPrintableItem(
            'mushroom-house-01', 'Maison de Champignon Fantastique',
            'medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantaisie'], ageRecommendation: '7-10 ans', popularity: 72,
                description: 'Une maison de champignon à relier, parfaite pour les jeunes aventuriers.'
            }
        ),
        createPrintableItem(
            'pirate-ship-01', 'Bateau Pirate Aventureux',
            'medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp',
            'medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 90], category: ['Véhicules', 'Aventure'], ageRecommendation: '8-12 ans', popularity: 86,
                description: 'Défi de points à relier avec un bateau pirate. Naviguez les mers en reliant les chiffres.'
            }
        ),
        createPrintableItem(
            'rocket-ship-01', 'Fusée Spatiale',
            'medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Espace', 'Véhicules'], ageRecommendation: '7-10 ans', popularity: 79,
                description: 'Activité de points à relier d\'une fusée spatiale pour les petits astronautes.'
            }
        ),
        createPrintableItem(
            'sports-car-01', 'Voiture de Sport',
            'medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp',
            'medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 85], category: ['Véhicules'], ageRecommendation: '8-11 ans', popularity: 83,
                description: 'Une voiture de sport à relier. Parfaite pour les amateurs de voitures.'
            }
        ),
        createPrintableItem(
            'train-01', 'Train Ancien',
            'medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-train-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Véhicules'], ageRecommendation: '7-10 ans', popularity: 76,
                description: 'Exercice de points à relier d\'un train classique avec beaucoup de détails.'
            }
        ),
    ],
    hard: [
        createPrintableItem(
            'mountain-landscape-html-original', 'Paysage de Montagne',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif',
            {
                difficulty: 'Hard', tagColor: 'bg-orange-600',
                dotRange: [100, 200], category: ['Nature', 'Paysages'], ageRecommendation: '12+ ans', popularity: 60,
                description: 'Feuille de points à relier avancée d\'un paysage de montagne pour adultes. Découvrez une vue pittoresque.',
                detailPage: '/printables/adults',
            }
        ),
    ],
    extreme: [
        createPrintableItem(
            'extreme-mandala-html-original', 'Mandala Extrême',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots-solution.avif',
            {
                difficulty: 'Extreme', tagColor: 'bg-red-700',
                dotRange: [200, 300], category: ['Abstrait', 'Art'], ageRecommendation: 'Adultes', popularity: 50,
                description: 'Design de mandala complexe de difficulté extrême pour adultes. Un véritable défi intriguant.',
                detailPage: '/printables/hard',
            }
        ),
    ]
};

// Obtenir un tableau plat de toutes les données
export const getAllPrintables = () => {
    return Object.values(printablesData).flat();
};

// Obtenir le nombre total
export const getTotalCount = () => {
    return getAllPrintables().length;
};
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
