function handleEntityEditSubmit(event) {
  event.preventDefault();
  
  if (typeof window.clearEntityEditErrors === "function") {
    window.clearEntityEditErrors();
  }

  const form = event.target;
  const entityId = form.dataset.entityId;
  const modal = document.getElementById("entity-edit-modal");
  const categoryId = modal.dataset.categoryId;

  console.log("Edit entity - entityId:", entityId);
  console.log("Edit entity - entityId type:", typeof entityId);
  console.log("Edit entity - categoryId:", categoryId);

  if (typeof window.extractAndValidateEditFormData !== "function") {
    console.error("Validation module not loaded");
    return;
  }

  const validationResult = window.extractAndValidateEditFormData();
  
  if (!validationResult.isValid) {
    if (typeof window.showEntityEditError === "function") {
      window.showEntityEditError(validationResult.error);
    }
    return;
  }

  const updateData = validationResult.formData;
  
  if (categoryId) {
    updateData.category_id = categoryId;
  }

  const pictureFile = document.getElementById("entity-picture").files[0];

  if (typeof window.updateEntityWithPicture !== "function") {
    console.error("API module not loaded");
    if (typeof window.showEntityEditError === "function") {
      window.showEntityEditError("Required modules not loaded. Please refresh the page.");
    }
    return;
  }

  window.updateEntityWithPicture(entityId, updateData, pictureFile)
    .then((finalResult) => {
      if (typeof window.showEntityEditSuccess === "function") {
        window.showEntityEditSuccess(
          finalResult.message || "Entity updated successfully!"
        );
      }      
      setTimeout(() => {
        if (typeof window.closeEntityEditModal === "function") {
          window.closeEntityEditModal();
        }
        const myEntitiesContainer = document.getElementById("my-entities-container");
        if (myEntitiesContainer && 
            myEntitiesContainer.style.display !== "none" && 
            typeof window.loadMyEntities === "function") {
          window.loadMyEntities();
        }
      }, 2000);
    })
    .catch((err) => {
      console.error("Error updating entity:", err);
      if (typeof window.showEntityEditError === "function") {
        window.showEntityEditError(
          err.message || "An error occurred. Please try again."
        );
      }
    });
}

window.handleEntityEditSubmit = handleEntityEditSubmit;
