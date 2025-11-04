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
    
    // Initialise SortableJS sur les 4 listes pour le glisser-déposer
    initSortable('focus');
    initSortable('l3');
    initSortable('concours');
    initSortable('ironman');
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
        
        // Sauvegarde la liste d'où provient la tâche
        const listId = li.closest('.task-list').id;
        const currentPrefix = listId.replace('-list', '');
        saveTasks(currentPrefix);
    });

    // Bouton de suppression
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche le clic de marquer la tâche
        
        // Trouve la liste parente pour la sauvegarde
        const listId = li.closest('.task-list').id;
        const currentPrefix = listId.replace('-list', '');
        
        li.remove();
        saveTasks(currentPrefix);
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

// ===========================================
// CODE AJOUTÉ POUR LE GLISSER-DEPOSER
// ===========================================
function initSortable(prefix) {
    const list = document.getElementById(`${prefix}-list`);
    
    new Sortable(list, {
        group: 'shared', // Le nom magique qui permet de glisser entre les listes
        animation: 150,   // Petite animation
        ghostClass: 'sortable-ghost', // Style de la tâche fantôme (optionnel)

        // Fonction appelée à la fin d'un glisser-déposer
        onEnd: function (evt) {
            // evt.from = la liste d'origine
            // evt.to = la nouvelle liste
            
            const originPrefix = evt.from.id.replace('-list', '');
            const destinationPrefix = evt.to.id.replace('-list', '');

            // On sauvegarde les deux listes qui ont été modifiées
            saveTasks(originPrefix);
            
            // Si la tâche a changé de colonne, on sauvegarde aussi la nouvelle colonne
            if (originPrefix !== destinationPrefix) {
                saveTasks(destinationPrefix);
            }
        }
    });
}
