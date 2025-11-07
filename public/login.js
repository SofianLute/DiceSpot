document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const loginForm = document.getElementById("login-form");
  const msg = document.getElementById("msg");

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      msg.textContent = "⚠️ Please enter both username and password";
      msg.style.color = "orange";
      return;
    }

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Sauvegarde des infos du user
        localStorage.setItem("loggedInUser", JSON.stringify({
          username: data.user.username,
          role: data.user.role
        }));

        msg.textContent = "✅ Login successful!";
        msg.style.color = "green";

        // Redirection selon le rôle
        setTimeout(() => {
          window.location.href = data.user.role === "admin" ? "admin.html" : "index.html";
        }, 800);
      } else {
        msg.textContent = data.message || "❌ Invalid username or password";
        msg.style.color = "red";
      }

    } catch (err) {
      console.error("Error:", err);
      msg.textContent = "❌ Server connection error";
      msg.style.color = "red";
    }
  });
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartLink = document.querySelector("#cart-link");
  if (cartLink) {
    cartLink.textContent = `🛒 Cart (${cart.length})`;
  }
}
