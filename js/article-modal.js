// Тексты статей теперь хранятся во внешнем JSON-файле
let articlesList = [];

// Загрузка статей из JSON
fetch('data/articles.json')
    .then(response => response.json())
    .then(data => {
        articlesList = data;
    });

// Открытие модального окна
if (document.querySelectorAll('.guide-card .read-more').length) {
    document.querySelectorAll('.guide-card .read-more').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = btn.closest('.guide-card');
            const title = card.querySelector('h3').textContent.trim();
            document.querySelector('.modal-article-title').textContent = title;
            // Поиск статьи по заголовку
            const article = articlesList.find(a => a.title === title);
            document.querySelector('.modal-article-content').innerHTML = article ? article.content.join('') : 'Текст статьи не найден.';
            document.getElementById('articleModal').style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });
}
// Закрытие модального окна
function closeArticleModal() {
    document.getElementById('articleModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}
if (document.getElementById('closeArticleModal')) {
    document.getElementById('closeArticleModal').onclick = closeArticleModal;
}
if (document.getElementById('articleModal')) {
    document.getElementById('articleModal').onclick = function(e) {
        if (e.target === this) closeArticleModal();
    };
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeArticleModal();
}); 