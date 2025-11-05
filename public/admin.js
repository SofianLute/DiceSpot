document.addEventListener("DOMContentLoaded", loadProducts);
document.getElementById("newProductForm").addEventListener("submit", addProduct);

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  const container = document.getElementById("productList");
  container.innerHTML = products.map(p => `
    <div class="product">
      <h3>${p.name}</h3>
      <p>${p.price} €</p>
      <button onclick="deleteProduct(${p.id})">🗑️ Delete</button>
    </div>
  `).join("");
}

async function addProduct(e) {
  e.preventDefault();
  const name = name.value;
  const category = category.value;
  const price = price.value;
  const description = description.value;
  const image = image.value;

  await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, category, price, description, image })
  });
  loadProducts();
}

async function deleteProduct(id) {
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  loadProducts();
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}
