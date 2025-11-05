document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("payment-form");
  const status = document.getElementById("status");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      status.textContent = "⚠️ Your cart is empty.";
      return;
    }

    status.textContent = "Processing payment...";
    status.style.color = "#5c4dff";

    setTimeout(() => {
      localStorage.removeItem("cart");
      status.innerHTML = "✅ Payment successful!<br>Thank you for your purchase 🎉";
      status.style.color = "green";

      setTimeout(() => {
        location.href = "index.html";
      }, 2500);
    }, 2000);
  });
});
