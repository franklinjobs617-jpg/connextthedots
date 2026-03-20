// lib/printables-data-pt.ts

export const CDN_BASE_URL = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600;

export interface PrintableItem {
    id: string;
    title: string;
    description: string;
    difficulty: string; // Exibição em português: Fácil, Médio, etc.
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
    // Extrair o nome do arquivo sem extensão como ID único
    const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, '');

    // Manter a lógica de sufixo original
    const detailPage = customDetails.detailPage || `/printables/${detailPageId}`;

    // Mapeamento de dificuldade (texto de exibição em português)
    const difficultyMap: Record<string, string> = {
        'Easy': 'Fácil',
        'Medium': 'Médio',
        'Hard': 'Difícil',
        'Extreme': 'Extremo'
    };

    const difficulty = customDetails.difficulty || 'Easy';
    const difficultyPT = difficultyMap[difficulty] || difficulty;

    const dotRange = customDetails.dotRange || [1, 50];
    const dotRangeString = Array.isArray(dotRange) ?
        (dotRange[0] === dotRange[1] ? dotRange[0] : `${dotRange[0]}-${dotRange[1]}`) :
        dotRange;
    const categories = customDetails.category || ['Geral'];

    // Texto padrão otimizado para SEO em português
    const defaultAltText = `Folha de unir pontos nível ${difficultyPT.toLowerCase()}: ${title} (Pontos: ${dotRangeString}).`;
    const defaultSolutionAltText = `Solução da atividade de unir pontos de ${title} (Números de ${dotRangeString}).`;
    const defaultDescription = `Uma divertida atividade de unir pontos de ${title.toLowerCase()} para crianças. Atividade educativa ideal para aprender números e melhorar a motricidade fina. Perfeito para ${customDetails.ageRecommendation || 'todas as idades'}.`;

    return {
        id: detailPageId, // Usar o nome do arquivo como ID principal para o slug SSG
        title: title,
        description: customDetails.description || defaultDescription,
        difficulty: difficultyPT,
        tagColor: customDetails.tagColor || 'bg-gray-500',
        imageUrl: CDN_BASE_URL + puzzleFilename,
        imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
        altText: customDetails.altText || defaultAltText,
        detailPage: detailPage,
        solutionUrl: CDN_BASE_URL + solutionFilename,
        solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,

        category: categories,
        dotRange: dotRange,
        ageRecommendation: customDetails.ageRecommendation || 'Todas as idades',
        popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,
    };
}

export const printablesData: Record<string, PrintableItem[]> = {
    easy: [
        createPrintableItem(
            'bluey-playful-01', 'Bluey Brincalhona',
            'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-bluey-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy',
                tagColor: 'bg-green-600',
                dotRange: [1, 25],
                category: ['Desenhos animados', 'Animais'],
                ageRecommendation: '3-6 anos',
                popularity: 98,
                description: 'Deixe Bluey ganhar vida conectando os pontos! Uma atividade de unir pontos de 1 a 25, ideal para pequenos fãs da série.'
            }
        ),
        createPrintableItem(
            'happy-sun-03', 'Sol Feliz 3',
            'easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp',
            'easy-happy-sun-03-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 22], category: ['Natureza'], ageRecommendation: '3-6 anos', popularity: 85,
                description: 'Folha de unir pontos fácil com um sol radiante para crianças em pré-escola.'
            }
        ),
        createPrintableItem(
            'rainbow', 'Arco-íris',
            'easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp',
            'easy-rainbow-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 15], category: ['Natureza'], ageRecommendation: '3-5 anos', popularity: 92,
                description: 'Um arco-íris feliz com nuvens para conectar, perfeito para aprender números de 1 a 15.'
            }
        ),
        createPrintableItem(
            'robot-01', 'Robô Amigável',
            'easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-robot-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Veículos', 'Robôs'], ageRecommendation: '4-7 anos', popularity: 78,
                description: 'Exercício fácil de unir pontos com um robô que acena. Ideal para desenvolver habilidades motoras.'
            }
        ),
        createPrintableItem(
            'sailboat', 'Veleiro',
            'easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-sailboat-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Veículos'], ageRecommendation: '4-6 anos', popularity: 88,
                description: 'Atividade de unir pontos de 1 a 20 com um veleiro na água. Ideal para a introdução numérica.'
            }
        ),
        createPrintableItem(
            'dinosaur-01', 'Dinossauro de Pescoço Longo',
            'easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-dinosaur-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Animais'], ageRecommendation: '4-7 anos', popularity: 89,
                description: 'Folha de unir pontos de um dinossauro simpático para crianças em pré-escola.'
            }
        ),
        createPrintableItem(
            'dinosaur-02', 'Dinossauro T-Rex',
            'easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-dinosaur-02-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Animais'], ageRecommendation: '4-7 anos', popularity: 82,
                description: 'Conecte os números de 1 a 25 para descobrir este T-Rex divertido. Atividade fácil de unir pontos.'
            }
        ),
        createPrintableItem(
            'flower-pot', 'Flor em Vaso',
            'easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp',
            'easy-flower-pot-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 18], category: ['Natureza'], ageRecommendation: '3-6 anos', popularity: 75,
                description: 'Atividade de unir pontos de 1 a 18 com uma flor florescendo. Perfeita para atividades de primavera.'
            }
        ),
        createPrintableItem(
            'happy-sun-01', 'Sol Feliz 1',
            'easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-happy-sun-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Natureza'], ageRecommendation: '3-6 anos', popularity: 87,
                description: 'Folha de unir pontos de um sol com raios. Excelente para praticar os primeiros números.'
            }
        ),
    ],
    medium: [
        createPrintableItem(
            'spongebob-classic-01', 'Bob Esponja Clássico',
            'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp',
            'medium-spongebob-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Medium',
                tagColor: 'bg-yellow-600',
                dotRange: [1, 50],
                category: ['Desenhos animados', 'Sob a água'],
                ageRecommendation: '5-8 anos',
                popularity: 95,
                description: 'Conecte 50 pontos para revelar a esponja favorita de Fundo de Bikini. Ideal para praticar números de 1 a 50.'
            }
        ),
        createPrintableItem(
            'castle-01', 'Castelo Majestoso',
            'medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp',
            'medium-castle-01-connect-the-dots-solution-1-80-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 80], category: ['Edifícios', 'Fantasia'], ageRecommendation: '7-10 anos', popularity: 70,
                description: 'Um quebra-cabeça de unir pontos de 1 a 80 com um castelo de conto de fadas.'
            }
        ),
        createPrintableItem(
            'halloween-pumpkin-01', 'Abóbora de Halloween',
            'medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp',
            'medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 65], category: ['Feriados'], ageRecommendation: '7-10 anos', popularity: 80,
                description: 'Folha de unir pontos de uma abóbora. Diversão temática para Halloween.'
            }
        ),
        createPrintableItem(
            'lighthouse-01', 'Farol Costeiro',
            'medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp',
            'medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 75], category: ['Edifícios', 'Natureza'], ageRecommendation: '8-11 anos', popularity: 65,
                description: 'Atividade detalhada de unir pontos de um farol frente ao mar. Uma cena relaxante para completar.'
            }
        ),
        createPrintableItem(
            'magical-unicorn-01', 'Unicórnio Mágico',
            'medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasia', 'Animais'], ageRecommendation: '6-9 anos', popularity: 91,
                description: 'Folha de unir pontos de um unicórnio mágico para fãs de fantasia.'
            }
        ),
        createPrintableItem(
            'mushroom-house-01', 'Casa de Cogumelo Fantástica',
            'medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasia'], ageRecommendation: '7-10 anos', popularity: 72,
                description: 'Uma casa de cogumelo para conectar, perfeita para jovens aventureiros.'
            }
        ),
        createPrintableItem(
            'pirate-ship-01', 'Navio Pirata Aventureiro',
            'medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp',
            'medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 90], category: ['Veículos', 'Aventura'], ageRecommendation: '8-12 anos', popularity: 86,
                description: 'Desafio de unir pontos com um navio pirata. Navegue pelos mares conectando os números.'
            }
        ),
        createPrintableItem(
            'rocket-ship-01', 'Foguete Espacial',
            'medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Espaço', 'Veículos'], ageRecommendation: '7-10 anos', popularity: 79,
                description: 'Atividade de unir pontos de um foguete espacial para pequenos astronautas.'
            }
        ),
        createPrintableItem(
            'sports-car-01', 'Carro Esportivo',
            'medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp',
            'medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 85], category: ['Veículos'], ageRecommendation: '8-11 anos', popularity: 83,
                description: 'Um carro esportivo para conectar. Perfeito para entusiastas de carros.'
            }
        ),
        createPrintableItem(
            'train-01', 'Trem Antigo',
            'medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-train-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Veículos'], ageRecommendation: '7-10 anos', popularity: 76,
                description: 'Exercício de unir pontos de um trem clássico com muitos detalhes.'
            }
        ),
    ],
    hard: [
        createPrintableItem(
            'mountain-landscape-html-original', 'Paisagem de Montanha',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif',
            {
                difficulty: 'Hard', tagColor: 'bg-orange-600',
                dotRange: [100, 200], category: ['Natureza', 'Paisagens'], ageRecommendation: '12+ anos', popularity: 60,
                description: 'Folha avançada de unir pontos de uma paisagem de montanha para adultos. Descubra uma vista pitoresca.',
                detailPage: '/printables/adults',
            }
        ),
    ],
    extreme: [
        createPrintableItem(
            'extreme-mandala-html-original', 'Mandala Extremo',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots-solution.avif',
            {
                difficulty: 'Extreme', tagColor: 'bg-red-700',
                dotRange: [200, 300], category: ['Abstrato', 'Arte'], ageRecommendation: 'Adultos', popularity: 50,
                description: 'Design de mandala complexo de dificuldade extrema para adultos. Um verdadeiro desafio intrincado.',
                detailPage: '/printables/hard',
            }
        ),
    ]
};

// Obter um array plano de todos os dados
export const getAllPrintables = () => {
    return Object.values(printablesData).flat();
};

// Obter o contador total
export const getTotalCount = () => {
    return getAllPrintables().length;
};