const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const FILE_PATH = "tasks.csv";

function readTasks() {
    if (!fs.existsSync(FILE_PATH)) return [];
    return fs.readFileSync(FILE_PATH, "utf-8")
        .split("\n")
        .filter(line => line)
        .map(line => {
            let [time, desc] = line.split(",");
            return { time, desc };
        });
}

function writeTasks(tasks) {
    fs.writeFileSync(FILE_PATH, tasks.map(task => `${task.time},${task.desc}`).join("\n"));
}

app.get("/get-tasks", (req, res) => {
    res.json(readTasks());
});

app.post("/add-task", (req, res) => {
    let tasks = readTasks();
    tasks.push(req.body);
    writeTasks(tasks);
    res.json({ message: "Task added" });
});

app.delete("/delete-task/:index", (req, res) => {
    let tasks = readTasks();
    tasks.splice(req.params.index, 1);
    writeTasks(tasks);
    res.json({ message: "Task deleted" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
