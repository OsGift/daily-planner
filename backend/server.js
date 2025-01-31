const express = require("express")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

const app = express()
app.use(bodyParser.json())
app.use(cors())

const USERS_CSV = path.join(__dirname, "users.csv")
const TASKS_CSV = path.join(__dirname, "tasks.csv")

// Ensure CSV files exist
if (!fs.existsSync(USERS_CSV)) fs.writeFileSync(USERS_CSV, "id,username,password\n")
if (!fs.existsSync(TASKS_CSV)) fs.writeFileSync(TASKS_CSV, "id,userId,title,category,project,date\n")

// Utility function to read CSV data
const readCSV = (file) => {
  return fs.readFileSync(file, "utf8").split("\n").slice(1).map(line => line.split(","))
}

// **User Registration**
app.post("/signup", async (req, res) => {
  const { username, password } = req.body
  const users = readCSV(USERS_CSV)

  if (users.some(user => user[1] === username)) {
    return res.status(400).json({ message: "Username already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const userId = uuidv4()

  fs.appendFileSync(USERS_CSV, `\n${userId},${username},${hashedPassword}`)
  res.status(201).json({ message: "User created", userId })
})

// **User Login**
app.post("/login", async (req, res) => {
  const { username, password } = req.body
  const users = readCSV(USERS_CSV)

  const user = users.find(user => user[1] === username)
  if (!user) return res.status(400).json({ message: "User not found" })

  const isValidPassword = await bcrypt.compare(password, user[2])
  if (!isValidPassword) return res.status(400).json({ message: "Invalid password" })

  res.json({ message: "Login successful", userId: user[0] })
})

// **Add Task**
app.post("/add-task", (req, res) => {
    const { userId, title, category, project, date } = req.body
    if (!userId || !title || !date) {
      return res.status(400).json({ message: "Missing required fields" })
    }
  
    const taskId = uuidv4()
    const taskData = `\n${taskId},${userId},${title},${category || ""},${project || ""},${date}`
    
    fs.appendFile(TASKS_CSV, taskData, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving task" })
      }
      res.json({ message: "Task added successfully" })
    })
  })
  

// **Get Tasks for a User**
app.get("/tasks/:userId", (req, res) => {
  const userId = req.params.userId
  const tasks = readCSV(TASKS_CSV).filter(task => task[1] === userId)
  
  res.json(tasks.map(([id, , title, category, project, date]) => ({
    id, title, category, project, date
  })))
})

// 📌 Serve Frontend Files (IMPORTANT)
app.use(express.static(path.join(__dirname, "../frontend")))

// Redirect "/" to "index.html"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

// Start the server
app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"))
