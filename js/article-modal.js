// Тексты статей
const articlesData = {
    'Чем полезен велосипед для здоровья': `
<b>Краткое описание:</b> 
Эта статья подчеркивает, как велоспорт помогает предотвратить серьезные заболевания, такие как ожирение, сердечные болезни, рак, диабет и артрит. 
Он описывается как низкоинтенсивная, экологически чистая активность, подходящая для всех возрастов.

<br><br><b>Основные положения:</b>
<ul>
    <li>Велоспорт требует всего 2–4 часов в неделю для улучшения общего состояния здоровья.</li>
    <li>Езда на велосипеде сжигает около 300 ккал/час, а ежедневные 30-минутные поездки могут помочь сжечь до 5 кг жира за год.</li>
    <li>Исследования показывают, что ежедневная езда снижает риск диабета на 40%.</li>
    <li>Велосипедисты в 2–3 раза меньше подвержены воздействию загрязнения воздуха, что улучшает функцию легких.</li>
    <li>14-летнее исследование с участием 30 000 человек (возраст 20–93 года) подтвердило, что велосипед защищает от сердечных заболеваний.</li>
</ul>
`,
    'Как велоспорт вредит здоровью? Рассказывает врач': `
<b>Краткое описание:</b> 
Несмотря на название, статья акцентирует внимание на пользе велоспорта, ссылаясь на исследования, которые демонстрируют снижение смертности и риска сердечных заболеваний, а также поддержку иммунной системы у пожилых людей.

<br><br><b>Основные положения:</b>
<ul>
    <li>Велоспорт может снизить общую смертность на 40% по сравнению с людьми, не занимающимися ездой на велосипеде.</li>
    <li>Риск коронарной болезни сердца снижается на 50%.</li>
    <li>У людей 55–79 лет велоспорт помогает сохранять молодость иммунной системы, снижая возрастные изменения.</li>
    <li>Рекомендации по физической активности во время беременности включают целевой пульс 60–80% от максимального (около 140 ударов в минуту).</li>
</ul>
`
};

// Открытие модального окна
if (document.querySelectorAll('.guide-card .read-more').length) {
    document.querySelectorAll('.guide-card .read-more').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = btn.closest('.guide-card');
            const title = card.querySelector('h3').textContent.trim();
            document.querySelector('.modal-article-title').textContent = title;
            document.querySelector('.modal-article-content').innerHTML = articlesData[title] || 'Текст статьи не найден.';
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