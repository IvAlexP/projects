function createEntityEditModal() {
  if (document.getElementById("entity-edit-modal")) {
    return; 
  }

  const modal = document.createElement("div");
  modal.id = "entity-edit-modal";
  modal.className = "entity-edit-modal";

  const modalContent = document.createElement("div");
  modalContent.className = "entity-edit-content";

  const modalHeader = document.createElement("div");
  modalHeader.className = "entity-edit-header";

  const headerTitle = document.createElement("h3");
  headerTitle.textContent = "Edit Entity";

  const closeButton = document.createElement("span");
  closeButton.id = "close-entity-edit";
  closeButton.className = "close";
  closeButton.textContent = "X";

  modalHeader.appendChild(headerTitle);
  modalHeader.appendChild(closeButton);

  const form = document.createElement("form");
  form.id = "entity-edit-form";
  form.className = "entity-edit-form";

  const errorDiv = document.createElement("div");
  errorDiv.id = "entity-edit-errors";
  errorDiv.className = "error";
  errorDiv.style.display = "none";

  createFormFields(form, errorDiv);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  setupModalEventListeners();
}


function createFormFields(form, errorDiv) {
  const nameField = createFieldDiv("Name:", "text", "entity-name", "name", true);
  
  const descField = createTextareaFieldDiv("Description:", "entity-description", "description", 4, true);
  
  const cityField = createFieldDiv("City:", "text", "entity-city", "city", true);
  
  const categoryField = createCategoryFieldDiv();
  
  const pictureField = createPictureFieldDiv();
  
  const actionsDiv = createActionsDiv();

  form.appendChild(errorDiv);
  form.appendChild(nameField);
  form.appendChild(descField);
  form.appendChild(cityField);
  form.appendChild(categoryField);
  form.appendChild(pictureField);
  form.appendChild(actionsDiv);
}


function createFieldDiv(labelText, inputType, inputId, inputName, required = false) {
  const fieldDiv = document.createElement("div");
  fieldDiv.className = "profile-field";
  
  const label = document.createElement("span");
  label.className = "field-label";
  label.textContent = labelText;
  
  const input = document.createElement("input");
  input.type = inputType;
  input.id = inputId;
  input.name = inputName;
  input.required = required;
  
  fieldDiv.appendChild(label);
  fieldDiv.appendChild(input);
  
  return fieldDiv;
}


function createTextareaFieldDiv(labelText, textareaId, textareaName, rows = 4, required = false) {
  const fieldDiv = document.createElement("div");
  fieldDiv.className = "profile-field";
  
  const label = document.createElement("span");
  label.className = "field-label";
  label.textContent = labelText;
  
  const textarea = document.createElement("textarea");
  textarea.id = textareaId;
  textarea.name = textareaName;
  textarea.rows = rows;
  textarea.required = required;
  
  fieldDiv.appendChild(label);
  fieldDiv.appendChild(textarea);
  
  return fieldDiv;
}

function createCategoryFieldDiv() {
  const categoryField = document.createElement("div");
  categoryField.className = "profile-field";
  
  const categoryLabel = document.createElement("span");
  categoryLabel.className = "field-label";
  categoryLabel.textContent = "Category:";
  
  const categoryDisplay = document.createElement("span");
  categoryDisplay.id = "entity-category-display";
  categoryDisplay.className = "field-value";
  categoryDisplay.textContent = "Loading...";

  categoryField.appendChild(categoryLabel);
  categoryField.appendChild(categoryDisplay);
  
  return categoryField;
}

function createPictureFieldDiv() {
  const pictureField = document.createElement("div");
  pictureField.className = "profile-field picture-field";

  const pictureInputRow = document.createElement("div");
  pictureInputRow.className = "picture-input-row";

  const pictureLabel = document.createElement("span");
  pictureLabel.className = "field-label";
  pictureLabel.textContent = "Picture:";

  const pictureInput = document.createElement("input");
  pictureInput.type = "file";
  pictureInput.id = "entity-picture";
  pictureInput.name = "picture";
  pictureInput.accept = "image/*";

  pictureInputRow.appendChild(pictureLabel);
  pictureInputRow.appendChild(pictureInput);

  const currentPictureDiv = document.createElement("div");
  currentPictureDiv.id = "current-picture";
  currentPictureDiv.className = "current-picture";

  pictureField.appendChild(pictureInputRow);
  pictureField.appendChild(currentPictureDiv);
  
  return pictureField;
}


function createActionsDiv() {
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "edit-profile-actions";
  
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.id = "cancel-entity-edit";
  cancelButton.className = "button-border";
  cancelButton.textContent = "Cancel";
  
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "button-full";
  submitButton.textContent = "Save";
  
  actionsDiv.appendChild(cancelButton);
  actionsDiv.appendChild(submitButton);
  
  return actionsDiv;
}


function closeEntityEditModal() {
  const modal = document.getElementById("entity-edit-modal");
  if (modal) {
    modal.style.display = "none";
  }
  
  if (typeof window.clearEntityEditErrors === "function") {
    window.clearEntityEditErrors();
  }
}


function setupModalEventListeners() {
  const closeBtn = document.getElementById("close-entity-edit");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeEntityEditModal);
  }
  
  const cancelBtn = document.getElementById("cancel-entity-edit");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeEntityEditModal);
  }
  
  const form = document.getElementById("entity-edit-form");
  if (form && typeof window.handleEntityEditSubmit === "function") {
    form.addEventListener("submit", window.handleEntityEditSubmit);
  }
  
  const modal = document.getElementById("entity-edit-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "entity-edit-modal") {
        closeEntityEditModal();
      }
    });
  }
}

window.createEntityEditModal = createEntityEditModal;
window.closeEntityEditModal = closeEntityEditModal;
