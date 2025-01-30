document.getElementById("task-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let time = document.getElementById("task-time").value;
    let desc = document.getElementById("task-desc").value;

    if (time && desc) {
        fetch('/add-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time, desc })
        })
        .then(response => response.json())
        .then(data => {
            loadTasks();
        });
    }

    document.getElementById("task-form").reset();
});

function loadTasks() {
    fetch('/get-tasks')
    .then(response => response.json())
    .then(tasks => {
        let taskList = document.getElementById("task-list");
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            let li = document.createElement("li");
            li.textContent = `${task.time} - ${task.desc}`;
            
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete");
            deleteBtn.onclick = () => deleteTask(index);
            
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    });
}

function deleteTask(index) {
    fetch(`/delete-task/${index}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
        loadTasks();
    });
}

loadTasks();
