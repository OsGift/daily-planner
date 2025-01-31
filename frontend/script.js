document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
  
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
  
    if (response.ok) {
      alert("Signup successful!")
      window.location.href = "login.html"
    } else {
      alert("Signup failed")
    }
  })
  
  document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
  
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
  
    if (response.ok) {
      localStorage.setItem("userId", (await response.json()).userId)
      window.location.href = "dashboard.html"
    } else {
      alert("Invalid credentials")
    }
  })
  
  document.getElementById("logout")?.addEventListener("click", () => {
    localStorage.removeItem("userId")
    window.location.href = "login.html"
  })
  