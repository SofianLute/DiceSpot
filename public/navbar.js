document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav-links");
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;

  // if user not logged in
  if (!storedUser) {
    nav.innerHTML = `
      <a href="index.html">Shop</a>
      <a href="cart.html" id="cart-link">🛒 Cart (${cartCount})</a>
      <a href="login.html">Login</a>
    `;
  } else {
    const { username, role } = storedUser;

    // if logged in, show username and logout
    nav.innerHTML = `
      <a href="index.html">Shop</a>
      <a href="cart.html" id="cart-link">🛒 Cart (${cartCount})</a>
      ${role === "admin" ? '<a href="admin.html">⚙️ Admin</a>' : ""}
      <a href="profile.html" id="profile-link">👤 Welcome, <strong>${username}</strong></a>
      <a href="#" id="logout">Logout</a>
    `;

    // logout button
    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      alert("👋 Logged out successfully!");
      location.href = "index.html";
    });
  }
});

// prevent zoom with ctrl + scroll
document.addEventListener("wheel", e => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

// prevent zoom with ctrl + or ctrl -
document.addEventListener("keydown", e => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) e.preventDefault();
});
