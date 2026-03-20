// lib/printables-data-it.ts

export const CDN_BASE_URL = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600;

export interface PrintableItem {
    id: string;
    title: string;
    description: string;
    difficulty: string; // Visualizzazione in italiano: Facile, Medio, etc.
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
    // Estrai il nome del file senza estensione come ID unico
    const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, '');

    // Mantieni la logica del suffisso originale
    const detailPage = customDetails.detailPage || `/printables/${detailPageId}`;

    // Mappatura della difficoltà (testo di visualizzazione in italiano)
    const difficultyMap: Record<string, string> = {
        'Easy': 'Facile',
        'Medium': 'Medio',
        'Hard': 'Difficile',
        'Extreme': 'Estremo'
    };

    const difficulty = customDetails.difficulty || 'Easy';
    const difficultyIT = difficultyMap[difficulty] || difficulty;

    const dotRange = customDetails.dotRange || [1, 50];
    const dotRangeString = Array.isArray(dotRange) ?
        (dotRange[0] === dotRange[1] ? dotRange[0] : `${dotRange[0]}-${dotRange[1]}`) :
        dotRange;
    const categories = customDetails.category || ['Generale'];

    // Testo predefinito ottimizzato per SEO in italiano
    const defaultAltText = `Foglio da colorare con numeri livello ${difficultyIT.toLowerCase()}: ${title} (Punti: ${dotRangeString}).`;
    const defaultSolutionAltText = `Soluzione dell' attività di unisci i puntini di ${title} (Numeri da ${dotRangeString}).`;
    const defaultDescription = `Un divertente attività di unisci i puntini di ${title.toLowerCase()} per bambini. Attività educativa ideale per imparare i numeri e migliorare la motricità fine. Perfetto per ${customDetails.ageRecommendation || 'tutte le età'}.`;

    return {
        id: detailPageId, // Usa il nome del file come ID principale per lo slug SSG
        title: title,
        description: customDetails.description || defaultDescription,
        difficulty: difficultyIT,
        tagColor: customDetails.tagColor || 'bg-gray-500',
        imageUrl: CDN_BASE_URL + puzzleFilename,
        imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
        altText: customDetails.altText || defaultAltText,
        detailPage: detailPage,
        solutionUrl: CDN_BASE_URL + solutionFilename,
        solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,

        category: categories,
        dotRange: dotRange,
        ageRecommendation: customDetails.ageRecommendation || 'Tutte le età',
        popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,
    };
}

export const printablesData: Record<string, PrintableItem[]> = {
    easy: [
        createPrintableItem(
            'bluey-playful-01', 'Bluey Gioiosa',
            'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-bluey-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy',
                tagColor: 'bg-green-600',
                dotRange: [1, 25],
                category: ['Cartoni animati', 'Animali'],
                ageRecommendation: '3-6 anni',
                popularity: 98,
                description: 'Fai venire Bluey alla vita collegando i punti! Un attività di unisci i puntini da 1 a 25, ideale per i piccoli fan della serie.'
            }
        ),
        createPrintableItem(
            'happy-sun-03', 'Sole Felice 3',
            'easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp',
            'easy-happy-sun-03-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 22], category: ['Natura'], ageRecommendation: '3-6 anni', popularity: 85,
                description: 'Facile foglio da colorare con numeri con un sole radiante per bambini in asilo.'
            }
        ),
        createPrintableItem(
            'rainbow', 'Arcobaleno',
            'easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp',
            'easy-rainbow-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 15], category: ['Natura'], ageRecommendation: '3-5 anni', popularity: 92,
                description: 'Un arcobaleno allegro con nuvole da collegare, perfetto per imparare i numeri da 1 a 15.'
            }
        ),
        createPrintableItem(
            'robot-01', 'Robot Amichevole',
            'easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-robot-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Veicoli', 'Robot'], ageRecommendation: '4-7 anni', popularity: 78,
                description: 'Facile esercizio di unisci i puntini con un robot che saluta. Ideale per sviluppare le capacità motorie.'
            }
        ),
        createPrintableItem(
            'sailboat', 'Veliero',
            'easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-sailboat-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Veicoli'], ageRecommendation: '4-6 anni', popularity: 88,
                description: 'Attività di unisci i puntini da 1 a 20 con un veliero sull\'acqua. Ideale per l\'iniziazione numerica.'
            }
        ),
        createPrintableItem(
            'dinosaur-01', 'Dinosauro dal collo lungo',
            'easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-dinosaur-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Animali'], ageRecommendation: '4-7 anni', popularity: 89,
                description: 'Foglio da colorare con numeri di un simpatico dinosauro per bambini in asilo.'
            }
        ),
        createPrintableItem(
            'dinosaur-02', 'Dinosauro T-Rex',
            'easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-dinosaur-02-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Animali'], ageRecommendation: '4-7 anni', popularity: 82,
                description: 'Collega i numeri da 1 a 25 per scoprire questo divertente T-Rex. Facile attività di unisci i puntini.'
            }
        ),
        createPrintableItem(
            'flower-pot', 'Fiore in vaso',
            'easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp',
            'easy-flower-pot-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 18], category: ['Natura'], ageRecommendation: '3-6 anni', popularity: 75,
                description: 'Attività di unisci i puntini da 1 a 18 con un fiore in fiore. Perfetto per le attività primaverili.'
            }
        ),
        createPrintableItem(
            'happy-sun-01', 'Sole Felice 1',
            'easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-happy-sun-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Natura'], ageRecommendation: '3-6 anni', popularity: 87,
                description: 'Foglio da colorare con numeri di un sole con raggi. Eccellente per praticare i primi numeri.'
            }
        ),
    ],
    medium: [
        createPrintableItem(
            'spongebob-classic-01', 'SpongeBob Classico',
            'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp',
            'medium-spongebob-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Medium',
                tagColor: 'bg-yellow-600',
                dotRange: [1, 50],
                category: ['Cartoni animati', 'Sotto il mare'],
                ageRecommendation: '5-8 anni',
                popularity: 95,
                description: 'Collega 50 punti per scoprire la spugna preferita di Bikini Bottom. Ideale per praticare i numeri da 1 a 50.'
            }
        ),
        createPrintableItem(
            'castle-01', 'Castello Maestoso',
            'medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp',
            'medium-castle-01-connect-the-dots-solution-1-80-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 80], category: ['Edifici', 'Fantasia'], ageRecommendation: '7-10 anni', popularity: 70,
                description: 'Un puzzle di unisci i puntini da 1 a 80 con un castello di fiaba.'
            }
        ),
        createPrintableItem(
            'halloween-pumpkin-01', 'Zucca di Halloween',
            'medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp',
            'medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 65], category: ['Feste'], ageRecommendation: '7-10 anni', popularity: 80,
                description: 'Foglio da colorare con numeri di una zucca. Divertimento tematico per Halloween.'
            }
        ),
        createPrintableItem(
            'lighthouse-01', 'Faro Costiero',
            'medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp',
            'medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 75], category: ['Edifici', 'Natura'], ageRecommendation: '8-11 anni', popularity: 65,
                description: 'Attività dettagliata di unisci i puntini di un faro di fronte al mare. Una scena rilassante da completare.'
            }
        ),
        createPrintableItem(
            'magical-unicorn-01', 'Unicorno Magico',
            'medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasia', 'Animali'], ageRecommendation: '6-9 anni', popularity: 91,
                description: 'Foglio da colorare con numeri di un unicorno magico per i fan di fantasy.'
            }
        ),
        createPrintableItem(
            'mushroom-house-01', 'Casa del Fungo Fantastica',
            'medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasia'], ageRecommendation: '7-10 anni', popularity: 72,
                description: 'Una casa del fungo da collegare, perfetta per i giovani avventurieri.'
            }
        ),
        createPrintableItem(
            'pirate-ship-01', 'Nave Pirata Avventurosa',
            'medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp',
            'medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 90], category: ['Veicoli', 'Avventura'], ageRecommendation: '8-12 anni', popularity: 86,
                description: 'Sfida di unisci i puntini con una nave pirata. Naviga i mari collegando i numeri.'
            }
        ),
        createPrintableItem(
            'rocket-ship-01', 'Razzo Spaziale',
            'medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Spazio', 'Veicoli'], ageRecommendation: '7-10 anni', popularity: 79,
                description: 'Attività di unisci i puntini di un razzo spaziale per i piccoli astronauti.'
            }
        ),
        createPrintableItem(
            'sports-car-01', 'Auto da Sport',
            'medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp',
            'medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 85], category: ['Veicoli'], ageRecommendation: '8-11 anni', popularity: 83,
                description: 'Un\'auto da sport da collegare. Perfetta per gli amanti delle auto.'
            }
        ),
        createPrintableItem(
            'train-01', 'Treno Antico',
            'medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-train-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Veicoli'], ageRecommendation: '7-10 anni', popularity: 76,
                description: 'Esercizio di unisci i puntini di un treno classico con molti dettagli.'
            }
        ),
    ],
    hard: [
        createPrintableItem(
            'mountain-landscape-html-original', 'Paesaggio Montano',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif',
            {
                difficulty: 'Hard', tagColor: 'bg-orange-600',
                dotRange: [100, 200], category: ['Natura', 'Paesaggi'], ageRecommendation: '12+ anni', popularity: 60,
                description: 'Avanzato foglio da colorare con numeri di un paesaggio montano per adulti. Scopri un panorama pittoresco.',
                detailPage: '/printables/adults',
            }
        ),
    ],
    extreme: [
        createPrintableItem(
            'extreme-mandala-html-original', 'Mandala Estremo',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots-solution.avif',
            {
                difficulty: 'Extreme', tagColor: 'bg-red-700',
                dotRange: [200, 300], category: ['Astrazione', 'Arte'], ageRecommendation: 'Adulti', popularity: 50,
                description: 'Design di mandala complesso di difficoltà estrema per adulti. Una vera sfida intricata.',
                detailPage: '/printables/hard',
            }
        ),
    ]
};

// Ottieni un array piatto di tutti i dati
export const getAllPrintables = () => {
    return Object.values(printablesData).flat();
};

// Ottieni il conteggio totale
export const getTotalCount = () => {
    return getAllPrintables().length;
};