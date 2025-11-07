document.addEventListener("DOMContentLoaded", () => {
  updateCartCount(); // show cart item count
  updateCart(); // show cart content
});

function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLink = document.querySelector("#cart-link");
    if (cartLink) cartLink.textContent = `🛒 Cart (${cart.length})`;
  } catch (err) {
    console.error("Error updateCartCount:", err);
  }
}

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-container");
  const summary = document.getElementById("cart-summary");

  // if cart empty
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty 🛍️</p>";
    summary.innerHTML = "";
    updateCartCount();
    return;
  }

  let subtotal = 0;
  // display each product in cart
  container.innerHTML = cart.map((item, i) => {
    const price = parseFloat(item.price) || 0;
    const qty = item.quantity || 1;
    subtotal += price * qty;

    return `
      <div class="cart-item">
        <h3>${item.name}</h3>
        <p>${price.toFixed(2)} € × 
          <input type="number" min="1" value="${qty}" data-index="${i}" class="qty-input">
        </p>
        <button class="remove-btn" data-index="${i}">Remove</button>
      </div>
    `;
  }).join("");

  // calculate total + tax
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  // show order summary
  summary.innerHTML = `
    <h3>Order Summary</h3>
    <p>Subtotal: <strong>${subtotal.toFixed(2)} €</strong></p>
    <p>Tax (20%): <strong>${tax.toFixed(2)} €</strong></p>
    <p>Total: <strong>${total.toFixed(2)} €</strong></p>
    <button id="checkout">Proceed to Payment 💳</button>
  `;

  // update quantity when input changes
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", e => {
      const i = e.target.dataset.index;
      cart[i].quantity = parseInt(e.target.value);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
      updateCartCount();
    });
  });

  // remove product from cart
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.dataset.index;
      cart.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
      updateCartCount();
    });
  });

  // go to checkout page
  const checkoutBtn = document.getElementById("checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
}
