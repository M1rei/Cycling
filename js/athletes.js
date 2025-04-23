document.addEventListener('DOMContentLoaded', function() {
    const disciplineSelect = document.getElementById('discipline-select');
    const countrySelect = document.getElementById('country-select');
    const athleteCards = document.querySelectorAll('.athlete-card');
    const athletesGrid = document.querySelector('.athletes-grid');

    function filterAthletes() {
        const selectedDiscipline = disciplineSelect.value;
        const selectedCountry = countrySelect.value;

        athleteCards.forEach(card => {
            const athleteInfo = card.querySelector('.athlete-info');
            const discipline = athleteInfo.children[2].textContent;
            const country = athleteInfo.children[1].textContent;

            const disciplineMatch = selectedDiscipline === 'all' || discipline === selectedDiscipline;
            const countryMatch = selectedCountry === 'all' || country === selectedCountry;

            card.style.display = disciplineMatch && countryMatch ? 'flex' : 'none';
        });
    }

    disciplineSelect.addEventListener('change', filterAthletes);
    countrySelect.addEventListener('change', filterAthletes);
}); 