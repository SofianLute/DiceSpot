document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const welcome = document.getElementById("welcome");
  const form = document.getElementById("profile-form");
  const usernameInput = document.getElementById("username");
  const statusMsg = document.getElementById("status-msg");

  if (!user) {
    location.href = "login.html";
    return;
  }

  welcome.textContent = `👋 Welcome, ${user.username}!`;
  usernameInput.value = user.username;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const newPassword = document.getElementById("password").value.trim();

    if (!newPassword) {
      statusMsg.textContent = "⚠️ Please enter a new password.";
      statusMsg.style.color = "orange";
      return;
    }

    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, newPassword })
      });

      const data = await res.json();

      if (data.success) {
        statusMsg.textContent = "✅ Profile updated successfully!";
        statusMsg.style.color = "green";
      } else {
        statusMsg.textContent = "❌ " + data.message;
        statusMsg.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      statusMsg.textContent = "❌ Server error";
      statusMsg.style.color = "red";
    }
  });
});
