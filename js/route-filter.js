document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.filter-search');
    const difficultyDropdown = document.querySelector('#difficulty-filter');
    const filterTagsContainer = document.querySelector('.filter-tags');
    const routeCardsContainer = document.querySelector('.all-routes-section .routes-container');
    const routeCards = routeCardsContainer ? routeCardsContainer.querySelectorAll('.route-card') : [];
    const modal = document.getElementById('routeModal');
    const closeModal = document.querySelector('.close-modal');
    const body = document.body;

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

    let currentRouteUrl = '';

    // Функция для открытия модального окна
    function openRouteModal(routeData) {
        const modalTitle = modal.querySelector('.modal-title');
        const distance = modal.querySelector('.distance');
        const elevation = modal.querySelector('.elevation');
        const description = modal.querySelector('.route-description');
        const difficultyStars = modal.querySelector('.difficulty-stars');

        modalTitle.textContent = routeData.title;
        distance.textContent = routeData.distance;
        elevation.textContent = routeData.elevation;
        description.textContent = routeData.description;
        currentRouteUrl = routeData.url;

        // Очищаем и добавляем звезды сложности
        difficultyStars.innerHTML = '';
        for (let i = 0; i < routeData.difficulty; i++) {
            const star = document.createElement('i');
            star.className = 'fas fa-star';
            difficultyStars.appendChild(star);
        }

        // Фиксируем положение страницы
        const scrollY = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        
        modal.style.display = 'block';
    }

    // Функция для закрытия модального окна
    function closeRouteModal() {
        const scrollY = parseInt(body.style.top || '0');
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        window.scrollTo(0, -scrollY);
        
        modal.style.display = 'none';
    }

    // Функция для получения данных маршрута из карточки
    function getRouteDataFromCard(card) {
        return {
            title: card.querySelector('h3').textContent,
            distance: card.dataset.distance || card.querySelector('.route-name').textContent,
            elevation: card.dataset.elevation || '350 м',
            difficulty: parseInt(card.dataset.difficulty === 'hard' ? 3 : card.dataset.difficulty === 'medium' ? 2 : 1),
            description: card.dataset.description || 'Маршрут проходит через живописные места, подходит для велосипедистов.',
            url: card.dataset.url || '#'
        };
    }

    // Обработчики событий для модального окна в обеих секциях
    document.querySelectorAll('.route-card').forEach(card => {
        const readMoreBtn = card.querySelector('.read-more');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const routeData = getRouteDataFromCard(card);
                openRouteModal(routeData);
            });
        }
    });

    if (closeModal) {
        closeModal.addEventListener('click', closeRouteModal);
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeRouteModal();
        }
    });

    // Обработчик для кнопки "Открыть"
    const openNavigatorBtn = modal.querySelector('.open-navigator');
    if (openNavigatorBtn) {
        openNavigatorBtn.addEventListener('click', () => {
            if (currentRouteUrl && currentRouteUrl !== '#') {
                window.open(currentRouteUrl, '_blank');
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