document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("payment-form");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      status.textContent = "⚠️ Your cart is empty.";
      status.style.color = "orange";
      return;
    }

   
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    
    const items = cart.map((it) => ({
      id: parseInt(it.id, 10),
      qty: parseInt(it.quantity || 1, 10),
    }));

    status.textContent = "💳 Creating payment session…";
    status.style.color = "#5c4dff";

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: { name, email } }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        status.textContent = data.message || "❌ Unable to create payment session";
        status.style.color = "red";
        return;
      }

      
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      status.textContent = "❌ Network error — please try again.";
      status.style.color = "red";
    }
  });
});
