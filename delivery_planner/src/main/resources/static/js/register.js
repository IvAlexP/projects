async function handleRegister(event) {
    event.preventDefault();
    const msgEl = document.getElementById("registerMessage");
    msgEl.textContent = "";
    msgEl.style.color = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        await registerUser(username, password);
        msgEl.style.color = "green";
        msgEl.textContent = "You have been registered! Redirecting to login...";
        setTimeout(() => window.location.href = "/login.html", 2000);
    } catch (e) {
        msgEl.style.color = "red";
        msgEl.textContent = e.message;
    }
}

async function registerUser(username, password, email) {
    const response = await fetch(`api/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password, email})
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data && data.error) throw new Error(data.error);
        if (data && typeof data === "object") {
            const msgs = Object.values(data).join("; ");
            throw new Error(msgs);
        }
        throw new Error("Registration failed");
    }
}