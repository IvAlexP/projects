function closeAllRoleSections() {

  const pendingRolesContainer = document.getElementById("pending-roles-container");
  if (pendingRolesContainer) {
    pendingRolesContainer.style.display = "none";
  }
  
  const pendingEntitiesContainer = document.getElementById("pending-entities-container");
  if (pendingEntitiesContainer) {
    pendingEntitiesContainer.style.display = "none";
  }
  
  const manageAccountsContainer = document.getElementById("manage-accounts-container");
  if (manageAccountsContainer) {
    manageAccountsContainer.style.display = "none";
  }
  
  const statisticsContainer = document.getElementById("statistics-export-container");
  if (statisticsContainer) {
    statisticsContainer.style.display = "none";
  }
  
  const myEntitiesContainer = document.getElementById("my-entities-container");
  if (myEntitiesContainer) {
    myEntitiesContainer.style.display = "none";
  }
  
  const addEntityContainer = document.getElementById("entity-add-form-container");
  if (addEntityContainer) {
    addEntityContainer.style.display = "none";
  }

  const adminReportsContainer = document.getElementById("admin-reports-container");
  if (adminReportsContainer) {
    adminReportsContainer.style.display = "none";
  }
}

function setupRoleBasedSections(user) {
  const container = document.getElementById("role-specific-sections");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (user.role_name) {
    const roleName = user.role_name.toLowerCase();

    if (roleName === "admin") {
      setupAdminSection(container);
    } else if (roleName === "owner") {
      setupOwnerSection(container);
    }
  }
}

function setupAdminSection(container) {
  const adminContainer = document.createElement("div");
  adminContainer.className = "profile-container";

  const adminHeader = document.createElement("div");
  adminHeader.className = "profile-header";

  const adminTitle = document.createElement("h3");
  adminTitle.textContent = "Admin Panel";
  adminHeader.appendChild(adminTitle);

  const adminContent = document.createElement("div");
  adminContent.className = "profile-info role-buttons-container";

  const pendingRolesButton = document.createElement("button");
  pendingRolesButton.className = "button-full role-button";
  pendingRolesButton.textContent = "Pending Roles";
  pendingRolesButton.addEventListener("click", () => showPendingRoles());

  const pendingEntitiesButton = document.createElement("button");
  pendingEntitiesButton.className = "button-full role-button";
  pendingEntitiesButton.textContent = "Pending Entities";
  pendingEntitiesButton.addEventListener("click", () => showPendingEntities());

  const manageAccountsButton = document.createElement("button");
  manageAccountsButton.className = "button-full role-button";
  manageAccountsButton.textContent = "Accounts";
  manageAccountsButton.addEventListener("click", () => showManageAccounts());

  const reportsButton = document.createElement("button");
  reportsButton.className = "button-full role-button";
  reportsButton.textContent = "Reports";
  reportsButton.addEventListener("click", () => {
    window.showAdminReportsPanel();
  });

  const statisticsButton = document.createElement("button");
  statisticsButton.className = "button-full role-button";
  statisticsButton.textContent = "Statistics & Export";
  statisticsButton.addEventListener("click", () => showStatisticsExport());

  adminContent.appendChild(pendingRolesButton);
  adminContent.appendChild(pendingEntitiesButton);
  adminContent.appendChild(manageAccountsButton);
  adminContent.appendChild(reportsButton);
  adminContent.appendChild(statisticsButton);
  adminContainer.appendChild(adminHeader);
  adminContainer.appendChild(adminContent);
  container.appendChild(adminContainer);
}

function setupOwnerSection(container) {
  const ownerContainer = document.createElement("div");
  ownerContainer.className = "profile-container";

  const ownerHeader = document.createElement("div");
  ownerHeader.className = "profile-header";
  const ownerTitle = document.createElement("h3");
  ownerTitle.textContent = "Owner Panel";
  ownerHeader.appendChild(ownerTitle);

  const ownerContent = document.createElement("div");
  ownerContent.className = "profile-info role-buttons-container";

  const myEntitiesButton = document.createElement("button");
  myEntitiesButton.className = "button-full role-button";
  myEntitiesButton.textContent = "My Entities";
  myEntitiesButton.addEventListener("click", () => showMyEntities());

  const addEntityButton = document.createElement("button");
  addEntityButton.className = "button-full role-button";
  addEntityButton.textContent = "Add Entity";
  addEntityButton.addEventListener("click", () => showAddEntity());

  ownerContent.appendChild(myEntitiesButton);
  ownerContent.appendChild(addEntityButton);
  ownerContainer.appendChild(ownerHeader);
  ownerContainer.appendChild(ownerContent);
  container.appendChild(ownerContainer);
}

function createPendingRolesContainer() {
  if (document.getElementById("pending-roles-container")) {
    return; 
  }

  const container = document.createElement("div");
  container.id = "pending-roles-container";
  container.className = "pending-roles-container";

  const containerHeader = document.createElement("div");
  containerHeader.className = "pending-roles-header";

  const headerTitle = document.createElement("h3");
  headerTitle.textContent = "Pending Role Requests";
  const closeButton = document.createElement("button");
  closeButton.id = "close-pending-roles";
  closeButton.className = "close";
  closeButton.textContent = "X";

  containerHeader.appendChild(headerTitle);
  containerHeader.appendChild(closeButton);

  const rolesList = document.createElement("div");
  rolesList.id = "pending-roles-list";
  rolesList.className = "pending-roles-list";

  const comment = document.createComment(
    " Lista rolurilor în așteptare va fi populată prin JavaScript "
  );
  rolesList.appendChild(comment);

  container.appendChild(containerHeader);
  container.appendChild(rolesList);

  document.body.appendChild(container);
  // Setup close button
  document
    .getElementById("close-pending-roles")
    .addEventListener("click", () => {
      document.getElementById("pending-roles-container").style.display = "none";
    });
}

window.setupRoleBasedSections = setupRoleBasedSections;
window.createPendingRolesContainer = createPendingRolesContainer;
window.closeAllRoleSections = closeAllRoleSections;
