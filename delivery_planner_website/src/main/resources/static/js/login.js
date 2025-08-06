async function handleLogin(event) {
    event.preventDefault();
    const msgEl = document.getElementById("loginError");
    msgEl.textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value.trim();

    try {
        await loginUser(username, password, role);
        window.location.href = "./index.html";
    } catch (e) {
        msgEl.textContent = e.message;
    }
}

async function loginUser(username, password, role) {
    const response = await fetch(`api/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password, role})
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data) throw data;
        throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("jwtToken", data.accessToken);
    return data;
}
