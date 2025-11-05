async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    localStorage.setItem("user", username);
    localStorage.setItem("role", data.role);
    location.href = data.role === "admin" ? "admin.html" : "index.html";
  } else {
    document.getElementById("msg").textContent = "❌ Wrong username or password";
  }
}

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("msg").textContent = data.success ? "✅ Account created!" : "⚠️ Username already exists";
}
