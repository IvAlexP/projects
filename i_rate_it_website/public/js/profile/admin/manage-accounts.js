function showManageAccounts() {
  closeAllRoleSections();
  createManageAccountsContainer();
  const container = document.getElementById("manage-accounts-container");
  container.style.display = "block";
  loadAllAccounts();
  setTimeout(() => {
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

function setupManageAccountsFunctionality() {
  document
    .getElementById("close-manage-accounts")
    .addEventListener("click", () => {
      document.getElementById("manage-accounts-container").style.display =
        "none";
    });
}

function loadAllAccounts() {
  const list = document.getElementById("accounts-list");
  list.innerHTML = "";

  const loading = document.createElement("div");
  loading.className = "loading-row";
  loading.textContent = "Loading user accounts...";
  list.appendChild(loading);

  fetch("/IRI_LilKartoffel/api/manage-accounts", {
    headers: JWTManager.getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => {
      list.innerHTML = "";
      if (data.success && data.users.length > 0) {
        data.users.forEach((u) => list.appendChild(createAccountRow(u)));
        attachDeleteListeners();
      } else {
        const noAcc = document.createElement("div");
        noAcc.className = "no-accounts-row";
        noAcc.textContent = "No user accounts found.";
        list.appendChild(noAcc);
      }
    })
    .catch((err) => {
      console.error(err);
      list.innerHTML = "";
      const errRow = document.createElement("div");
      errRow.className = "error-row";
      errRow.textContent = "Failed to load user accounts. Please try again.";
      list.appendChild(errRow);
    });
}

function createAccountRow(user) {
  const row = document.createElement("div");
  row.className = "account-row";
  row.dataset.userId = user.id;

  ["last_name", "first_name", "email", "city", "role_name"].forEach(
    (field, idx) => {
      const cell = document.createElement("div");
      cell.className = `account-cell field-${idx}`;
      cell.setAttribute(
        "data-label",
        ["Last Name", "First Name", "Email", "City", "Role"][idx]
      );
      cell.textContent = user[field];
      row.appendChild(cell);
    }
  );

  const action = document.createElement("div");
  action.className = "account-cell action-cell";
  action.setAttribute("data-label", "Actions");
  const btn = document.createElement("button");
  btn.className = "button-border delete-btn";
  btn.dataset.userId = user.id;
  btn.dataset.userName = `${user.first_name} ${user.last_name}`;
  btn.textContent = "Delete";
  action.appendChild(btn);
  row.appendChild(action);

  return row;
}

function attachDeleteListeners() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      handleDeleteUser(btn.dataset.userId, btn.dataset.userName)
    );
  });
}

function handleDeleteUser(id, name) {
  if (!confirm(`Are you sure you want to delete ${name}?`)) return;
  deleteUserAccount(id);
}

function deleteUserAccount(userId) {
  fetch("/IRI_LilKartoffel/api/delete-user", {
    method: "POST",
    headers: { ...JWTManager.getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Deleted!");
        loadAllAccounts();
      } else {
        alert(data.error || "Error deleting account.");
      }
    })
    .catch(() => alert("Network error."));
}

function createManageAccountsContainer() {
  if (document.getElementById("manage-accounts-container")) return;

  const container = document.createElement("div");
  container.id = "manage-accounts-container";
  container.className = "manage-accounts-container";

  const hdr = document.createElement("div");
  hdr.className = "manage-accounts-header";
  const title = document.createElement("h3");
  title.textContent = "Manage User Accounts";
  const close = document.createElement("button");
  close.id = "close-manage-accounts";
  close.className = "close";
  close.textContent = "X";
  hdr.append(title, close);

  const labels = document.createElement("div");
  labels.className = "accounts-header-row";
  ["Last Name", "First Name", "Email", "City", "Role", "Actions"].forEach(
    (txt) => {
      const d = document.createElement("div");
      d.className = "account-header-cell";
      d.textContent = txt;
      labels.appendChild(d);
    }
  );

  const list = document.createElement("div");
  list.id = "accounts-list";
  list.className = "accounts-list";

  container.append(hdr, labels, list);
  document.body.appendChild(container);

  setupManageAccountsFunctionality();
}

window.showManageAccounts = showManageAccounts;
window.setupManageAccountsFunctionality = setupManageAccountsFunctionality;
window.loadAllAccounts = loadAllAccounts;