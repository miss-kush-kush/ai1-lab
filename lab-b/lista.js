document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskDescription = taskInput.value.trim();
    const deadline = taskDeadline.value;

    if (!validateTask(taskDescription, deadline)) return;

    const tasks = getTasks();
    tasks.push({ description: taskDescription, deadline, completed: false });
    saveTasks(tasks);
    displayTasks();
    taskInput.value = "";
    taskDeadline.value = "";
}

function validateTask(description, deadline) {
    const now = new Date();
    const isValidDescription = description.length >= 3 && description.length <= 255;
    const isUniqueDescription = !getTasks().some(task => task.description === description);
    const isFutureDate = deadline === "" || new Date(deadline) > now;

    if (!isValidDescription) alert("Task must be 3 to 255 characters long.");
    else if (!isUniqueDescription) alert("Task description must be unique.");
    else if (!isFutureDate) alert("Deadline must be a future date.");
    
    return isValidDescription && isUniqueDescription && isFutureDate;
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    const tasks = getTasks();

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        if (task.completed) taskDiv.classList.add("task-completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskCompletion(index));

        const taskText = document.createElement("div");
        taskText.className = "task-text";
        taskText.textContent = task.description;
        taskText.addEventListener("click", () => enableEditTask(index, taskText));

        const taskDeadline = document.createElement("div");
        taskDeadline.className = "task-deadline";
        taskDeadline.textContent = task.deadline ? formatDate(task.deadline) : "No deadline";
        taskDeadline.addEventListener("click", () => enableEditDeadline(index, taskDeadline));

        const trashBtn = document.createElement("button");
        trashBtn.className = "trash-btn";
        trashBtn.textContent = "🗑️";
        trashBtn.addEventListener("click", () => deleteTask(index));

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(taskDeadline);
        taskDiv.appendChild(trashBtn);

        taskList.appendChild(taskDiv);
    });
}

function enableEditTask(index, taskText) {
    const tasks = getTasks();
    const task = tasks[index];

    const input = document.createElement("input");
    input.type = "text";
    input.value = task.description;
    input.className = "edit-input";
    input.maxLength = 255;

    input.addEventListener("blur", () => saveEditedTask(index, input.value));
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            input.blur();
        }
    });

    taskText.replaceWith(input);
    input.focus();
}

function saveEditedTask(index, newDescription) {
    if (newDescription.trim().length >= 3 && newDescription.trim().length <= 255) {
        const tasks = getTasks();
        if (!tasks.some((task, idx) => task.description === newDescription && idx !== index)) {
            tasks[index].description = newDescription.trim();
            saveTasks(tasks);
        } else {
            alert("Task description must be unique.");
        }
    } else {
        alert("Task description must be between 3 and 255 characters.");
    }
    displayTasks();
}

function enableEditDeadline(index, taskDeadline) {
    const tasks = getTasks();
    const task = tasks[index];

    const input = document.createElement("input");
    input.type = "datetime-local";
    input.value = task.deadline;
    input.className = "edit-input";

    input.addEventListener("blur", () => saveEditedDeadline(index, input.value));
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            input.blur();
        }
    });

    taskDeadline.replaceWith(input);
    input.focus();
}

function saveEditedDeadline(index, newDeadline) {
    if (newDeadline === "" || new Date(newDeadline) > new Date()) {
        const tasks = getTasks();
        tasks[index].deadline = newDeadline;
        saveTasks(tasks);
    } else {
        alert("Deadline must be a future date.");
    }
    displayTasks();
}

function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();
}

function toggleTaskCompletion(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    displayTasks();
}

function filterTasks() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase();
    if (searchInput.length < 2) {
        displayTasks();
        return;
    }

    const tasks = getTasks().filter(task => task.description.toLowerCase().includes(searchInput));
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        const taskText = document.createElement("div");
        taskText.className = "task-text";
        taskText.innerHTML = highlightText(task.description, searchInput);

        taskDiv.appendChild(taskText);
        taskList.appendChild(taskDiv);
    });
}

function highlightText(text, searchPhrase = "") {
    if (searchPhrase === "") return text;
    const regex = new RegExp(`(${searchPhrase})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}
