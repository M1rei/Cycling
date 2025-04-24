// Данные для руководств
const guidesData = {
    'Советы по езде по тропам': {
        content: `Езда по тропам требует особых навыков и подготовки. Вот основные советы для безопасной и приятной езды:

1. Всегда проверяйте состояние велосипеда перед поездкой
2. Используйте соответствующую экипировку (шлем, перчатки, защита)
3. Изучите маршрут заранее
4. Соблюдайте правила дорожного движения
5. Будьте внимательны к другим участникам движения
6. Поддерживайте правильное давление в шинах
7. Регулярно делайте перерывы для отдыха
8. Берите с собой необходимый ремонтный набор
9. Следите за погодными условиями
10. Уважайте природу и других пользователей троп`
    },
    'Руководство по городской езде': {
        content: `Городская езда на велосипеде имеет свои особенности. Вот основные правила и советы:

1. Всегда соблюдайте правила дорожного движения
2. Используйте велосипедные дорожки, где они есть
3. Будьте предсказуемы для других участников движения
4. Используйте светоотражатели и фары в темное время суток
5. Следите за дорожным покрытием
6. Будьте внимательны к дверям припаркованных автомобилей
7. Используйте звонок для предупреждения пешеходов
8. Соблюдайте безопасную дистанцию
9. Будьте готовы к неожиданным ситуациям
10. Регулярно обслуживайте велосипед`
    },
    'Основы горного велоспорта': {
        content: `Горный велоспорт - это захватывающий вид спорта, требующий специальных навыков:

1. Начните с простых трасс
2. Освойте правильную технику торможения
3. Учитесь правильно распределять вес
4. Тренируйте баланс и координацию
5. Изучите технику прохождения поворотов
6. Научитесь правильно выбирать передачу
7. Освойте технику прыжков
8. Тренируйте выносливость
9. Изучите технику преодоления препятствий
10. Всегда используйте защитную экипировку`
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'guideModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body">
                <div class="guide-modal-info">
                    <div class="modal-header">
                        <div class="modal-guide-main-info">
                            <h2 class="modal-guide-title"></h2>
                            <div class="modal-guide-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-modal');
    const guideLinks = document.querySelectorAll('.read-more');

    function openModal(guideCard) {
        const guideTitle = guideCard.querySelector('h3').textContent;
        
        // Заполняем модальное окно данными
        document.querySelector('.modal-guide-title').textContent = guideTitle;

        // Добавляем содержимое руководства
        const guideData = guidesData[guideTitle];
        if (guideData) {
            document.querySelector('.modal-guide-content').innerHTML = `<p>${guideData.content}</p>`;
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
    guideLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const guideCard = link.closest('.guide-card');
            openModal(guideCard);
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