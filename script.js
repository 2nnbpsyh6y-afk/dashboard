document.addEventListener('DOMContentLoaded', () => {
    // Affiche la date du jour
    const dateElement = document.getElementById('date');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    dateElement.textContent = new Date().toLocaleDateString('fr-FR', options);

    // Charge toutes les tâches depuis le localStorage
    loadTasks('focus');
    loadTasks('l3');
    loadTasks('concours');
    loadTasks('ironman');

    // Permet d'ajouter une tâche en appuyant sur "Entrée"
    setupInputKeypress('focus');
    setupInputKeypress('l3');
    setupInputKeypress('concours');
    setupInputKeypress('ironman');
});

function setupInputKeypress(prefix) {
    const input = document.getElementById(`${prefix}-input`);
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Empêche le rechargement de la page
            addTask(prefix);
        }
    });
}

// Fonction principale pour ajouter une tâche
function addTask(prefix) {
    const input = document.getElementById(`${prefix}-input`);
    const taskText = input.value.trim();

    if (taskText === '') return; // Ne pas ajouter de tâche vide

    const task = createTaskElement(taskText, prefix, false);
    document.getElementById(`${prefix}-list`).appendChild(task);

    saveTasks(prefix);
    input.value = ''; // Vider le champ de saisie
}

// Crée l'élément LI (la tâche visuelle)
function createTaskElement(taskText, prefix, isCompleted) {
    const li = document.createElement('li');
    li.textContent = taskText;
    if (isCompleted) {
        li.classList.add('completed');
    }

    // Clique pour marquer comme "complet"
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks(prefix);
    });

    // Bouton de suppression
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche le clic de marquer la tâche
        li.remove();
        saveTasks(prefix);
    });

    li.appendChild(deleteBtn);
    return li;
}

// Sauvegarde les tâches de la colonne dans le localStorage
function saveTasks(prefix) {
    const tasks = [];
    const taskList = document.getElementById(`${prefix}-list`).querySelectorAll('li');
    
    taskList.forEach(li => {
        tasks.push({
            text: li.textContent.replace('×', '').trim(), // Enlève le '×' du bouton
            completed: li.classList.contains('completed')
        });
    });

    localStorage.setItem(`dashboard-tasks-${prefix}`, JSON.stringify(tasks));
}

// Charge les tâches au démarrage
function loadTasks(prefix) {
    const tasks = JSON.parse(localStorage.getItem(`dashboard-tasks-${prefix}`)) || [];
    const taskList = document.getElementById(`${prefix}-list`);

    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text, prefix, task.completed);
        taskList.appendChild(taskElement);
    });
}
