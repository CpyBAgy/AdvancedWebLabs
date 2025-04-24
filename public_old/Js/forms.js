document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('animalForm');
    const tableContainer = document.getElementById('animalTable');
    const template = document.getElementById('animal-row-template'); // Получаем шаблон
    const animals = JSON.parse(localStorage.getItem('animals')) || [];

    const renderTable = () => {
        if (animals.length === 0) {
            tableContainer.innerHTML = '<p>Пока нет добавленных животных.</p>';
            return;
        }
        tableContainer.querySelectorAll('.cell').forEach(cell => cell.remove());
        animals.forEach((animal, index) => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.animal-name').textContent = animal.name;
            clone.querySelector('.animal-type').textContent = animal.type;
            clone.querySelector('.animal-age').textContent = animal.age;

            const deleteButton = clone.querySelector('.delete-button');
            
            deleteButton.dataset.index = index;
            deleteButton.addEventListener('click', () => {
                animals.splice(index, 1);
                localStorage.setItem('animals', JSON.stringify(animals));
                renderTable();
            });

            tableContainer.appendChild(clone);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const type = document.getElementById('type').value.trim();
        const age = document.getElementById('age').value.trim();
        if (name && type && !isNaN(age)) {
            animals.push({ name, type, age });
            localStorage.setItem('animals', JSON.stringify(animals));
            renderTable();
            form.reset();
        }
    });

    renderTable();
});