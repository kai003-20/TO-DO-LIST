let taskIdCounter = 1;
let todoListtContainer = document.getElementById("todoList");

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const todoList = document.getElementById('todoList');

    if (taskInput.value.trim() !== '') {
        const taskId = 'task' + taskIdCounter++;
        const task = createTaskElement(taskInput.value, taskId);
        todoList.appendChild(task);
        taskInput.value = '';
    }

    saveTasks();
}

function saveTasks() {
    const tasks = [];

    // Iterate through all task elements and store their text and ID
    const taskElements = document.querySelectorAll('.task');
    taskElements.forEach(taskElement => {
        tasks.push({
            id: taskElement.id,
            text: taskElement.querySelector('.task-content').textContent
        });
    });

    // Store the tasks array in localStorage as a JSON string
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
    // Retrieve the saved tasks from localStorage
    let savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        // Parse the JSON string back to an array
        savedTasks = JSON.parse(savedTasks);

        // Iterate through the tasks and create task elements
        savedTasks.forEach(savedTask => {
            const task = createTaskElement(savedTask.text, savedTask.id);
            todoListtContainer.appendChild(task);
        });
    }
}

showTasks();

function createTaskElement(taskText, taskId) {
    const task = document.createElement('li');
    task.id = taskId;
    task.className = 'task';
    task.draggable = true;
    task.addEventListener('dragstart', dragStart);

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content'; // Added a class for easier selection
    taskContent.textContent = taskText;

    const actionIcons = document.createElement('div');
    actionIcons.className = 'action-icons';
    
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check';
    checkIcon.addEventListener('click', completeTask);

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt';
    deleteIcon.addEventListener('click', deleteTask);

    actionIcons.appendChild(checkIcon);
    actionIcons.appendChild(deleteIcon);

    task.appendChild(taskContent);
    task.appendChild(actionIcons);

    return task;
}

function completeTask() {
    const task = this.parentNode.parentNode;
    task.classList.toggle('completed');
    saveTasks(); // Save tasks after completion status is toggled
}

function deleteTask() {
    const task = this.parentNode.parentNode;
    task.parentNode.removeChild(task);
    saveTasks(); // Save tasks after deletion
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const task = document.getElementById(taskId);

    if (event.target.classList.contains('task-list')) {
        event.target.appendChild(task);
        saveTasks(); // Save tasks after dropping
    }
}
