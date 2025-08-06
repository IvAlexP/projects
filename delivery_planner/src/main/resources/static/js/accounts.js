document.addEventListener("DOMContentLoaded", () => {
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

    fetchAllUsers();
});

const API_BASE = "/api";

function getAuthHeaders() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    return {
        "Content-Type": "application/json", "Authorization": "Bearer " + token
    };
}

async function fetchAllUsers() {
    try {
        const response = await fetch(API_BASE + "/admin/accounts", {
            method: "GET", headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) {
            window.location.href = "login.html";
            return;
        }
        const users = await response.json();
        populateUsersTable(users);
    } catch (error) {
        document.getElementById("errorMsg").innerText = "Error loading users";
        console.error(error);
    }
}

function populateUsersTable(users) {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    console.log(users);

    users.forEach(user => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.innerText = user.id;
        tr.appendChild(tdId);

        const tdUsername = document.createElement("td");
        tdUsername.innerText = user.username;
        tr.appendChild(tdUsername);

        const tdRoles = document.createElement("td");
        tdRoles.innerText = user.roles.join(", ");
        tr.appendChild(tdRoles);

        const tdActions = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete user";
        deleteBtn.onclick = () => handleDeleteUser(user.id);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

async function handleDeleteUser(userId) {
    if (!confirm(`Are you sure you want to delete user with ID=${userId}?`)) {
        return;
    }
    try {
        const response = await fetch(API_BASE + `/admin/accounts/${userId}`, {
            method: "DELETE", headers: getAuthHeaders()
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            fetchAllUsers();
        } else {
            alert("Error deleting user: " + data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error deleting user.");
    }
}

async function handleAddRole(event) {
    event.preventDefault();
    const userId = Number(document.getElementById("userIdToAddRole").value);
    const roleName = document.getElementById("roleToAdd").value.trim();

    try {
        const response = await fetch(API_BASE + "/admin/accounts/add-role", {
            method: "POST", headers: getAuthHeaders(),
            body: JSON.stringify({userId, roleName})
        });
        if (response.status === 200) {
            const successMsg = await response.json();
            alert(successMsg.message);
            fetchAllUsers();
            document.getElementById("addRoleForm").reset();
        } else {
            let errJson = {};
            try {
                errJson = await response.json();
            } catch (e) {
                alert("Error adding role.");
                return;
            }
            alert(errJson.message || "Error adding role.");
        }
    } catch (error) {
        console.error(error);
        alert("Error adding role.");
    }
}

async function handleRemoveRole(event) {
    event.preventDefault();
    const userId = Number(document.getElementById("userIdToRemoveRole").value);
    const roleName = document.getElementById("roleToRemove").value.trim();

    try {
        const response = await fetch(API_BASE + "/admin/accounts/remove-role", {
            method: "POST", headers: getAuthHeaders(), body: JSON.stringify({userId, roleName})
        });
        if (response.status === 200) {
            const successMessage = await response.json();
            alert(successMessage.message);
            await fetchAllUsers();
            document.getElementById("removeRoleForm").reset();
        } else {
            let errJson = {};
            try {
                errJson = await response.json();
            } catch (e) {
                alert("Response not json");
                return;
            }
            alert("Error deleting role: " + errJson.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error deleting role.");
    }
}

function handleLogout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
}
