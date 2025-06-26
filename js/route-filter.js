document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.filter-search');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const regionFilter = document.getElementById('region-filter');
    const typeTags = document.querySelectorAll('.filter-tag');
    const containers = document.querySelectorAll('.routes-container');
    const modal = document.getElementById('routeModal');
    const closeModal = modal.querySelector('.close-modal, .close-modal span');
    const openNavigatorBtn = modal.querySelector('.open-navigator');
    let currentRouteUrl = '#';
    let routesData = [];

    // Загрузка данных из JSON
    async function fetchRoutes() {
        const response = await fetch('data/routes.json');
        routesData = await response.json();
        populateRegionFilter();
        renderRoutes();
    }

    function populateRegionFilter() {
        const regions = [...new Set(routesData.map(route => route.region))];
        regions.sort();
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });
    }

    // Генерация карточек маршрутов
    function renderRoutes() {
        // Первый контейнер — популярные маршруты (только 3)
        if (containers[0]) {
            containers[0].innerHTML = '';
            const popularRoutes = [...routesData].sort((a, b) => b.rating - a.rating).slice(0, 3);
            popularRoutes.forEach(route => {
                const card = document.createElement('div');
                card.className = 'route-card';
                card.innerHTML = `
                    <img src="${route.image}" alt="${route.name}">
                    <div class="content">
                        <h3>${route.name}</h3>
                        <p>Регион: ${route.region}</p>
                        <p class="route-name">${route.type}</p>
                        <p>Сложность: ${route.difficulty}</p>
                        <p>Длина: ${route.distance} км</p>
                    </div>
                    <a href="#" class="read-more">Подробнее</a>
                `;
                card.dataset.distance = route.distance;
                card.dataset.elevation = route.elevation;
                card.dataset.difficulty = route.difficulty;
                card.dataset.description = route.description;
                card.dataset.url = route.link;
                card.dataset.rating = route.rating;
                card.dataset.region = route.region;
                containers[0].appendChild(card);
            });
        }
        // Второй контейнер — все маршруты с фильтрацией
        if (containers[1]) {
            containers[1].innerHTML = '';
            routesData.forEach(route => {
                const selectedDifficulty = difficultyFilter ? difficultyFilter.value : 'any';
                const selectedRegion = regionFilter ? regionFilter.value : 'any';
                const activeTypeTag = document.querySelector('.filter-tag.active');
                const selectedType = activeTypeTag ? activeTypeTag.dataset.typeTag : 'all';
                const searchValue = searchInput ? searchInput.value.toLowerCase() : '';

                const difficultyMatch = selectedDifficulty === 'any' ||
                    (selectedDifficulty === 'easy' && route.difficulty === 'Легкая') ||
                    (selectedDifficulty === 'medium' && route.difficulty === 'Средняя') ||
                    (selectedDifficulty === 'hard' && route.difficulty === 'Сложная');
                const regionMatch = selectedRegion === 'any' || route.region === selectedRegion;
                const typeMatch = selectedType === 'all' ||
                    (selectedType === 'mountain' && route.type.includes('Горный')) ||
                    (selectedType === 'forest' && route.type.includes('Лесной')) ||
                    (selectedType === 'city' && route.type.includes('Городской'));
                const searchMatch = !searchValue || 
                                    route.name.toLowerCase().includes(searchValue) ||
                                    route.region.toLowerCase().includes(searchValue);

                if (difficultyMatch && typeMatch && searchMatch && regionMatch) {
                    const card = document.createElement('div');
                    card.className = 'route-card';
                    card.innerHTML = `
                        <img src="${route.image}" alt="${route.name}">
                        <div class="content">
                            <h3>${route.name}</h3>
                            <p>Регион: ${route.region}</p>
                            <p class="route-name">${route.type}</p>
                            <p>Сложность: ${route.difficulty}</p>
                            <p>Длина: ${route.distance} км</p>
                        </div>
                        <a href="#" class="read-more">Подробнее</a>
                    `;
                    card.dataset.distance = route.distance;
                    card.dataset.elevation = route.elevation;
                    card.dataset.difficulty = route.difficulty;
                    card.dataset.description = route.description;
                    card.dataset.url = route.link;
                    card.dataset.rating = route.rating;
                    card.dataset.region = route.region;
                    containers[1].appendChild(card);
                }
            });
        }
        attachModalHandlers();
    }

    // Обработчики фильтров
    if (difficultyFilter) difficultyFilter.addEventListener('change', renderRoutes);
    if (regionFilter) regionFilter.addEventListener('change', renderRoutes);
    if (searchInput) searchInput.addEventListener('input', renderRoutes);
    typeTags.forEach(tag => {
        tag.addEventListener('click', () => {
            typeTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderRoutes();
        });
    });

    // Модальное окно
    function attachModalHandlers() {
        document.querySelectorAll('.read-more').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const card = btn.closest('.route-card');
                openRouteModal(card);
            };
        });
    }

    function openRouteModal(card) {
        const modalTitle = modal.querySelector('.modal-title');
        const distance = modal.querySelector('.distance');
        const elevation = modal.querySelector('.elevation');
        const description = modal.querySelector('.route-description');
        const difficultyStars = modal.querySelector('.difficulty-stars');
        const rating = parseInt(card.dataset.rating || '1');

        modalTitle.textContent = card.querySelector('h3').textContent;
        distance.textContent = card.dataset.distance + ' км';
        elevation.textContent = card.dataset.elevation + ' м';
        description.textContent = card.dataset.description;
        currentRouteUrl = card.dataset.url;

        // Звезды сложности
        difficultyStars.innerHTML = '';
        for (let i = 0; i < rating; i++) {
            const star = document.createElement('i');
            star.className = 'fas fa-star';
            difficultyStars.appendChild(star);
        }

        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    function closeRouteModal() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    if (modal.querySelector('.close-modal')) {
        modal.querySelector('.close-modal').addEventListener('click', closeRouteModal);
    }
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeRouteModal();
        }
    });
    if (openNavigatorBtn) {
        openNavigatorBtn.addEventListener('click', () => {
            if (currentRouteUrl && currentRouteUrl !== '#') {
                window.open(currentRouteUrl, '_blank');
            }
        });
    }

    // Запуск
    fetchRoutes();
}); 