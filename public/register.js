document.addEventListener("DOMContentLoaded", () => {
  updateCartCount(); // show number of items in the cart

  const form = document.getElementById("register-form");

  // when user submits register form
  form.addEventListener("submit", async e => {
    e.preventDefault(); // stop page reload

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // check if all fields are filled
    if (!username || !email || !password) {
      alert("⚠️ Please fill in all fields!");
      return;
    }

    try {
      // send data to backend
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }) // send username and password
      });

      const data = await res.json();

      // if registration is ok
      if (res.ok && data.success) {
        alert(`✅ Account created successfully for ${username}!`);
        window.location.href = "login.html"; // redirect to login
      } else {
        alert(data.message || "❌ Registration failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Server error. Please try again later.");
    }
  });
});

// update cart icon with number of products
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartLink = document.querySelector("#cart-link");
  if (cartLink) {
    cartLink.textContent = `🛒 Cart (${cart.length})`;
  }
}
