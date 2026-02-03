// list-page-logic.js

import { printablesData, IMAGE_DEFAULT_WIDTH, IMAGE_DEFAULT_HEIGHT } from './data.js';

const printablesGrid = document.getElementById('printables-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const resultsCountElement = document.getElementById('results-count');
const schemaScriptElement = document.getElementById('schema-json-ld');

const totalPrintablesCount = Object.values(printablesData).flat().length;
function renderPrintables(difficulty) {
  printablesGrid.innerHTML = ''; // Limpiar contenido actual

  let itemsToDisplay = [];
  if (difficulty === 'all') {
    // Si es 'todos', seleccionamos una muestra aleatoria de cada nivel (máximo 12)
    const allItems = Object.values(printablesData).flat();
    console.log('Total de elementos disponibles:', JSON.stringify(allItems));
    itemsToDisplay = allItems.sort(() => 0.5 - Math.random()).slice(0, 12);
  } else {
    // De lo contrario, mostrar todos los elementos de la dificultad específica
    itemsToDisplay = printablesData[difficulty] || [];
  }

  const itemListElements = []; // Para almacenar los elementos de Schema.org

  itemsToDisplay.forEach((item, index) => {
    // Carga prioritaria para las primeras 3 imágenes, el resto con lazy load
    const loadingAttr = index < 3 ? 'eager' : 'lazy';

    const displayDotRange = Array.isArray(item.dotRange) ?
      (item.dotRange[0] === item.dotRange[1] ? item.dotRange[0] : `${item.dotRange[0]}-${item.dotRange[1]}`) :
      item.dotRange;

    // Traducir dinámicamente las categorías si es necesario, o usarlas tal cual desde data.js
    const displayCategories = Array.isArray(item.category) ?
      item.category.map(cat => `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">${cat}</span>`).join('') :
      `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">${item.category}</span>`;

    // Mapeo de dificultad para mostrar en la etiqueta (Tag)
    const difficultyLabels = {
      'easy': 'Fácil',
      'medium': 'Medio',
      'hard': 'Difícil',
      'extreme': 'Extremo'
    };
    const labelDificultad = difficultyLabels[item.difficulty.toLowerCase()] || item.difficulty;
    console.log('Renderizando elemento:', JSON.stringify(item.detailPage));
    const cardHtml = `
      <a href="/es${item.detailPage}" class="relative block bg-light rounded-xl overflow-hidden shadow-md group transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div class=" relative w-full overflow-hidden">
          <img src="${item.imageUrl}"
               srcset="${item.imageSrcset || `${item.imageUrl} ${IMAGE_DEFAULT_WIDTH}w`}"
               sizes="(min-width: 1024px) 33.3vw, (min-width: 640px) 50vw, 50vw"
               alt="${item.altText}"
               class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
               loading="${loadingAttr}" decoding="async"
               width="${IMAGE_DEFAULT_WIDTH}" height="${IMAGE_DEFAULT_HEIGHT}">
          
          <span class="absolute top-3 right-3 bg-accent text-white text-sm font-semibold px-3 py-1 rounded-full z-10">Gratis</span>
          <span class="absolute top-3 left-3 ${item.tagColor} text-white text-sm font-semibold px-3 py-1 rounded-full z-10">${labelDificultad}</span>
        </div>
        <div class="p-2 md:p-6">
          <h3 class="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">${item.title}</h3>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">Puntos: ${displayDotRange}</span>
            ${displayCategories}
          </div>
          <p class="text-neutral/70 mb-2 line-clamp-3">${item.description}</p>
          <div class="flex flex-col md:flex-row gap-2 md:text-sm text-neutral/60">
            <span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> ${item.ageRecommendation}</span>
            <span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block align-text-bottom text-red-500 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Popularidad: ${item.popularity}</span>
          </div>
        </div>
      </a>
    `;
    printablesGrid.insertAdjacentHTML('beforeend', cardHtml);

    // Preparar datos para Schema.org JSON-LD
    itemListElements.push({
      "@type": "ListItem",
      "position": index + 1,
      "url": window.location.origin + item.detailPage,
      "name": item.title,
      "image": item.imageUrl,
      "description": item.description
    });
  });

  // Actualizar el contador de resultados en español
  resultsCountElement.textContent = `Mostrando ${itemsToDisplay.length} de ${totalPrintablesCount} fichas`;

  if (schemaScriptElement) {
    const schemaData = JSON.parse(schemaScriptElement.textContent);
    schemaData.mainEntity.numberOfItems = itemsToDisplay.length;
    schemaData.mainEntity.itemListElement = itemListElements;
    schemaScriptElement.textContent = JSON.stringify(schemaData, null, 2);
  }
}

// 4. Configuración de los botones de filtro
filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    // Quitar clase activa de todos los botones
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    // Añadir clase activa al botón pulsado
    this.classList.add('active');

    const filterType = this.dataset.filter.replace('difficulty-', '');
    renderPrintables(filterType);
  });
});

// Inicialización: Cargar por defecto 'todos' o 'fácil'
const initialFilterButton = document.querySelector('[data-filter="difficulty-all"]');
if (initialFilterButton) {
  initialFilterButton.click();
} else {
  renderPrintables('easy');
}