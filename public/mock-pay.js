document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const session = params.get("session"); // get session token from URL
  const sum = document.getElementById("sum");
  const form = document.getElementById("pay-form");
  const cancelBtn = document.getElementById("cancel");
  const msg = document.getElementById("msg");

  // if no session found in URL
  if (!session) {
    sum.textContent = "❌ Invalid session.";
    form.style.display = "none";
    return;
  }

  // load payment session info from backend
  fetch(`/api/checkout/session/${session}`)
    .then(r => r.json())
    .then(data => {
      if (!data.success) throw new Error("Session not found");
      const s = data.session;
      // show order details
      sum.innerHTML = `
        <div style="text-align:left">
          <p>Order #${s.order_id}</p>
          <p>Subtotal: <strong>${Number(s.subtotal).toFixed(2)} €</strong></p>
          <p>Tax (20%): <strong>${Number(s.tax).toFixed(2)} €</strong></p>
          <p>Shipping: <strong>${Number(s.shipping).toFixed(2)} €</strong></p>
          <p>Total to pay: <strong>${Number(s.total).toFixed(2)} €</strong></p>
        </div>`;
    })
    .catch(() => {
      sum.textContent = "❌ Session not found";
      form.style.display = "none";
    });

  // handle payment form submit
  form.addEventListener("submit", async e => {
    e.preventDefault();

    // get card number and last 4 digits
    const card = document.getElementById("card").value.replace(/\s+/g, "");
    const last4 = card.slice(-4) || "0000";

    msg.textContent = "Processing…";
    msg.style.color = "#5c4dff";

    // send payment info to backend
    const res = await fetch("/api/checkout/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, cardLast4: last4 })
    });

    const data = await res.json();

    // if payment success
    if (res.ok && data.success) {
      localStorage.removeItem("cart"); // clear cart
      window.location.href = `success.html?order=${data.orderId}`; // go to success page
    } else {
      msg.textContent = data.message || "❌ Payment failed";
      msg.style.color = "red";
    }
  });

  // handle cancel button
  cancelBtn.addEventListener("click", async () => {
    await fetch("/api/checkout/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session })
    });
    window.location.href = "cancel.html"; // go to cancel page
  });
});
