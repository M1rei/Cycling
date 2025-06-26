document.addEventListener('DOMContentLoaded', async function() {
    const athletesGrid = document.querySelector('.athletes-grid');
    const disciplineSelect = document.getElementById('discipline-select');
    const countrySelect = document.getElementById('country-select');
    let athletesData = [];

    // Загрузка данных из JSON
    async function fetchAthletes() {
        const response = await fetch('data/athletes.json');
        athletesData = await response.json();
        renderAthletes();
    }

    // Генерация карточек
    function renderAthletes() {
        const selectedDiscipline = disciplineSelect.value;
        const selectedCountry = countrySelect.value;

        athletesGrid.innerHTML = '';
        athletesData.forEach(athlete => {
            const disciplineMatch = selectedDiscipline === 'all' || athlete.discipline === selectedDiscipline;
            const countryMatch = selectedCountry === 'all' || athlete.country === selectedCountry;
            if (disciplineMatch && countryMatch) {
                const card = document.createElement('div');
                card.className = 'athlete-card';
                card.innerHTML = `
                    <img src="${athlete.photo}" alt="${athlete.name}">
                    <div class="athlete-info">
                        <h2>${athlete.name}</h2>
                        <p>${athlete.country}</p>
                        <p>${athlete.discipline}</p>
                        ${athlete.achievements ? athlete.achievements.map(a => `<p>${a}</p>`).join('') : ''}
                        <a href="#" class="athlete-details">Подробнее</a>
                    </div>
                `;
                athletesGrid.appendChild(card);
            }
        });
        // После рендера — подключить обработчики для модалок
        attachModalHandlers();
    }

    // Фильтрация
    disciplineSelect.addEventListener('change', renderAthletes);
    countrySelect.addEventListener('change', renderAthletes);

    // Модальное окно
    function attachModalHandlers() {
        const modal = document.getElementById('athleteModal');
        const closeBtn = document.querySelector('.close-modal');
        const athleteLinks = document.querySelectorAll('.athlete-details');

        athleteLinks.forEach(link => {
            link.onclick = function(e) {
                e.preventDefault();
                const card = link.closest('.athlete-card');
                const name = card.querySelector('h2').textContent;
                const athlete = athletesData.find(a => a.name === name);
                if (athlete) {
                    document.querySelector('.modal-athlete-name').textContent = athlete.name;
                    document.querySelector('.modal-athlete-country').textContent = athlete.country;
                    document.querySelector('.modal-athlete-discipline').textContent = athlete.discipline;
                    document.querySelector('.modal-athlete-image').src = athlete.photo;
                    document.querySelector('.modal-athlete-image').alt = athlete.name;
                    document.querySelector('.modal-athlete-achievements').innerHTML = athlete.achievements ? athlete.achievements.map(a => `<p>${a}</p>`).join('') : '';
                    document.querySelector('.modal-athlete-bio').innerHTML = `<p>${athlete.bio}</p>`;
                    modal.style.display = 'block';
                    document.body.classList.add('modal-open');
                }
            };
        });

        closeBtn.onclick = function() {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        };
    }

    // Запуск
    fetchAthletes();
}); 