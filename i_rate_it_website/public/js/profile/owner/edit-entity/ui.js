function clearEntityEditErrors() {
  const errorDiv = document.getElementById("entity-edit-errors");
  if (errorDiv) {
    errorDiv.style.display = "none";
    errorDiv.className = "error";
    while (errorDiv.firstChild) {
      errorDiv.removeChild(errorDiv.firstChild);
    }
  }
}


function showEntityEditError(message) {
  const errorDiv = document.getElementById("entity-edit-errors");
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


function showEntityEditSuccess(message) {
  clearEntityEditErrors();

  const errorDiv = document.getElementById("entity-edit-errors");
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


window.clearEntityEditErrors = clearEntityEditErrors;
window.showEntityEditError = showEntityEditError;
window.showEntityEditSuccess = showEntityEditSuccess;
