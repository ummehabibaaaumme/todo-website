// =========================
// ELEMENTS
// =========================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const clearCompleted = document.getElementById("clearCompleted");
const currentDate = document.getElementById("currentDate");


// =========================
// LOCAL STORAGE
// =========================

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];


// =========================
// DATE
// =========================

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});


// =========================
// SAVE TASKS
// =========================

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


// =========================
// CREATE TASK
// =========================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
});


// =========================
// RENDER TASKS
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

        tasks.forEach(function (task) {

            const taskItem = document.createElement("div");

            taskItem.className = "task-item";

            taskItem.innerHTML = `
                <button
                    class="task-check ${task.completed ? "completed" : ""}"
                    data-id="${task.id}"
                    aria-label="Mark task as completed"
                >
                    ${task.completed ? "✓" : ""}
                </button>

                <span
                    class="task-text ${task.completed ? "completed" : ""}"
                >
                    ${escapeHTML(task.text)}
                </span>

                <button
                    class="delete-button"
                    data-id="${task.id}"
                    aria-label="Delete task"
                    title="Delete task"
                >
                    ×
                </button>
            `;

            taskList.appendChild(taskItem);
        });
    }

    updateStatistics();
}


// =========================
// COMPLETE / DELETE TASK
// =========================

taskList.addEventListener("click", function (event) {

    const target = event.target;

    const taskId = Number(target.dataset.id);

    if (!taskId) {
        return;
    }


    // Complete task
    if (target.classList.contains("task-check")) {

        tasks = tasks.map(function (task) {

            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });

        saveTasks();

        renderTasks();
    }


    // Delete task
    if (target.classList.contains("delete-button")) {

        tasks = tasks.filter(function (task) {
            return task.id !== taskId;
        });

        saveTasks();

        renderTasks();
    }

});


// =========================
// CLEAR COMPLETED
// =========================

clearCompleted.addEventListener("click", function () {

    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();

    renderTasks();
});


// =========================
// STATISTICS
// =========================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
}


// =========================
// SECURITY HELPER
// =========================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// =========================
// INITIAL LOAD
// =========================

renderTasks();