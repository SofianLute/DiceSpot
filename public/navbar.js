document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav-links");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  if (!user) {
    // Non connecté
    nav.innerHTML = `
      <a href="index.html">Shop</a>
      <a href="cart.html">🛒 Cart</a>
      <a href="login.html">Login</a>
    `;
  } else {
    // Connecté
    nav.innerHTML = `
      <a href="index.html">Shop</a>
      <a href="cart.html">🛒 Cart</a>
      ${role === "admin" ? '<a href="admin.html">⚙️ Admin</a>' : ""}
      <a href="#" id="logout">Logout (${user})</a>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      location.href = "index.html";
    });
  }
});
document.addEventListener('wheel', function (e) {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) e.preventDefault();
});
