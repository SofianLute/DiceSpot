document.addEventListener("DOMContentLoaded", () => {
  updateCartCount(); // show how many items in the cart

  const loginForm = document.getElementById("login-form");
  const msg = document.getElementById("msg");

  // when user submits login form
  loginForm.addEventListener("submit", async e => {
    e.preventDefault(); // stop page reload

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // check if both fields are filled
    if (!username || !password) {
      msg.textContent = "⚠️ Please enter both username and password";
      msg.style.color = "orange";
      return;
    }

    try {
      // send login request to backend
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // save user info in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify({
          username: data.user.username,
          role: data.user.role
        }));

        msg.textContent = "✅ Login successful!";
        msg.style.color = "green";

        // redirect based on role
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

// update cart icon with number of items
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartLink = document.querySelector("#cart-link");
  if (cartLink) {
    cartLink.textContent = `🛒 Cart (${cart.length})`;
  }
}
