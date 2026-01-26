// data.js
export const CDN_BASE_URL = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/"; // This is the base for all files.
export const IMAGE_DEFAULT_WIDTH = 600;
export const IMAGE_DEFAULT_HEIGHT = 600; // Assuming square images

export function createPrintableItem(id, title, puzzleFilename, solutionFilename, customDetails = {}) {
    // 提取不带扩展名的文件名作为图片的唯一标识符 (ID)
    const detailPageId = puzzleFilename.replace(/\.(webp|avif|png|jpg)$/, '');
    const detailPage = customDetails.detailPage || `/printables/${detailPageId}.html`;

    const difficulty = customDetails.difficulty || 'Easy';
    const dotRange = customDetails.dotRange || [1, 50];
    const dotRangeString = Array.isArray(dotRange) ?
        (dotRange[0] === dotRange[1] ? dotRange[0] : `${dotRange[0]}-${dotRange[1]}`) :
        dotRange;
    const categories = customDetails.category || ['General'];

    const defaultAltText = `Printable ${difficulty.toLowerCase()} connect the dots puzzle: ${title} (Dots: ${dotRangeString}).`;
    const defaultSolutionAltText = `Solution for ${title} connect the dots puzzle (Dots: ${dotRangeString}).`;
    const defaultDescription = `A fun ${difficulty.toLowerCase()} dot to dot activity featuring ${title.toLowerCase()}. Perfect for ${customDetails.ageRecommendation || 'all ages'}.`;

    return {
        id: detailPageId, // 将 ID 存储为文件名（不带扩展名）
        title: title,
        description: customDetails.description || defaultDescription,
        difficulty: difficulty,
        tagColor: customDetails.tagColor || 'bg-gray-500',
        imageUrl: CDN_BASE_URL + puzzleFilename,
        imageSrcset: `${CDN_BASE_URL}${puzzleFilename} ${IMAGE_DEFAULT_WIDTH}w`,
        altText: customDetails.altText || defaultAltText,
        detailPage: detailPage,
        solutionUrl: CDN_BASE_URL + solutionFilename,
        solutionAltText: customDetails.solutionAltText || defaultSolutionAltText,

        category: categories,
        dotRange: dotRange,
        ageRecommendation: customDetails.ageRecommendation || 'All Ages',
        popularity: customDetails.popularity || Math.floor(Math.random() * 100) + 1,

        ...customDetails
    };
}

export const printablesData = {
    easy: [
        createPrintableItem(
            'bluey-playful-01', 'Playful Bluey',
            'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-bluey-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy',
                tagColor: 'bg-green-600',
                dotRange: [1, 25],
                category: ['Cartoons', 'Animals'],
                ageRecommendation: '3-6 Years',
                popularity: 98,
                description: 'Help Bluey come to life by connecting the dots! A simple puzzle perfect for little fans of the show.'
            }
        ),


        createPrintableItem(
            'happy-sun-03', 'Happy Sun 3',
            'easy-happy-sun-03-connect-the-dots-puzzle-1-22-numbers.webp',
            'easy-happy-sun-03-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 22], category: ['Nature'], ageRecommendation: '3-6 Years', popularity: 85,
                description: 'Easy connect the dots puzzle of a third happy sun design for young children.'
            }
        ),
        createPrintableItem(
            'rainbow', 'Rainbow',
            'easy-rainbow-connect-the-dots-puzzle-1-15-numbers.webp',
            'easy-rainbow-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 15], category: ['Nature'], ageRecommendation: '3-5 Years', popularity: 92,
                description: 'A cheerful rainbow dot to dot puzzle with clouds for preschool kids.'
            }
        ),
        createPrintableItem(
            'robot-01', 'Friendly Robot',
            'easy-robot-01-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-robot-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Vehicles', 'Robots'], ageRecommendation: '4-7 Years', popularity: 78,
                description: 'Simple dot to dot puzzle featuring a friendly robot waving. Great for motor skills.'
            }
        ),
        createPrintableItem(
            'sailboat', 'Sailboat',
            'easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-sailboat-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Vehicles'], ageRecommendation: '4-6 Years', popularity: 88,
                description: 'Easy dot to dot puzzle of a sailboat on the water. Learn numbers 1 to 20.'
            }
        ),
        createPrintableItem(
            'dinosaur-01', 'Long-neck Dinosaur',
            'easy-dinosaur-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-dinosaur-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Animals'], ageRecommendation: '4-7 Years', popularity: 89,
                description: 'Easy dot to dot puzzle featuring a friendly long-neck dinosaur for preschoolers.'
            }
        ),
        createPrintableItem(
            'dinosaur-02', 'T-Rex Dinosaur',
            'easy-dinosaur-02-connect-the-dots-puzzle-1-25-numbers.webp',
            'easy-dinosaur-02-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 25], category: ['Animals'], ageRecommendation: '4-7 Years', popularity: 82,
                description: 'Easy dot to dot puzzle featuring a happy T-Rex dinosaur. Connect numbers to reveal.'
            }
        ),
        createPrintableItem(
            'flower-pot', 'Flower in a Pot',
            'easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp',
            'easy-flower-pot-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 18], category: ['Nature'], ageRecommendation: '3-6 Years', popularity: 75,
                description: 'Easy dot to dot puzzle of a blooming flower in a pot. Perfect for spring activities.'
            }
        ),
        createPrintableItem(
            'happy-sun-01', 'Happy Sun 1',
            'easy-happy-sun-01-connect-the-dots-puzzle-1-20-numbers.webp',
            'easy-happy-sun-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Easy', tagColor: 'bg-green-600', dotRange: [1, 20], category: ['Nature'], ageRecommendation: '3-6 Years', popularity: 87,
                description: 'Easy connect the dots puzzle of a happy sun with rays. Great for number practice.'
            }
        ),
    ],
    medium: [
        createPrintableItem(
            'spongebob-classic-01', 'Classic SpongeBob',
            'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers.webp',
            'medium-spongebob-01-connect-the-dots-solution.webp',
            {
                difficulty: 'Medium',
                tagColor: 'bg-yellow-600',
                dotRange: [1, 50],
                category: ['Cartoons', 'Under the Sea'],
                ageRecommendation: '5-8 Years',
                popularity: 95,
                description: 'Connect 50 dots to reveal everyone’s favorite sponge from Bikini Bottom! Great for practicing larger numbers.'
            }
        ),
        createPrintableItem(
            'castle-01', 'Majestic Castle',
            'medium-castle-01-connect-the-dots-puzzle-1-80-numbers.webp',
            'medium-castle-01-connect-the-dots-solution-1-80-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 80], category: ['Buildings', 'Fantasy'], ageRecommendation: '7-10 Years', popularity: 70,
                description: 'A majestic castle dot to dot puzzle for intermediate solvers. Reveal the fairytale fortress.'
            }
        ),
        createPrintableItem(
            'halloween-pumpkin-01', 'Halloween Pumpkin',
            'medium-halloween-pumpkin-01-connect-the-dots-puzzle-1-65-numbers.webp',
            'medium-halloween-pumpkin-01-connect-the-dots-solution-1-65-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 65], category: ['Holiday'], ageRecommendation: '7-10 Years', popularity: 80,
                description: 'Spooky Halloween pumpkin dot to dot puzzle. Great for seasonal fun.'
            }
        ),
        createPrintableItem(
            'lighthouse-01', 'Coastal Lighthouse',
            'medium-lighthouse-01-connect-the-dots-puzzle-1-75-numbers.webp',
            'medium-lighthouse-01-connect-the-dots-solution-1-75-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 75], category: ['Buildings', 'Nature'], ageRecommendation: '8-11 Years', popularity: 65,
                description: 'Detailed lighthouse dot to dot puzzle by the sea. A calming scene to connect.'
            }
        ),
        createPrintableItem(
            'magical-unicorn-01', 'Magical Unicorn',
            'medium-magical-unicorn-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-magical-unicorn-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasy', 'Animals'], ageRecommendation: '6-9 Years', popularity: 91,
                description: 'A magical unicorn dot to dot puzzle for fantasy fans. Bring the mythical creature to life.'
            }
        ),
        createPrintableItem(
            'mushroom-house-01', 'Whimsical Mushroom House',
            'medium-mushroom-house-01-connect-the-dots-puzzle-1-70-numbers.webp',
            'medium-mushroom-house-01-connect-the-dots-solution-1-70-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 70], category: ['Fantasy'], ageRecommendation: '7-10 Years', popularity: 72,
                description: 'A whimsical mushroom house dot to dot puzzle. Perfect for young adventurers.'
            }
        ),
        createPrintableItem(
            'pirate-ship-01', 'Adventurous Pirate Ship',
            'medium-pirate-ship-01-connect-the-dots-puzzle-1-90-numbers.webp',
            'medium-pirate-ship-01-connect-the-dots-solution-1-90-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 90], category: ['Vehicles', 'Adventure'], ageRecommendation: '8-12 Years', popularity: 86,
                description: 'An adventurous pirate ship dot to dot puzzle. Sail the high seas with this challenge.'
            }
        ),
        createPrintableItem(
            'rocket-ship-01', 'Space Rocket Ship',
            'medium-rocket-ship-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-rocket-ship-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Space', 'Vehicles'], ageRecommendation: '7-10 Years', popularity: 79,
                description: 'A fun rocket ship dot to dot puzzle for space explorers. Blast off to creativity!'
            }
        ),
        createPrintableItem(
            'sports-car-01', 'Cool Sports Car',
            'medium-sports-car-01-connect-the-dots-puzzle-1-85-numbers.webp',
            'medium-sports-car-01-connect-the-dots-solution-1-85-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 85], category: ['Vehicles'], ageRecommendation: '8-11 Years', popularity: 83,
                description: 'A cool sports car dot to dot puzzle for vehicle enthusiasts. Connect the dots to race.'
            }
        ),
        createPrintableItem(
            'train-01', 'Old-fashioned Train',
            'medium-train-01-connect-the-dots-puzzle-1-60-numbers.webp',
            'medium-train-01-connect-the-dots-solution-1-60-numbers.webp',
            {
                difficulty: 'Medium', tagColor: 'bg-yellow-600', dotRange: [1, 60], category: ['Vehicles'], ageRecommendation: '7-10 Years', popularity: 76,
                description: 'An old-fashioned train dot to dot puzzle with many details. All aboard for fun!'
            }
        ),
    ],
    hard: [
        createPrintableItem(
            'mountain-landscape-html-original', 'Mountain Landscape',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif',
            '6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots-solution.avif',
            {
                difficulty: 'Hard', tagColor: 'bg-orange-600',
                dotRange: [100, 200], category: ['Nature', 'Scenery'], ageRecommendation: '12+ Years', popularity: 60,
                description: 'Advanced printable mountain landscape dot to dot for adults. Discover a scenic view.',
                detailPage: './printables/adults.html',
            }
        ),
    ],
    extreme: [
        createPrintableItem(
            'extreme-mandala-html-original', 'Extreme Mandala',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif',
            '7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots-solution.avif',
            {
                difficulty: 'Extreme', tagColor: 'bg-red-700',
                dotRange: [200, 300], category: ['Abstract', 'Art'], ageRecommendation: 'Adults', popularity: 50,
                description: 'Extreme difficulty complex mandala design for adults. A truly intricate challenge.',
                detailPage: './printables/hard.html',
            }
        ),

    ]
};
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        printablesData,
        CDN_BASE_URL,
        IMAGE_DEFAULT_WIDTH,
        IMAGE_DEFAULT_HEIGHT,
        createPrintableItem
    };
}