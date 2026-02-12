// lib/printables-data-es.ts

export const CDN_BASE_URL = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600;

export interface PrintableItem {
    id: string;
    title: string;
    description: string;
    difficulty: string; // 界面显示为西语：Fácil, Medio, etc.
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
    // 提取不带扩展名的文件名作为图片的唯一标识符 (ID)
    const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, '');

    // 保持原来的  后缀逻辑
    const detailPage = customDetails.detailPage || `/printables/${detailPageId}`;

    // 难度映射（西语界面显示）
    const difficultyMap: Record<string, string> = {
        'Easy': 'Fácil',
        'Medium': 'Medio',
        'Hard': 'Difícil',
        'Extreme': 'Extremo'
    };

    const difficulty = customDetails.difficulty || 'Easy';
    const difficultyES = difficultyMap[difficulty] || difficulty;

    const dotRange = customDetails.dotRange || [1, 50];
    const dotRangeString = Array.isArray(dotRange) ?
        (dotRange[0] === dotRange[1] ? dotRange[0] : `${dotRange[0]}-${dotRange[1]}`) :
        dotRange;
    const categories = customDetails.category || ['General'];

    // 针对西班牙语 SEO 优化的默认文本
    const defaultAltText = `Dibujo de unir puntos para imprimir nivel ${difficultyES.toLowerCase()}: ${title} (Puntos: ${dotRangeString}).`;
    const defaultSolutionAltText = `Solución de la ficha de unir puntos de ${title} (Números del ${dotRangeString}).`;
    const defaultDescription = `Una divertida actividad de unir puntos de ${title.toLowerCase()} para niños. Ficha educativa ideal para aprender los números y mejorar la motricidad fina. Perfecto para ${customDetails.ageRecommendation || 'todas las edades'}.`;

    return {
        id: detailPageId, // 使用文件名作为主 ID 以匹配 SSG slug
        title: title,
        description: customDetails.description || defaultDescription,
        difficulty: difficultyES,
        tagColor: customDetails.tagColor || 'bg-gray-500',
        imageUrl: CDN_BASE_URL + puzzleFilename,
        imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
        altText: customDetails.altText || defaultAltText,
        detailPage: detailPage,
        solutionUrl: CDN_BASE_URL + solutionFilename,
        solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,

        category: categories,
        dotRange: dotRange,
        ageRecommendation: customDetails.ageRecommendation || 'Todas las edades',
        popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,
    };
}

export const printablesData: Record<string, PrintableItem[]> = {
    easy: [
        createPrintableItem(
            'bluey-playful-01', 'Bluey Juguetón',
            'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-bluey-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy',
                tagColor: 'bg-green-600',
                dotRange: [1, 25],
                category: ['Dibujos Animados', 'Animales'],
                ageRecommendation: '3-6 años',
                popularity: 98,
                description: '¡Haz que Bluey cobre vida uniendo los puntos! Una ficha de unir puntos del 1 al 25 ideal para los pequeños fans de la serie.'
            }
        ),
        createPrintableItem(
            'happy-sun-03', 'Sol Feliz 3',
            'easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp',
            'easy-happy-sun-03-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 22], category: ['Naturaleza'], ageRecommendation: '3-6 años', popularity: 85,
                description: 'Dibujo de unir puntos fácil con un sol radiante para niños de preescolar.'
            }
        ),
        createPrintableItem(
            'rainbow', 'Arcoíris',
            'easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp',
            'easy-rainbow-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 15], category: ['Naturaleza'], ageRecommendation: '3-5 años', popularity: 92,
                description: 'Un alegre arcoíris para unir puntos con nubes, perfecto para aprender los números del 1 al 15.'
            }
        ),
        createPrintableItem(
            'robot-01', 'Robot Amistoso',
            'easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-robot-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Vehículos', 'Robots'], ageRecommendation: '4-7 años', popularity: 78,
                description: 'Ejercicio de unir puntos sencillo con un robot saludando. Ideal para desarrollar habilidades motoras.'
            }
        ),
        createPrintableItem(
            'sailboat', 'Velero',
            'easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-sailboat-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Vehículos'], ageRecommendation: '4-6 años', popularity: 88,
                description: 'Ficha de unir puntos del 1 al 20 con un velero en el agua. Ideal para iniciación numérica.'
            }
        ),
        createPrintableItem(
            'dinosaur-01', 'Dinosaurio Cuello Largo',
            'easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-dinosaur-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Animales'], ageRecommendation: '4-7 años', popularity: 89,
                description: 'Dibujo para unir puntos de un simpático dinosaurio para niños de infantil.'
            }
        ),
        createPrintableItem(
            'dinosaur-02', 'Dinosaurio T-Rex',
            'easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-dinosaur-02-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Animales'], ageRecommendation: '4-7 años', popularity: 82,
                description: 'Une los números del 1 al 25 para descubrir a este divertido T-Rex. Actividad de unir puntos fácil.'
            }
        ),
        createPrintableItem(
            'flower-pot', 'Flor en Maceta',
            'easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp',
            'easy-flower-pot-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 18], category: ['Naturaleza'], ageRecommendation: '3-6 años', popularity: 75,
                description: 'Actividad de unir puntos del 1 al 18 con una flor floreciendo. Perfecto para actividades de primavera.'
            }
        ),
        createPrintableItem(
            'happy-sun-01', 'Sol Feliz 1',
            'easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-happy-sun-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Naturaleza'], ageRecommendation: '3-6 años', popularity: 87,
                description: 'Dibujo de unir puntos de un sol con rayos. Excelente para practicar los primeros números.'
            }
        ),
    ],
    medium: [
        createPrintableItem(
            'spongebob-classic-01', 'Bob Esponja Clásico',
            'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp',
            'medium-spongebob-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Medium',
                tagColor: 'bg-yellow-600',
                dotRange: [1, 50],
                category: ['Dibujos Animados', 'Bajo el Mar'],
                ageRecommendation: '5-8 años',
                popularity: 95,
                description: 'Une 50 puntos para revelar a la esponja favorita de Fondo de Bikini. Ideal para practicar números del 1 al 50.'
            }
        ),
        createPrintableItem(
            'castle-01', 'Castillo Majestuoso',
            'medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp',
            'medium-castle-01-connect-the-dots-solution-1-80-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 80], category: ['Edificios', 'Fantasía'], ageRecommendation: '7-10 años', popularity: 70,
                description: 'Un rompecabezas de unir puntos del 1 al 80 con un castillo de cuento de hadas.'
            }
        ),
        createPrintableItem(
            'halloween-pumpkin-01', 'Calabaza de Halloween',
            'medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp',
            'medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 65], category: ['Festivos'], ageRecommendation: '7-10 años', popularity: 80,
                description: 'Dibujo de calabaza para unir puntos. Diversión temática para Halloween.'
            }
        ),
        createPrintableItem(
            'lighthouse-01', 'Faro Costero',
            'medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp',
            'medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 75], category: ['Edificios', 'Naturaleza'], ageRecommendation: '8-11 años', popularity: 65,
                description: 'Detallada ficha de unir puntos de un faro frente al mar. Una escena relajante para completar.'
            }
        ),
        createPrintableItem(
            'magical-unicorn-01', 'Unicornio Mágico',
            'medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasía', 'Animales'], ageRecommendation: '6-9 años', popularity: 91,
                description: 'Dibujo de unir puntos de un unicornio mágico para fans de la fantasía.'
            }
        ),
        createPrintableItem(
            'mushroom-house-01', 'Casa Hongo Fantástica',
            'medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasía'], ageRecommendation: '7-10 años', popularity: 72,
                description: 'Una casa hongo para unir puntos perfecta para jóvenes aventureros.'
            }
        ),
        createPrintableItem(
            'pirate-ship-01', 'Barco Pirata Aventurero',
            'medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp',
            'medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 90], category: ['Vehículos', 'Aventura'], ageRecommendation: '8-12 años', popularity: 86,
                description: 'Desafío de unir puntos con un barco pirata. Surca los mares uniendo los números.'
            }
        ),
        createPrintableItem(
            'rocket-ship-01', 'Cohete Espacial',
            'medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Espacio', 'Vehículos'], ageRecommendation: '7-10 años', popularity: 79,
                description: 'Ficha de unir puntos de un cohete espacial para pequeños astronautas.'
            }
        ),
        createPrintableItem(
            'sports-car-01', 'Coche Deportivo',
            'medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp',
            'medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 85], category: ['Vehículos'], ageRecommendation: '8-11 años', popularity: 83,
                description: 'Un coche deportivo para unir puntos. Perfecto para entusiastas de los coches.'
            }
        ),
        createPrintableItem(
            'train-01', 'Tren Antiguo',
            'medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-train-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Vehículos'], ageRecommendation: '7-10 años', popularity: 76,
                description: 'Ejercicio de unir puntos de un tren clásico con muchos detalles.'
            }
        ),
    ],
    hard: [
        createPrintableItem(
            'mountain-landscape-html-original', 'Paisaje de Montaña',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif',
            {
                difficulty: 'Hard', tagColor: 'bg-orange-600',
                dotRange: [100, 200], category: ['Naturaleza', 'Paisajes'], ageRecommendation: '12+ años', popularity: 60,
                description: 'Dibujo de unir puntos avanzado de un paisaje montañoso para adultos. Descubre una vista escénica.',
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
                dotRange: [200, 300], category: ['Abstracto', 'Arte'], ageRecommendation: 'Adultos', popularity: 50,
                description: 'Diseño de mandala complejo de dificultad extrema para adultos. Un verdadero desafío intrincado.',
                detailPage: '/printables/hard',
            }
        ),
    ]
};

// 获取所有数据的扁平数组
export const getAllPrintables = () => {
    return Object.values(printablesData).flat();
};

// 获取总数
export const getTotalCount = () => {
    return getAllPrintables().length;
};