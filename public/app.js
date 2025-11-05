document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  const productsContainer = document.getElementById("products");

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    productsContainer.innerHTML = products.map((p, i) => `
      <div class="product" style="animation-delay:${i * 0.1}s">
        <img src="${p.image || 'https://via.placeholder.com/250'}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <strong>${p.price} €</strong>
        <button class="add-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
          Add to cart
        </button>
      </div>
    `).join("");

    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        addToCart(id, name, price);
      });
    });
  } catch {
    productsContainer.innerHTML = "<p>⚠️ Impossible de charger les produits.</p>";
  }
});

function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLink = document.querySelector("#cart-link");
    if (cartLink) cartLink.textContent = `🛒 Cart (${cart.length})`;
  } catch (err) {
    console.error("Erreur updateCartCount:", err);
  }
}

function addToCart(id, name, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification(`${name} added to cart!`);
}

function showNotification(msg) {
  const notif = document.createElement("div");
  notif.textContent = msg;
  notif.style.position = "fixed";
  notif.style.bottom = "20px";
  notif.style.right = "20px";
  notif.style.background = "#5c4dff";
  notif.style.color = "white";
  notif.style.padding = "10px 15px";
  notif.style.borderRadius = "8px";
  notif.style.fontWeight = "600";
  notif.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)";
  notif.style.opacity = "1";
  notif.style.transition = "opacity 0.6s ease";
  document.body.appendChild(notif);
  setTimeout(() => notif.style.opacity = "0", 1200);
  setTimeout(() => notif.remove(), 2000);
}
