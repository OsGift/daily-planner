async function loadReports() {
    const userId = localStorage.getItem("userId")
    const response = await fetch(`http://localhost:5000/tasks/${userId}`)
    const tasks = await response.json()
  
    const categoryCounts = {}
    const projectCounts = {}
  
    tasks.forEach(task => {
      categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1
      projectCounts[task.project] = (projectCounts[task.project] || 0) + 1
    })
  
    document.getElementById("categoryReport").innerHTML = Object.entries(categoryCounts)
      .map(([category, count]) => `<li>${category}: ${count} tasks</li>`)
      .join("")
  
    document.getElementById("projectReport").innerHTML = Object.entries(projectCounts)
      .map(([project, count]) => `<li>${project}: ${count} tasks</li>`)
      .join("")
  }
  
  loadReports()
  