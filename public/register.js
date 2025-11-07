document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const form = document.getElementById("register-form");
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
      alert("⚠️ Please fill in all fields!");
      return;
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // on envoie username et password
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`✅ Account created successfully for ${username}!`);
        window.location.href = "login.html";
      } else {
        alert(data.message || "❌ Registration failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Server error. Please try again later.");
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
