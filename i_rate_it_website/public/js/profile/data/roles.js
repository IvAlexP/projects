function loadRoles(currentRoleId, pendingRole) {
  fetch("/IRI_LilKartoffel/api/roles", {
    headers: JWTManager.getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => {
      const roleSelect = document.getElementById("role");

      while (roleSelect.firstChild) {
        roleSelect.removeChild(roleSelect.firstChild);
      }

      if (data.status === 200 && data.roles) {
        populateRoles(roleSelect, data.roles, currentRoleId);

        roleSelect.dataset.currentRoleId = currentRoleId;

        if (pendingRole) {
          roleSelect.disabled = true;
          roleSelect.title = "You have a pending role change request";
        } else {
          roleSelect.disabled = false;
          roleSelect.title = "";
        }
      } else {
        const errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Error loading roles";
        roleSelect.appendChild(errorOption);
        roleSelect.disabled = true;
      }
    })
    .catch((err) => {
      console.error("Error loading roles:", err);
      const roleSelect = document.getElementById("role");
      
      while (roleSelect.firstChild) {
        roleSelect.removeChild(roleSelect.firstChild);
      }
      
      const errorOption = document.createElement("option");
      errorOption.value = "";
      errorOption.textContent = "Error loading roles";
      roleSelect.appendChild(errorOption);
      roleSelect.disabled = true;
    });
}

function populateRoles(roleSelect, roles, currentRoleId) {
  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;

    if (role.id == currentRoleId) {
      option.selected = true;
    }

    roleSelect.appendChild(option);
  });
}

window.loadRoles = loadRoles;
window.populateRoles = populateRoles;
