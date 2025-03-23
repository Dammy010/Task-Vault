const taskInput = document.getElementById("task-input");

const saveButton = document.
getElementById("add-task");
const exportButton = document.getElementById("export-task");
const lightMode = document.getElementById("light-mode");


const taskList = document.getElementById("task-list");

document.addEventListener("DOMContentLoaded", loadTask);
saveButton.addEventListener("click", function() {
    let taskText = taskInput.value.trim();

    if (taskText !== "") {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        let newTask = {
            text: taskText,
            timestamp: new Date().toISOString(),
            completed: false, 
        };

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTask();
        taskInput.value = "";
    }
});

function loadTask() {
    displayTask();
}

function displayTask() {
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    tasks.forEach(addTaskToList);
}

function addTaskToList(task) {
    let li = document.createElement("li");

    li.innerHTML = `
        <strong>${task.text}</strong>
        <small>${formatDate(task.timestamp)}</small>
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
    `;

    li.querySelector('input').addEventListener('change', (e) => {
        task.completed = e.target.checked;
        updateTask(task);
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "❌";
    deleteBtn.setAttribute("aria-label", "Delete task");

    deleteBtn.addEventListener("click", function() {
        deleteTask(task.text);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function updateTask(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map((task) => task.text === updatedTask.text ? updatedTask : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
}

function deleteTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
}

exportButton.addEventListener("click", function() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let jsonStr = JSON.stringify(tasks, null, 2);
    let blob = new Blob([jsonStr], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

lightMode.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
});

function formatDate(timestamp) {
    let date = new Date(timestamp);
    return date.toLocaleString();
}