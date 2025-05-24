// Загрузка данных о снаряжении из data/gearData.json
async function loadGearData() {
    const response = await fetch('data/gearData.json');
    return await response.json();
}

document.addEventListener('DOMContentLoaded', async () => {
    const gearDataByCategory = await loadGearData();
    // Преобразуем в объект: {"название": объект}
    const gearData = {};
    Object.values(gearDataByCategory).forEach(categoryArr => {
        categoryArr.forEach(item => {
            gearData[item.name] = item;
        });
    });

    const gearCards = document.querySelectorAll('.gear-card');

    gearCards.forEach(card => {
        const readReviewBtn = card.querySelector('.read-review');
        const gearTitle = card.querySelector('h3');
        
        // Создаем контейнер для дополнительной информации
        const infoContainer = document.createElement('div');
        infoContainer.className = 'gear-info-container';

        // Добавляем контейнер в карточку
        card.appendChild(infoContainer);

        readReviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Получаем данные о снаряжении
            const gearName = gearTitle.textContent;
            const gearContent = gearData[gearName]?.content || 'Информация отсутствует';

            // Показываем информацию
            infoContainer.innerHTML = `
                <div class=\"gear-info-content\">
                    <h3>${gearName}</h3>
                    <p>${gearContent}</p>
                </div>
                <button class=\"close-gear-info\"><i class=\"fas fa-chevron-down\"></i></button>
            `;

            // Добавляем классы для отображения информации
            card.classList.add('info-visible');
            infoContainer.classList.add('active');

            // Добавляем обработчик для кнопки закрытия
            const closeBtn = infoContainer.querySelector('.close-gear-info');
            closeBtn.addEventListener('click', () => {
                card.classList.remove('info-visible');
                infoContainer.classList.remove('active');
            });
        });
    });
}); 