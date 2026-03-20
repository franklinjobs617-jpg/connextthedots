// lib/printables-data-nl.ts

export const CDN_BASE_URL = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600;

export interface PrintableItem {
    id: string;
    title: string;
    description: string;
    difficulty: string; // Weergave in Nederlands: Makkelijk, Medium, etc.
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
    // Haal bestandsnaam zonder extensie als unieke ID
    const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, '');

    // Houd de originele suffix-logica
    const detailPage = customDetails.detailPage || `/printables/${detailPageId}`;

    // Moeilijkheidsgraad-mapping (weergavetekst in Nederlands)
    const difficultyMap: Record<string, string> = {
        'Easy': 'Makkelijk',
        'Medium': 'Medium',
        'Hard': 'Moeilijk',
        'Extreme': 'Extreem'
    };

    const difficulty = customDetails.difficulty || 'Easy';
    const difficultyNL = difficultyMap[difficulty] || difficulty;

    const dotRange = customDetails.dotRange || [1, 50];
    const dotRangeString = Array.isArray(dotRange) ?
        (dotRange[0] === dotRange[1] ? dotRange[0] : `${dotRange[0]}-${dotRange[1]}`) :
        dotRange;
    const categories = customDetails.category || ['Algemeen'];

    // SEO-geoptimaliseerde standaardtekst voor Nederlands
    const defaultAltText = `Punt-op-punt-tekening niveau ${difficultyNL.toLowerCase()}: ${title} (Punten: ${dotRangeString}).`;
    const defaultSolutionAltText = `Oplossing van de punt-op-punt-activiteit van ${title} (Getallen van ${dotRangeString}).`;
    const defaultDescription = `Een leuke punt-op-punt-activiteit van ${title.toLowerCase()} voor kinderen. Educatieve activiteit ideaal voor het leren van getallen en verbetering van fijne motoriek. Perfect voor ${customDetails.ageRecommendation || 'alle leeftijden'}.`;

    return {
        id: detailPageId, // Gebruik bestandsnaam als hoofd-ID voor SSG-slug
        title: title,
        description: customDetails.description || defaultDescription,
        difficulty: difficultyNL,
        tagColor: customDetails.tagColor || 'bg-gray-500',
        imageUrl: CDN_BASE_URL + puzzleFilename,
        imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
        altText: customDetails.altText || defaultAltText,
        detailPage: detailPage,
        solutionUrl: CDN_BASE_URL + solutionFilename,
        solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,

        category: categories,
        dotRange: dotRange,
        ageRecommendation: customDetails.ageRecommendation || 'Alle leeftijden',
        popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,
    };
}

export const printablesData: Record<string, PrintableItem[]> = {
    easy: [
        createPrintableItem(
            'bluey-playful-01', 'Speelse Bluey',
            'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-bluey-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy',
                tagColor: 'bg-green-600',
                dotRange: [1, 25],
                category: ['Cartoon', 'Dieren'],
                ageRecommendation: '3-6 jaar',
                popularity: 98,
                description: 'Laat Bluey tot leven komen door de punten te verbinden! Een punt-op-punt-activiteit van 1 tot 25, ideaal voor kleine fans van de serie.'
            }
        ),
        createPrintableItem(
            'happy-sun-03', 'Vrolijke Zon 3',
            'easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp',
            'easy-happy-sun-03-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 22], category: ['Natuur'], ageRecommendation: '3-6 jaar', popularity: 85,
                description: 'Makkelijke punt-op-punt-tekening met een stralende zon voor peuters.'
            }
        ),
        createPrintableItem(
            'rainbow', 'Regenboog',
            'easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp',
            'easy-rainbow-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 15], category: ['Natuur'], ageRecommendation: '3-5 jaar', popularity: 92,
                description: 'Een vrolijke regenboog met wolken om te verbinden, perfect voor het leren van getallen van 1 tot 15.'
            }
        ),
        createPrintableItem(
            'robot-01', 'Vriendelijke Robot',
            'easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-robot-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Voertuigen', 'Robots'], ageRecommendation: '4-7 jaar', popularity: 78,
                description: 'Makkelijke punt-op-punt-oefening met een wakkende robot. Ideaal voor het ontwikkelen van motorische vaardigheden.'
            }
        ),
        createPrintableItem(
            'sailboat', 'Zeilboot',
            'easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-sailboat-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Voertuigen'], ageRecommendation: '4-6 jaar', popularity: 88,
                description: 'Punt-op-punt-activiteit van 1 tot 20 met een zeilboot op het water. Ideaal voor de numerieke introductie.'
            }
        ),
        createPrintableItem(
            'dinosaur-01', 'Langhalsdinosaurus',
            'easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-dinosaur-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Dieren'], ageRecommendation: '4-7 jaar', popularity: 89,
                description: 'Punt-op-punt-tekening van een sympathieke dinosaurius voor peuters.'
            }
        ),
        createPrintableItem(
            'dinosaur-02', 'T-Rex Dinosaurus',
            'easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-dinosaur-02-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Dieren'], ageRecommendation: '4-7 jaar', popularity: 82,
                description: 'Verbind de getallen van 1 tot 25 om deze leuke T-Rex te ontdekken. Makkelijke punt-op-punt-activiteit.'
            }
        ),
        createPrintableItem(
            'flower-pot', 'Bloem in Pot',
            'easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp',
            'easy-flower-pot-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 18], category: ['Natuur'], ageRecommendation: '3-6 jaar', popularity: 75,
                description: 'Punt-op-punt-activiteit van 1 tot 18 met een bloeiende bloem. Perfect voor lenteactiviteiten.'
            }
        ),
        createPrintableItem(
            'happy-sun-01', 'Vrolijke Zon 1',
            'easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-happy-sun-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Natuur'], ageRecommendation: '3-6 jaar', popularity: 87,
                description: 'Punt-op-punt-tekening van een zon met stralen. Uitstekend voor het oefenen van de eerste getallen.'
            }
        ),
    ],
    medium: [
        createPrintableItem(
            'spongebob-classic-01', 'Klassieke SpongeBob',
            'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp',
            'medium-spongebob-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Medium',
                tagColor: 'bg-yellow-600',
                dotRange: [1, 50],
                category: ['Cartoon', 'Onder Water'],
                ageRecommendation: '5-8 jaar',
                popularity: 95,
                description: 'Verbind 50 punten om de favoriete spons van Bikini Bottom te ontdekken. Ideaal voor het oefenen van getallen van 1 tot 50.'
            }
        ),
        createPrintableItem(
            'castle-01', 'Majestueus Kasteel',
            'medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp',
            'medium-castle-01-connect-the-dots-solution-1-80-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 80], category: ['Gebouwen', 'Fantasie'], ageRecommendation: '7-10 jaar', popularity: 70,
                description: 'Een punt-op-punt-puzzel van 1 tot 80 met een sprookjeskasteel.'
            }
        ),
        createPrintableItem(
            'halloween-pumpkin-01', 'Halloween Pompoen',
            'medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp',
            'medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 65], category: ['Feestdagen'], ageRecommendation: '7-10 jaar', popularity: 80,
                description: 'Punt-op-punt-tekening van een pompoen. Thematisch plezier voor Halloween.'
            }
        ),
        createPrintableItem(
            'lighthouse-01', 'Kustverlighthouse',
            'medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp',
            'medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 75], category: ['Gebouwen', 'Natuur'], ageRecommendation: '8-11 jaar', popularity: 65,
                description: 'Gedetailleerde punt-op-punt-activiteit van een vuurtoren voor zee. Een ontspannende scène om te voltooien.'
            }
        ),
        createPrintableItem(
            'magical-unicorn-01', 'Magische Eenhoorn',
            'medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasie', 'Dieren'], ageRecommendation: '6-9 jaar', popularity: 91,
                description: 'Punt-op-punt-tekening van een magische eenhoorn voor fantasy-fans.'
            }
        ),
        createPrintableItem(
            'mushroom-house-01', 'Magische paddenstoelhuis',
            'medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasie'], ageRecommendation: '7-10 jaar', popularity: 72,
                description: 'Een paddenstoelhuis om te verbinden, perfect voor jonge avonturiers.'
            }
        ),
        createPrintableItem(
            'pirate-ship-01', 'Avontuurlijk Piratenschip',
            'medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp',
            'medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 90], category: ['Voertuigen', 'Avontuur'], ageRecommendation: '8-12 jaar', popularity: 86,
                description: 'Uitdaging om punten te verbinden met een piratenschip. Vaar de zeeën door de getallen te verbinden.'
            }
        ),
        createPrintableItem(
            'rocket-ship-01', 'Ruimteschip',
            'medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Ruimte', 'Voertuigen'], ageRecommendation: '7-10 jaar', popularity: 79,
                description: 'Punt-op-punt-activiteit van een ruimteschip voor kleine astronauten.'
            }
        ),
        createPrintableItem(
            'sports-car-01', 'Sportauto',
            'medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp',
            'medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 85], category: ['Voertuigen'], ageRecommendation: '8-11 jaar', popularity: 83,
                description: 'Een sportauto om te verbinden. Perfect voor autoliefhebbers.'
            }
        ),
        createPrintableItem(
            'train-01', 'Oude Trein',
            'medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-train-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Voertuigen'], ageRecommendation: '7-10 jaar', popularity: 76,
                description: 'Punt-op-punt-oefening van een klassieke trein met veel details.'
            }
        ),
    ],
    hard: [
        createPrintableItem(
            'mountain-landscape-html-original', 'Berglandschap',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif',
            {
                difficulty: 'Hard', tagColor: 'bg-orange-600',
                dotRange: [100, 200], category: ['Natuur', 'Landschappen'], ageRecommendation: '12+ jaar', popularity: 60,
                description: 'Geavanceerde punt-op-punt-tekening van een berglandschap voor volwassenen. Ontdek een landschapsschittering.',
                detailPage: '/printables/adults',
            }
        ),
    ],
    extreme: [
        createPrintableItem(
            'extreme-mandala-html-original', 'Extreem Mandala',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots-solution.avif',
            {
                difficulty: 'Extreme', tagColor: 'bg-red-700',
                dotRange: [200, 300], category: ['Abstract', 'Kunst'], ageRecommendation: 'Volwassenen', popularity: 50,
                description: 'Complex mandala-design met extreme moeilijkheidsgraad voor volwassenen. Een echte intrigerende uitdaging.',
                detailPage: '/printables/hard',
            }
        ),
    ]
};

// Haal plat array van alle gegevens
export const getAllPrintables = () => {
    return Object.values(printablesData).flat();
};

// Haal totale telling
export const getTotalCount = () => {
    return getAllPrintables().length;
};