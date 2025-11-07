document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav-links");
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;

  
  if (!storedUser) {
    nav.innerHTML = `
      <a href="index.html">Shop</a>
      <a href="cart.html" id="cart-link">🛒 Cart (${cartCount})</a>
      <a href="login.html">Login</a>
    `;
  } else {
    const { username, role } = storedUser;

    nav.innerHTML = `
      <a href="index.html">Shop</a>
      <a href="cart.html" id="cart-link">🛒 Cart (${cartCount})</a>
      ${role === "admin" ? '<a href="admin.html">⚙️ Admin</a>' : ""}
      <a href="profile.html" id="profile-link">👤 Welcome, <strong>${username}</strong></a>
      <a href="#" id="logout">Logout</a>
    `;

    
    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      alert("👋 Logged out successfully!");
      location.href = "index.html";
    });
  }
});



document.addEventListener("wheel", e => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

document.addEventListener("keydown", e => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) e.preventDefault();
});
