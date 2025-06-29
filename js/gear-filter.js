// Открытие/закрытие фильтра
const toggleBtn = document.getElementById('toggle-gear-filter');
const filterPanel = document.getElementById('gear-filter-panel');

toggleBtn.addEventListener('click', () => {
  filterPanel.classList.toggle('active');
});

// Активные кнопки фильтра
const typeBtns = document.querySelectorAll('.gear-filter-type');
typeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    filterGear(); // Фильтрация по типу срабатывает сразу
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
  // Показываем все карточки экипировки
  const cards = document.querySelectorAll('.gear-card');
  cards.forEach(card => {
    card.style.display = '';
  });
});

// Поиск по названию экипировки только по кнопке или Enter
const searchBtn = document.getElementById('gear-search-btn');
const searchInput = document.getElementById('gear-search');
searchBtn.addEventListener('click', filterGear);
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    filterGear();
  }
});

// Фильтрация по типу велоспорта и поиску
function filterGear() {
  const query = searchInput.value.trim().toLowerCase();
  const activeTypes = Array.from(typeBtns).filter(btn => btn.classList.contains('active')).map(btn => btn.dataset.type.toLowerCase());
  const activeCategories = Array.from(categoryBtns).filter(btn => btn.classList.contains('active')).map(btn => btn.dataset.category.toLowerCase());
  const cards = document.querySelectorAll('.gear-card');
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
    // Проверка типа
    let typeMatch = true;
    if (activeTypes.length > 0) {
      typeMatch = activeTypes.some(type => title.includes(type) || desc.includes(type));
    }
    // Проверка категории
    let categoryMatch = true;
    if (activeCategories.length > 0) {
      categoryMatch = activeCategories.some(cat => title.includes(cat) || desc.includes(cat));
    }
    // Проверка поиска
    let searchMatch = true;
    if (query.length > 0) {
      searchMatch = title.includes(query);
    }
    if (typeMatch && categoryMatch && searchMatch) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Отмена отправки формы фильтра
const filterForm = document.getElementById('gear-filter-form');
filterForm.addEventListener('submit', function(event) {
  event.preventDefault();
}); 