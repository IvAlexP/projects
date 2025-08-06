async function loadHome() {
    const token = getToken();
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("/api/users/user", {
            headers: {"Authorization": "Bearer " + token}
        });

        if (!response.ok) {
            logoutUser();
            return;
        }

        const user = await response.json();

        const div = document.getElementById("homeContent");
        div.innerHTML = `
                Welcome to DeliveryPlanner, ${user.username}!
            `;
    } catch (e) {
        console.error(e);
        logoutUser();
    }
}

document.addEventListener("DOMContentLoaded", loadHome);

document.addEventListener('DOMContentLoaded', () => {
    const adminItems = document.querySelectorAll('.admin-only');
    if (isAdmin()) {
        adminItems.forEach(el => {
            el.style.display = 'inline-block';
        });
    } else {
        adminItems.forEach(el => {
            el.style.display = 'none';
        });
    }
});