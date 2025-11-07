document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  const productsContainer = document.getElementById("products");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");

  let products = [];

  // 🔹 Chargement initial des produits depuis le backend
  try {
    const res = await fetch("/api/products");
    products = await res.json();
    displayProducts(products);
  } catch (err) {
    console.error("Erreur chargement produits :", err);
    productsContainer.innerHTML = "<p>⚠️ Impossible de charger les produits.</p>";
  }

  // 🔹 Fonction d'affichage
  function displayProducts(list) {
    if (list.length === 0) {
      productsContainer.innerHTML = "<p>No products found 🧐</p>";
      return;
    }

    productsContainer.innerHTML = list.map((p, i) => `
      <div class="product" style="animation-delay:${i * 0.1}s">
        <img src="${p.image || 'https://via.placeholder.com/250'}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <strong>${p.price} €</strong>
        <em class="category-tag">${p.category || 'Uncategorized'}</em>
        <button class="add-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
          Add to cart
        </button>
      </div>
    `).join("");

    attachCartButtons();
  }

  // 🔹 Ajout au panier
  function attachCartButtons() {
    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        addToCart(id, name, price);
      });
    });
  }

  // 🔍 Filtrage texte et catégorie
  if (searchInput && categoryFilter) {
    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
  }

  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search);
      const matchCategory =
        category === "all" || (p.category && p.category.toLowerCase() === category);
      return matchSearch && matchCategory;
    });

    displayProducts(filtered);
  }
});

// === PANIER ===
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

// === NOTIF ===
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
