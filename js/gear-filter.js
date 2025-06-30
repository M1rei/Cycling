// Открытие/закрытие фильтра
const toggleBtn = document.getElementById('toggle-gear-filter');
const filterPanel = document.getElementById('gear-filter-panel');

toggleBtn.addEventListener('click', () => {
  filterPanel.classList.toggle('active');
});

// Определяем соответствие кнопок фильтра и элементов экипировки
const filterMapping = {
  'Шоссе': [
    'shosseyny-shlem', 'shlem-trialon', 'pokryshka-sliky', 'pokryshka-graviy',
    'veloobuv', 'velokurtka', 'solntsezashitnye-ochki', 'veloperchatki',
    'veloshtany', 'fonar', 'flyaga'
  ],
  'Горный': [
    'gorny-shlem', 'pokryshka-treil', 'pokryshka-enduro', 'pokryshka-daunhill',
    'pokryshka-graviy', 'veloperchatki', 'multitul', 'fonar', 'velosumka'
  ],
  'BMX': [
    'bmx-shlem', 'pokryshka-graviy', 'veloperchatki'
  ],
  'Городской': [
    'shosseyny-shlem', 'bmx-shlem', 'pokryshka-graviy', 'pokryshka-sliky',
    'veloobuv', 'veloperchatki', 'velokompyuter', 'flyaga'
  ],
  'Одежда': [
    'veloobuv', 'velokurtka', 'solntsezashitnye-ochki', 'veloperchatki', 'veloshtany'
  ],
  'Аксессуар': [
    'velokompyuter', 'multitul', 'fonar', 'podnozhka', 'nasos', 'velosedlo'
  ],
  'Детский': [
    'detsky-shlem', 'velokreslo', 'detsky-shlem-2', 'zashitny-komplekt'
  ],
  'Запчасти': [
    'tsep', 'zvezdy', 'tormoznye-kolodki', 'trosiki', 'pedali'
  ],
  'Батончик': [
    'energetichesky-batonchik'
  ],
  'Гель': [
    'energetichesky-gel'
  ],
  'Фляга': [
    'flyaga'
  ]
};

// Активные кнопки фильтра
const typeBtns = document.querySelectorAll('.gear-filter-type');
typeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    filterGear();
  });
});

const categoryBtns = document.querySelectorAll('.gear-filter-category');
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    filterGear();
  });
});

// Сброс фильтра
const resetBtn = document.querySelector('.gear-filter-reset');
resetBtn.addEventListener('click', () => {
  typeBtns.forEach(btn => btn.classList.remove('active'));
  categoryBtns.forEach(btn => btn.classList.remove('active'));
  document.getElementById('gear-search').value = '';
  showAllGear();
});

// Поиск по названию экипировки
const searchBtn = document.getElementById('gear-search-btn');
const searchInput = document.getElementById('gear-search');
searchBtn.addEventListener('click', filterGear);
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    filterGear();
  }
});

// Показать все элементы экипировки
function showAllGear() {
  const cards = document.querySelectorAll('.gear-card');
  cards.forEach(card => {
    card.style.display = '';
  });
}

// Основная функция фильтрации
function filterGear() {
  const query = searchInput.value.trim().toLowerCase();
  const activeTypes = Array.from(typeBtns).filter(btn => btn.classList.contains('active')).map(btn => btn.dataset.type);
  const activeCategories = Array.from(categoryBtns).filter(btn => btn.classList.contains('active')).map(btn => btn.dataset.category);
  
  // Если нет активных фильтров и нет поиска, показываем все
  if (activeTypes.length === 0 && activeCategories.length === 0 && query === '') {
    showAllGear();
    return;
  }

  // Собираем все id элементов, которые должны быть показаны
  const showIds = new Set();

  // Добавляем элементы по типам
  activeTypes.forEach(type => {
    if (filterMapping[type]) {
      filterMapping[type].forEach(id => showIds.add(id));
    }
  });

  // Добавляем элементы по категориям
  activeCategories.forEach(category => {
    if (filterMapping[category]) {
      filterMapping[category].forEach(id => showIds.add(id));
    }
  });

  // Фильтруем все карточки
  const cards = document.querySelectorAll('.gear-card');
  cards.forEach(card => {
    const cardId = card.id;
    const title = card.querySelector('h3').textContent.toLowerCase();
    
    let shouldShow = false;

    // Проверяем поиск
    if (query !== '') {
      shouldShow = title.includes(query);
    } else {
      shouldShow = true;
    }

    // Если есть активные фильтры, проверяем соответствие
    if (activeTypes.length > 0 || activeCategories.length > 0) {
      shouldShow = shouldShow && showIds.has(cardId);
    }

    card.style.display = shouldShow ? '' : 'none';
  });
}

// Отмена отправки формы фильтра
const filterForm = document.getElementById('gear-filter-form');
filterForm.addEventListener('submit', function(event) {
  event.preventDefault();
}); 