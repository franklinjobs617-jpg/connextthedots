
// lib/printables-data.ts
export const CDN_BASE_URL = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/";
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
// 获取总数
export const getTotalCount = () => {
    return getAllPrintables().length;
};
export function createPrintableItem(
    id: string, // 这里的 id 将被忽略，改用文件名
    title: string,
    puzzleFilename: string,
    solutionFilename: string,
    customDetails: any = {}
): PrintableItem {
    // 关键修复：统一使用文件名（不带扩展名）作为 ID，以匹配 URL 访问
    const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, '');
    const detailPage = `/printables/${detailPageId}`;

    const difficulty = customDetails.difficulty || 'Easy';
    const dotRange = customDetails.dotRange || [1, 50];
    const dotRangeString = Array.isArray(dotRange) ?
        (dotRange[0] === dotRange[1] ? dotRange[0] : `${dotRange[0]}-${dotRange[1]}`) :
        dotRange;

    const categories = customDetails.category || ['General'];

    return {
        id: detailPageId, // 必须是 detailPageId 才能匹配 slug
        title: title,
        description: customDetails.description || `A fun ${difficulty.toLowerCase()} dot to dot activity.`,
        difficulty: difficulty,
        tagColor: customDetails.tagColor || 'bg-gray-500',
        imageUrl: CDN_BASE_URL + puzzleFilename,
        imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
        altText: customDetails.altText || `Connect the dots ${title}`,
        detailPage: detailPage,
        solutionUrl: CDN_BASE_URL + solutionFilename,
        solutionAltText: customDetails.solutionAltText || `Solution ${title}`,
        category: categories,
        dotRange: dotRange,
        ageRecommendation: customDetails.ageRecommendation || 'All Ages',
        popularity: customDetails.popularity || 50,
        ...customDetails
    };
}

// 数据部分保持不变（此时 id 会自动转为文件名形式）
export const printablesData: Record<string, PrintableItem[]> = {
    easy: [
        createPrintableItem('bluey-playful-01', 'Playful Bluey', 'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp', 'easy-bluey-01-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Cartoons', 'Animals'], ageRecommendation: '3-6 Years', popularity: 98 }),
        createPrintableItem('happy-sun-03', 'Happy Sun 3', 'easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp', 'easy-happy-sun-03-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 22], category: ['Nature'], ageRecommendation: '3-6 Years', popularity: 85 }),
        createPrintableItem('rainbow', 'Rainbow', 'easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp', 'easy-rainbow-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 15], category: ['Nature'], ageRecommendation: '3-5 Years', popularity: 92 }),
        createPrintableItem('robot-01', 'Friendly Robot', 'easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp', 'easy-robot-01-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Vehicles', 'Robots'], ageRecommendation: '4-7 Years', popularity: 78 }),
        createPrintableItem('sailboat', 'Sailboat', 'easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp', 'easy-sailboat-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Vehicles'], ageRecommendation: '4-6 Years', popularity: 88 }),
        createPrintableItem('dinosaur-01', 'Long-neck Dinosaur', 'easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp', 'easy-dinosaur-01-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Animals'], ageRecommendation: '4-7 Years', popularity: 89 }),
        createPrintableItem('dinosaur-02', 'T-Rex Dinosaur', 'easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp', 'easy-dinosaur-02-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Animals'], ageRecommendation: '4-7 Years', popularity: 82 }),
        createPrintableItem('flower-pot', 'Flower in a Pot', 'easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp', 'easy-flower-pot-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 18], category: ['Nature'], ageRecommendation: '3-6 Years', popularity: 75 }),
        createPrintableItem('happy-sun-01', 'Happy Sun 1', 'easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp', 'easy-happy-sun-01-connect-the-dots-solution.webp', { difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Nature'], ageRecommendation: '3-6 Years', popularity: 87 }),
    ],
    medium: [
        createPrintableItem('spongebob-classic-01', 'Classic SpongeBob', 'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp', 'medium-spongebob-01-connect-the-dots-solution.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 50], category: ['Cartoons', 'Under the Sea'], ageRecommendation: '5-8 Years', popularity: 95 }),
        createPrintableItem('castle-01', 'Majestic Castle', 'medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp', 'medium-castle-01-connect-the-dots-solution-1-80-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 80], category: ['Buildings', 'Fantasy'], ageRecommendation: '7-10 Years', popularity: 70 }),
        createPrintableItem('halloween-pumpkin-01', 'Halloween Pumpkin', 'medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp', 'medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 65], category: ['Holiday'], ageRecommendation: '7-10 Years', popularity: 80 }),
        createPrintableItem('lighthouse-01', 'Coastal Lighthouse', 'medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp', 'medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 75], category: ['Buildings', 'Nature'], ageRecommendation: '8-11 Years', popularity: 65 }),
        createPrintableItem('magical-unicorn-01', 'Magical Unicorn', 'medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp', 'medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasy', 'Animals'], ageRecommendation: '6-9 Years', popularity: 91 }),
        createPrintableItem('mushroom-house-01', 'Whimsical Mushroom House', 'medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp', 'medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasy'], ageRecommendation: '7-10 Years', popularity: 72 }),
        createPrintableItem('pirate-ship-01', 'Adventurous Pirate Ship', 'medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp', 'medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 90], category: ['Vehicles', 'Adventure'], ageRecommendation: '8-12 Years', popularity: 86 }),
        createPrintableItem('rocket-ship-01', 'Space Rocket Ship', 'medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp', 'medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Space', 'Vehicles'], ageRecommendation: '7-10 Years', popularity: 79 }),
        createPrintableItem('sports-car-01', 'Cool Sports Car', 'medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp', 'medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 85], category: ['Vehicles'], ageRecommendation: '8-11 Years', popularity: 83 }),
        createPrintableItem('train-01', 'Old-fashioned Train', 'medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp', 'medium-train-01-connect-the-dots-solution-1-60-numbers.webp', { difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Vehicles'], ageRecommendation: '7-10 Years', popularity: 76 }),
    ],
    hard: [
        createPrintableItem('mountain-landscape-html-original', 'Mountain Landscape', '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif', '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif', { difficulty: 'Hard', tagColor: 'bg-orange-600', dotRange: [100, 200], category: ['Nature', 'Scenery'], ageRecommendation: '12+ Years', popularity: 60 }),
    ],
    extreme: [
        createPrintableItem('extreme-mandala-html-original', 'Extreme Mandala', '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif', '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots-solution.avif', { difficulty: 'Extreme', tagColor: 'bg-red-700', dotRange: [200, 300], category: ['Abstract', 'Art'], ageRecommendation: 'Adults', popularity: 50 }),
    ]
};

export const getAllPrintables = () => Object.values(printablesData).flat();