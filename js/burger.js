document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger-menu');
    const nav = document.querySelector('.nav');
    if (burger && nav) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}); 