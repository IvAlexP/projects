function showError(msg) {
  const err = document.getElementsByClassName("error-account-info")[0];
  
  while (err.firstChild) {
    err.removeChild(err.firstChild);
  }

  if (Array.isArray(msg)) {
    msg.forEach((errorMsg) => {
      const p = document.createElement("p");
      p.textContent = errorMsg;
      err.appendChild(p);
    });
  } else {
    const p = document.createElement("p");
    p.textContent = msg;
    err.appendChild(p);
  }

  err.style.display = "block";

  setTimeout(() => {
    clearErrors();
  }, 5000);
}

function clearErrors() {
  const err = document.getElementsByClassName("error-account-info")[0];
  if (err) {
    err.style.display = "none";
    while (err.firstChild) {
      err.removeChild(err.firstChild);
    }
  }
}

function showSuccessMessage(message, container) {
  const existingSuccess = container.querySelector(".success-message");
  if (existingSuccess) {
    existingSuccess.remove();
  }

  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  container.insertBefore(successDiv, container.firstChild);

  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}


function createProfileViewMode() {
    const viewModeContainer = document.createElement("div");
    viewModeContainer.className = "profile-info view-mode";
    
    const emailField = createProfileField("Email:", "email-view");
    viewModeContainer.appendChild(emailField);
    
    const firstNameField = createProfileField("First Name:", "first-name-view");
    viewModeContainer.appendChild(firstNameField);
    
    const lastNameField = createProfileField("Last Name:", "last-name-view");
    viewModeContainer.appendChild(lastNameField);
    
    const cityField = createProfileField("City:", "city-view");
    viewModeContainer.appendChild(cityField);
    
    // Role field (just label and value)
    const roleField = document.createElement("div");
    roleField.className = "profile-field";

    const roleLabel = document.createElement("div");
    roleLabel.className = "field-label";
    roleLabel.textContent = "Role:";

    const roleValue = document.createElement("div");
    roleValue.id = "role-view";
    roleValue.className = "field-value";
    roleValue.textContent = "—";

    roleField.appendChild(roleLabel);
    roleField.appendChild(roleValue);
    viewModeContainer.appendChild(roleField);

    const pendingRoleDiv = document.createElement("div");
    pendingRoleDiv.id = "pending-role-info";
    pendingRoleDiv.className = "pending-role";
    pendingRoleDiv.style.display = "none";
    
    const pendingSmall = document.createElement("small");
    pendingSmall.textContent = "Pending approval: ";
    const pendingRoleName = document.createElement("span");
    pendingRoleName.id = "pending-role-name";
    pendingSmall.appendChild(pendingRoleName);
    pendingRoleDiv.appendChild(pendingSmall);
    viewModeContainer.appendChild(pendingRoleDiv);
    
    const viewModeActions = document.createElement("div");
    viewModeActions.className = "profile-actions view-mode";
    
    const editProfileBtn = document.createElement("button");
    editProfileBtn.id = "edit-profile-btn";
    editProfileBtn.className = "button-full";
    editProfileBtn.textContent = "Edit";
    
    viewModeActions.appendChild(editProfileBtn);
    
    return { container: viewModeContainer, actions: viewModeActions };
}

function createProfileEditMode() {
    const editModeForm = document.createElement("form");
    editModeForm.className = "profile-form edit-mode";
    editModeForm.id = "profile-form-container";
    editModeForm.style.display = "none";
    
    const emailEditField = createEditField("Email:", "email", "email", true);
    editModeForm.appendChild(emailEditField);
    
    const firstNameEditField = createEditField("First Name:", "first_name", "text", false, true);
    editModeForm.appendChild(firstNameEditField);
    
    const lastNameEditField = createEditField("Last Name:", "last_name", "text", false, true);
    editModeForm.appendChild(lastNameEditField);
    
    const cityEditField = createEditField("City:", "city", "text", false, true);
    editModeForm.appendChild(cityEditField);
    
    const roleFieldDiv = document.createElement("div");
    roleFieldDiv.className = "profile-field";
    
    const roleLabel = document.createElement("div");
    roleLabel.className = "field-label";
    roleLabel.textContent = "Role:";
    
    const roleSelect = document.createElement("select");
    roleSelect.id = "role";
    roleSelect.name = "role";
    roleSelect.disabled = true;
    
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Loading roles...";
    roleSelect.appendChild(defaultOption);
    
    roleFieldDiv.appendChild(roleLabel);
    roleFieldDiv.appendChild(roleSelect);
    editModeForm.appendChild(roleFieldDiv);
    
    const editModeActions = document.createElement("div");
    editModeActions.className = "profile-actions";
    
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.id = "cancel-edit-btn";
    cancelBtn.className = "button-border";
    cancelBtn.textContent = "Cancel";
    
    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.id = "save-profile-btn";
    saveBtn.className = "button-full";
    saveBtn.textContent = "Save";
    
    editModeActions.appendChild(cancelBtn);
    editModeActions.appendChild(saveBtn);
    editModeForm.appendChild(editModeActions);
    
    return editModeForm;
}

function createProfileViewEditMode() {
    
    const existingContainer = document.getElementById("profile-main-container");
    if (existingContainer) {
        return existingContainer; 
    }

    const container = document.createElement("div");
    container.id = "profile-main-container";
    
    const errorsDiv = document.createElement("div");
    errorsDiv.id = "profile-form-errors";
    errorsDiv.className = "error-account-info";
    errorsDiv.style.display = "none";
    container.appendChild(errorsDiv);

    const viewMode = createProfileViewMode();
    container.appendChild(viewMode.container);
    container.appendChild(viewMode.actions);
    
    const editMode = createProfileEditMode();
    container.appendChild(editMode);

    return container;
}

function createProfileField(labelText, valueId) {
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "profile-field";
    
    const label = document.createElement("div");
    label.className = "field-label";
    label.textContent = labelText;
    
    const value = document.createElement("div");
    value.id = valueId;
    value.className = "field-value";
    value.textContent = "—";
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(value);
    
    return fieldDiv;
}

function createEditField(labelText, id, type, disabled = false, required = false) {
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "profile-field";
    
    const label = document.createElement("div");
    label.className = "field-label";
    label.textContent = labelText;
    
    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = id;
    
    if (disabled) input.disabled = true;
    if (required) input.required = true;
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(input);
    
    return fieldDiv;
}

function setupProfileUI() {
    const container = document.querySelector(".profile-container");
    if (!container) return;
    
    const header = container.querySelector(".profile-header");
    
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    container.appendChild(header);
    
    const viewEditContainer = createProfileViewEditMode();
    container.appendChild(viewEditContainer);
}

function updateProfile() {
  clearErrors();

  const first_name = document.getElementById("first_name").value.trim();
  const last_name = document.getElementById("last_name").value.trim();
  const city = document.getElementById("city").value.trim();
  const role_id = document.getElementById("role").value;

  if (!validateProfileData(first_name, last_name, city)) {
    return;
  }

  const updateData = { first_name, last_name, city };

  const roleSelect = document.getElementById("role");
  const currentRoleId = roleSelect.dataset.currentRoleId;

  if (role_id && !roleSelect.disabled && role_id !== currentRoleId) {
    updateData.role_id = role_id;
  }

  saveProfileData(updateData);
}

function setupButtons() {
  const editBtn = document.getElementById("edit-profile-btn");
  if (editBtn) {
    editBtn.onclick = () => {
      clearErrors();
      toggleMode("edit");
    };
  }

  const saveBtn = document.getElementById("save-profile-btn");
  if (saveBtn) {
    saveBtn.onclick = (e) => {
      e.preventDefault();
      updateProfile();
    }
  }

  const cancelBtn = document.getElementById("cancel-edit-btn");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      clearErrors();
      toggleMode("view");
    };
  }
}


function validateProfileData(first_name, last_name, city) {
  const errors = [];
  
  if (!first_name) {
    errors.push("First name is required");
  } else if (!/^[a-zA-Z0-9\s-]+$/.test(first_name)) {
    errors.push(
      "First name can only contain letters, numbers, spaces, and hyphens"
    );
  }

  if (!last_name) {
    errors.push("Last name is required");
  } else if (!/^[a-zA-Z0-9\s-]+$/.test(last_name)) {
    errors.push(
      "Last name can only contain letters, numbers, spaces, and hyphens"
    );
  }

  if (!city) {
    errors.push("City is required");
  } else if (!/^[a-zA-Z\s-]+$/.test(city)) {
    errors.push("City can only contain letters, spaces, and hyphens");
  }

  if (errors.length) {
    showError(errors);
    return false;
  }

  return true;
}

function toggleMode(mode) {
  document.querySelectorAll(".view-mode").forEach((el) => {
    el.style.display = mode === "view" ? "" : "none";
  });
  document.querySelectorAll(".edit-mode").forEach((el) => {
    el.style.display = mode === "edit" ? "" : "none";
  });
}

function fillViewMode(user) {
  document.getElementById("email-view").textContent = user.email;
  document.getElementById("first-name-view").textContent = user.first_name;
  document.getElementById("last-name-view").textContent = user.last_name;
  document.getElementById("city-view").textContent = user.city;
  document.getElementById("role-view").textContent = user.role_name || "Unknown";

  const pendingRoleInfo = document.getElementById("pending-role-info");
  const pendingRoleName = document.getElementById("pending-role-name");

  if (user.pending_role) {
    pendingRoleName.textContent = user.pending_role.role_name;
    pendingRoleInfo.style.display = "block";
  } else {
    pendingRoleInfo.style.display = "none";
  }

  document.getElementById("email").value = user.email;
  document.getElementById("first_name").value = user.first_name;
  document.getElementById("last_name").value = user.last_name;
  document.getElementById("city").value = user.city;

  if (
    user.role_name &&
    (user.role_name.toLowerCase() === "admin" ||
      user.role_name.toLowerCase() === "owner")
  ) {
    setupRoleBasedSections(user);
  }

  loadRoles(user.role_id, user.pending_role);
  setupButtons();
}

window.loadProfileData = loadProfileData;
window.toggleMode = toggleMode;
window.fillViewMode = fillViewMode;
window.showError = showError;
window.clearErrors = clearErrors;
window.showSuccessMessage = showSuccessMessage;
window.updateProfile = updateProfile;
window.setupProfileUI = setupProfileUI;
window.validateProfileData = validateProfileData;
window.createProfileViewMode = createProfileViewMode;
window.createProfileEditMode = createProfileEditMode;
window.createProfileViewEditMode = createProfileViewEditMode;
window.setupButtons = setupButtons;