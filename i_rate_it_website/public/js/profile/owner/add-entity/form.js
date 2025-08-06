function createAddEntityForm() {
  if (document.getElementById("entity-add-form-container")) {
    return; 
  }

  const ownerSection = findOwnerSection();
  if (!ownerSection) {
    console.error("Owner section not found");
    return;
  }

  const formContainer = createFormContainer();
  
  const form = createForm();
  
  assembleFormStructure(formContainer, form, ownerSection);
  
  setupFormEventListeners();
  
  if (typeof window.loadCategoriesForAddForm === "function") {
    window.loadCategoriesForAddForm();
  }
}

function findOwnerSection() {
  const ownerContainers = document.querySelectorAll(".profile-container");
  let ownerSection = null;

  ownerContainers.forEach((container) => {
    const header = container.querySelector(".profile-header h3");
    if (header && header.textContent === "Owner Panel") {
      ownerSection = container;
    }
  });

  return ownerSection;
}

function createFormContainer() {
  const formContainer = document.createElement("div");
  formContainer.id = "entity-add-form-container";
  formContainer.className = "entity-add-form-container profile-container";

  return formContainer;
}

function createFormHeader() {
  const formHeader = document.createElement("div");
  formHeader.className = "profile-header entity-add-header";

  const headerTitle = document.createElement("h3");
  headerTitle.textContent = "Add New Entity";

  const closeButton = document.createElement("span");
  closeButton.id = "close-entity-add";
  closeButton.className = "close";
  closeButton.textContent = "X";

  formHeader.appendChild(headerTitle);
  formHeader.appendChild(closeButton);

  return formHeader;
}

function createForm() {
  const form = document.createElement("form");
  form.id = "entity-add-form";
  form.className = "entity-add-form";

  const errorDiv = createErrorDiv();
  
  const nameField = createNameField();
  const descField = createDescriptionField();
  const cityField = createCityField();
  const categoryField = createCategoryField();
  const newCategoryContainer = createNewCategoryContainer();
  const pictureField = createPictureField();
  const actionsDiv = createActionsDiv();

  form.appendChild(errorDiv);
  form.appendChild(nameField);
  form.appendChild(descField);
  form.appendChild(cityField);
  form.appendChild(categoryField);
  form.appendChild(newCategoryContainer);
  form.appendChild(pictureField);
  form.appendChild(actionsDiv);

  return form;
}

function createErrorDiv() {
  const errorDiv = document.createElement("div");
  errorDiv.id = "entity-add-errors";
  errorDiv.className = "error";
  errorDiv.style.display = "none";
  return errorDiv;
}

function createNameField() {
  const nameField = document.createElement("div");
  nameField.className = "profile-field";
  
  const nameLabel = document.createElement("span");
  nameLabel.className = "field-label";
  nameLabel.textContent = "Name:";
  
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "entity-add-name";
  nameInput.name = "name";
  nameInput.required = true;
  
  nameField.appendChild(nameLabel);
  nameField.appendChild(nameInput);
  
  return nameField;
}

function createDescriptionField() {
  const descField = document.createElement("div");
  descField.className = "profile-field";
  
  const descLabel = document.createElement("span");
  descLabel.className = "field-label";
  descLabel.textContent = "Description:";
  
  const descTextarea = document.createElement("textarea");
  descTextarea.id = "entity-add-description";
  descTextarea.name = "description";
  descTextarea.rows = 4;
  descTextarea.required = true;
  
  descField.appendChild(descLabel);
  descField.appendChild(descTextarea);
  
  return descField;
}

function createCityField() {
  const cityField = document.createElement("div");
  cityField.className = "profile-field";
  
  const cityLabel = document.createElement("span");
  cityLabel.className = "field-label";
  cityLabel.textContent = "City:";
  
  const cityInput = document.createElement("input");
  cityInput.type = "text";
  cityInput.id = "entity-add-city";
  cityInput.name = "city";
  cityInput.required = true;
  
  cityField.appendChild(cityLabel);
  cityField.appendChild(cityInput);
  
  return cityField;
}

function createCategoryField() {
  const categoryField = document.createElement("div");
  categoryField.className = "profile-field";
  
  const categoryLabel = document.createElement("span");
  categoryLabel.className = "field-label";
  categoryLabel.textContent = "Category:";
  
  const categorySelect = document.createElement("select");
  categorySelect.id = "entity-add-category";
  categorySelect.name = "category_id";
  categorySelect.required = true;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a category...";
  categorySelect.appendChild(defaultOption);
  
  categoryField.appendChild(categoryLabel);
  categoryField.appendChild(categorySelect);
  
  return categoryField;
}


function createNewCategoryContainer() {
  const newCategoryContainer = document.createElement("div");
  newCategoryContainer.id = "new-category-container";
  newCategoryContainer.className = "new-category-container";
  newCategoryContainer.style.display = "none";

  const newCategoryNameField = createNewCategoryNameField();
  
  const traitsContainer = createTraitsContainer();

  newCategoryContainer.appendChild(newCategoryNameField);
  newCategoryContainer.appendChild(traitsContainer);

  return newCategoryContainer;
}


function createNewCategoryNameField() {
  const newCategoryNameField = document.createElement("div");
  newCategoryNameField.className = "profile-field";
  
  const newCategoryNameLabel = document.createElement("span");
  newCategoryNameLabel.className = "field-label";
  newCategoryNameLabel.textContent = "Category Name:";
  
  const newCategoryNameInput = document.createElement("input");
  newCategoryNameInput.type = "text";
  newCategoryNameInput.id = "new-category-name";
  newCategoryNameInput.name = "new_category_name";
  newCategoryNameInput.placeholder = "Enter category name...";
  
  newCategoryNameField.appendChild(newCategoryNameLabel);
  newCategoryNameField.appendChild(newCategoryNameInput);
  
  return newCategoryNameField;
}


function createTraitsContainer() {
  const traitsContainer = document.createElement("div");
  traitsContainer.className = "traits-container";

  for (let i = 1; i <= 5; i++) {
    const traitField = document.createElement("div");
    traitField.className = "profile-field trait-field";

    const traitLabel = document.createElement("span");
    traitLabel.className = "field-label trait-label";
    traitLabel.textContent = `Trait ${i}:`;
    
    const traitInput = document.createElement("input");
    traitInput.type = "text";
    traitInput.id = `new-trait-${i}`;
    traitInput.name = `new_trait_${i}`;
    traitInput.placeholder = "Enter trait name...";
    traitInput.required = false; 

    traitField.appendChild(traitLabel);
    traitField.appendChild(traitInput);
    traitsContainer.appendChild(traitField);
  }

  return traitsContainer;
}


function createPictureField() {
  const pictureField = document.createElement("div");
  pictureField.className = "profile-field picture-field";

  const pictureInputRow = document.createElement("div");
  pictureInputRow.className = "picture-input-row";

  const pictureLabel = document.createElement("span");
  pictureLabel.className = "field-label";
  pictureLabel.textContent = "Picture:";

  const pictureInput = document.createElement("input");
  pictureInput.type = "file";
  pictureInput.id = "entity-add-picture";
  pictureInput.name = "picture";
  pictureInput.accept = "image/*";

  pictureInputRow.appendChild(pictureLabel);
  pictureInputRow.appendChild(pictureInput);
  pictureField.appendChild(pictureInputRow);

  return pictureField;
}

function createActionsDiv() {
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "add-profile-actions";
  
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.id = "cancel-entity-add";
  cancelButton.className = "button-border";
  cancelButton.textContent = "Cancel";
  
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "button-full";
  submitButton.textContent = "Create";
  
  actionsDiv.appendChild(cancelButton);
  actionsDiv.appendChild(submitButton);
  
  return actionsDiv;
}

function assembleFormStructure(formContainer, form, ownerSection) {
  const formHeader = createFormHeader();
  const formContent = document.createElement("div");
  formContent.className = "profile-info entity-add-content";

  formContainer.appendChild(formHeader);
  formContent.appendChild(form);
  formContainer.appendChild(formContent);

  ownerSection.parentNode.insertBefore(formContainer, ownerSection.nextSibling);
}


function setupFormEventListeners() {
  const closeBtn = document.getElementById("close-entity-add");
  if (closeBtn && typeof window.closeAddEntityForm === "function") {
    closeBtn.addEventListener("click", window.closeAddEntityForm);
  }

  const cancelBtn = document.getElementById("cancel-entity-add");
  if (cancelBtn && typeof window.closeAddEntityForm === "function") {
    cancelBtn.addEventListener("click", window.closeAddEntityForm);
  }

  const form = document.getElementById("entity-add-form");
  if (form && typeof window.handleAddEntitySubmit === "function") {
    form.addEventListener("submit", window.handleAddEntitySubmit);
  }

  const categorySelect = document.getElementById("entity-add-category");
  if (categorySelect && typeof window.handleCategoryChange === "function") {
    categorySelect.addEventListener("change", window.handleCategoryChange);
  }
}

window.createAddEntityForm = createAddEntityForm;
