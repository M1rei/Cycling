// Данные об атлетах
const athletesData = {
    'Тадей Погачар': {
        bio: `Тадей Погачар - словенский профессиональный шоссейный велогонщик, выступающий за команду UAE Team Emirates. 
        Один из самых талантливых гонщиков своего поколения, добившийся выдающихся успехов в молодом возрасте.
        Начал заниматься велоспортом в возрасте 9 лет в клубе Rog Ljubljana.
        В 2019 году дебютировал в Мировом туре и сразу же показал выдающиеся результаты.
        Известен своей универсальностью: силён как в горах, так и в разделке.`,
        achievements: [
            '🥇 Победитель Тур де Франс (2020, 2021)',
            '🥇 Победитель Джиро д\'Италия (2024)',
            '🥇 Обладатель Velo d\'Or (2021, 2023, 2024)',
        ]
    },
    'Виктория Пендлтон': {
        bio: `Виктория Пендлтон - британская велогонщица, специализирующаяся в трековых гонках.
        Одна из самых успешных велогонщиц в истории британского спорта.
        Начала заниматься велоспортом в возрасте 9 лет, вдохновившись успехами отца.
        За свою карьеру установила множество рекордов и стала примером для молодых спортсменок.
        После завершения карьеры в велоспорте успешно пробовала себя в конном спорте.`,
        achievements: [
            '🥇 Олимпийская чемпионка (2008, 2012 — спринт, кейрин)',
            '🥈 Серебряный призёр Олимпиады 2012 (командный спринт)',
            '🥇 9-кратная чемпионка мира',
        ]
    },
    // Добавьте данные для остальных атлетов по аналогии
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('athleteModal');
    const closeBtn = document.querySelector('.close-modal');
    const athleteLinks = document.querySelectorAll('.athlete-details');

    function openModal(athleteCard) {
        const athleteName = athleteCard.querySelector('h2').textContent;
        const athleteCountry = athleteCard.querySelector('p:nth-child(2)').textContent;
        const athleteDiscipline = athleteCard.querySelector('p:nth-child(3)').textContent;
        const athleteImage = athleteCard.parentElement.querySelector('img').src;
        
        // Заполняем модальное окно данными
        document.querySelector('.modal-athlete-name').textContent = athleteName;
        document.querySelector('.modal-athlete-country').textContent = athleteCountry;
        document.querySelector('.modal-athlete-discipline').textContent = athleteDiscipline;
        document.querySelector('.modal-athlete-image').src = athleteImage;
        document.querySelector('.modal-athlete-image').alt = athleteName;

        // Добавляем достижения и биографию
        const athleteData = athletesData[athleteName];
        if (athleteData) {
            const achievementsHtml = athleteData.achievements.map(achievement => 
                `<p>${achievement}</p>`
            ).join('');
            document.querySelector('.modal-athlete-achievements').innerHTML = achievementsHtml;
            document.querySelector('.modal-athlete-bio').innerHTML = `<p>${athleteData.bio}</p>`;
        }

        // Показываем модальное окно
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // Обработчики событий
    athleteLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const athleteCard = link.closest('.athlete-info');
            openModal(athleteCard);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закрытие по нажатию Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}); 