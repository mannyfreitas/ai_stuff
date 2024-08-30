document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const pendingTasks = document.getElementById('pending-tasks');
    const completedTasks = document.getElementById('completed-tasks');

    // Set the due date input to the current date
    const setCurrentDate = () => {
        const today = new Date().toISOString().split('T')[0];
        dueDateInput.value = today;
    };

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        tasks.forEach(task => addTaskToDOM(task.text, task.dueDate, task.completed));
    };

    // Save tasks to localStorage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (taskText, dueDate, completed = false) => {
        const li = document.createElement('li');

        const taskDateSpan = document.createElement('span');
        taskDateSpan.className = 'task-date';
        taskDateSpan.textContent = dueDate;
        li.appendChild(taskDateSpan);

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = taskText;
        li.appendChild(taskTextSpan);

        if (completed) {
            li.classList.add('completed');
        }

        const actionButton = document.createElement('button');
        actionButton.className = 'task-button';
        actionButton.textContent = completed ? 'Restore' : 'Complete';
        actionButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            const isCompleted = li.classList.contains('completed');
            actionButton.textContent = isCompleted ? 'Restore' : 'Complete';
            updateTaskStatus(taskText, dueDate, isCompleted);
            moveTask(li, isCompleted);
        });
        li.appendChild(actionButton);

        if (completed) {
            completedTasks.appendChild(li);
        } else {
            pendingTasks.appendChild(li);
        }
    };

    // Update task status in localStorage
    const updateTaskStatus = (taskText, dueDate, completed) => {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.text === taskText && task.dueDate === dueDate ? { text: taskText, dueDate, completed } : task);
        saveTasks(tasks);
    };

    // Move task between lists
    const moveTask = (taskElement, isCompleted) => {
        if (isCompleted) {
            pendingTasks.removeChild(taskElement);
            completedTasks.appendChild(taskElement);
        } else {
            completedTasks.removeChild(taskElement);
            pendingTasks.appendChild(taskElement);
        }
        sortAndRenderTasks(); // Re-sort and re-render tasks after moving
    };

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        if (taskText && dueDate) {
            addTaskToDOM(taskText, dueDate);
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ text: taskText, dueDate, completed: false });
            saveTasks(tasks);
            taskInput.value = '';
            dueDateInput.value = '';
            setCurrentDate();
            sortAndRenderTasks();
        }
    });

    // Sort and render tasks
    const sortAndRenderTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        pendingTasks.innerHTML = '';
        completedTasks.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task.text, task.dueDate, task.completed));
    };

    // Initial load
    setCurrentDate();
    loadTasks();
});
