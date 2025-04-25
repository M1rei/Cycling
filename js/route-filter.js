document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.filter-search');
    const difficultyDropdown = document.querySelector('#difficulty-filter');
    const filterTagsContainer = document.querySelector('.filter-tags');
    const routeCardsContainer = document.querySelector('.all-routes-section .routes-container');
    const routeCards = routeCardsContainer ? routeCardsContainer.querySelectorAll('.route-card') : [];

    if (!routeCardsContainer) {
        console.error('Контейнер карточек маршрутов не найден!');
        return;
    }

    let currentFilters = {
        searchTerm: '',
        difficulty: 'any',
        typeTag: 'all'
    };

    function applyFilters() {
        routeCards.forEach(card => {
            const titleElement = card.querySelector('h3');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            const difficulty = card.dataset.difficulty || 'any';
            const type = card.dataset.type || 'any';

            const searchMatch = currentFilters.searchTerm === '' || title.includes(currentFilters.searchTerm);
            const difficultyMatch = currentFilters.difficulty === 'any' || difficulty === currentFilters.difficulty;
            const typeTagMatch = currentFilters.typeTag === 'all' || type === currentFilters.typeTag;

            if (searchMatch && difficultyMatch && typeTagMatch) {
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
                filterTagsContainer.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
                event.target.classList.add('active');
                currentFilters.typeTag = event.target.dataset.typeTag || 'all';
                applyFilters();
            }
        });
    }

    // Первоначальное применение фильтров при загрузке страницы
    applyFilters();
}); 