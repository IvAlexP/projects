function showAddEntity() {
  if (typeof window.closeAllRoleSections === "function") {
    window.closeAllRoleSections();
  }

  createAddEntityForm();
  const formContainer = document.getElementById("entity-add-form-container");
  if (formContainer) {
    formContainer.style.display = "block";
    formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}


function closeAddEntityForm() {
  const formContainer = document.getElementById("entity-add-form-container");
  if (formContainer) {
    formContainer.style.display = "none";
  }
  clearAddEntityErrors();
  clearAddEntityForm();
}


function clearAddEntityForm() {
  const form = document.getElementById("entity-add-form");
  if (form) {
    form.reset();
    
    const categoryElement = document.getElementById("entity-add-category");
    if (categoryElement) {
      categoryElement.value = "";
    }
    
    const newCategoryDiv = document.getElementById("new-category-input");
    if (newCategoryDiv) {
      newCategoryDiv.style.display = "none";
    }
  }
}


function clearAddEntityErrors() {
  const errorDiv = document.getElementById("entity-add-errors");
  if (errorDiv) {
    errorDiv.style.display = "none";
    errorDiv.className = "error";
    while (errorDiv.firstChild) {
      errorDiv.removeChild(errorDiv.firstChild);
    }
  }
}


function showAddEntityError(message) {
  const errorDiv = document.getElementById("entity-add-errors");
  if (!errorDiv) {
    console.error("Error div not found");
    return;
  }

  while (errorDiv.firstChild) {
    errorDiv.removeChild(errorDiv.firstChild);
  }

  errorDiv.className = "error";

  const errorParagraph = document.createElement("p");
  errorParagraph.textContent = message;
  errorDiv.appendChild(errorParagraph);
  errorDiv.style.display = "block";
}


function showAddEntitySuccess(message) {
  clearAddEntityErrors();

  const errorDiv = document.getElementById("entity-add-errors");
  if (!errorDiv) {
    console.error("Error/success div not found");
    return;
  }

  while (errorDiv.firstChild) {
    errorDiv.removeChild(errorDiv.firstChild);
  }

  errorDiv.className = "success-message";

  const successParagraph = document.createElement("p");
  successParagraph.textContent = message;
  errorDiv.appendChild(successParagraph);
  errorDiv.style.display = "block";
}

window.showAddEntity = showAddEntity;
window.closeAddEntityForm = closeAddEntityForm;
window.clearAddEntityForm = clearAddEntityForm;
window.clearAddEntityErrors = clearAddEntityErrors;
window.showAddEntityError = showAddEntityError;
window.showAddEntitySuccess = showAddEntitySuccess;
