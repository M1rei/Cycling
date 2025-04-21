document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.filter-search');
    const regionDropdown = document.querySelector('#region-filter');
    const difficultyDropdown = document.querySelector('#difficulty-filter');
    const typeDropdown = document.querySelector('#type-filter'); // Если будете использовать
    const filterTagsContainer = document.querySelector('.filter-tags');
    const routeCardsContainer = document.querySelector('.all-routes-section .routes-container');
    const routeCards = routeCardsContainer ? routeCardsContainer.querySelectorAll('.route-card') : [];
    // const loadMoreButton = document.querySelector('.load-more-routes'); // Пока не используется

    if (!routeCardsContainer) {
        console.error('Контейнер карточек маршрутов не найден!');
        return;
    }

    let currentFilters = {
        searchTerm: '',
        region: 'all',
        difficulty: 'any',
        typeTag: 'all' // Используем тег для основного типа
        // typeDropdown: 'any' // Можно добавить, если нужен второй фильтр по типу
    };

    function applyFilters() {
        routeCards.forEach(card => {
            const titleElement = card.querySelector('h3');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            const region = card.dataset.region || 'other';
            const difficulty = card.dataset.difficulty || 'any';
            const type = card.dataset.type || 'any';

            const searchMatch = currentFilters.searchTerm === '' || title.includes(currentFilters.searchTerm);
            const regionMatch = currentFilters.region === 'all' || region === currentFilters.region;
            const difficultyMatch = currentFilters.difficulty === 'any' || difficulty === currentFilters.difficulty;
            const typeTagMatch = currentFilters.typeTag === 'all' || type === currentFilters.typeTag;
            // const typeDropdownMatch = currentFilters.typeDropdown === 'any' || type === currentFilters.typeDropdown;

            // Показываем карточку, если ВСЕ активные фильтры совпадают
            if (searchMatch && regionMatch && difficultyMatch && typeTagMatch /* && typeDropdownMatch */) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Обработчик для поля поиска
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            currentFilters.searchTerm = event.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    // Обработчик для регионов
    if (regionDropdown) {
        regionDropdown.addEventListener('change', (event) => {
            currentFilters.region = event.target.value;
            applyFilters();
        });
    }

    // Обработчик для сложности
    if (difficultyDropdown) {
        difficultyDropdown.addEventListener('change', (event) => {
            currentFilters.difficulty = event.target.value;
            applyFilters();
        });
    }

    // Обработчик для тегов типа
    if (filterTagsContainer) {
        filterTagsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-tag')) {
                // Снимаем класс active со всех тегов
                filterTagsContainer.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
                // Добавляем класс active к нажатому тегу
                event.target.classList.add('active');
                // Обновляем фильтр по типу
                currentFilters.typeTag = event.target.dataset.typeTag || 'all';
                applyFilters();
            }
        });
    }

    // Обработчик для выпадающего списка типа (если нужен)
    /*
    if (typeDropdown) {
        typeDropdown.addEventListener('change', (event) => {
            currentFilters.typeDropdown = event.target.value;
            applyFilters();
        });
    }
    */

    // Первоначальное применение фильтров при загрузке страницы
    applyFilters();

}); 