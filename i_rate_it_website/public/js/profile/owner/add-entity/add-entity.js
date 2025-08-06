function handleAddEntitySubmit(event) {
  event.preventDefault();
  
  if (typeof window.clearAddEntityErrors === "function") {
    window.clearAddEntityErrors();
  }

  if (typeof window.extractAndValidateAddFormData !== "function") {
    console.error("Validation module not loaded");
    return;
  }

  const validationResult = window.extractAndValidateAddFormData();
  
  if (!validationResult.isValid) {
    if (typeof window.showAddEntityError === "function") {
      window.showAddEntityError(validationResult.error);
    }
    return;
  }

  const formData = validationResult.formData;
  const categoryValue = formData.category;

  if (categoryValue === "new") {
    handleNewCategorySubmit(formData);
  } else {
    handleExistingCategorySubmit(formData, categoryValue);
  }
}

function handleNewCategorySubmit(formData) {
  const newCategoryNameElement = document.getElementById("new-category-name");
  if (!newCategoryNameElement) {
    if (typeof window.showAddEntityError === "function") {
      window.showAddEntityError("New category name field not found.");
    }
    return;
  }

  const newCategoryName = newCategoryNameElement.value.trim();
  
  if (typeof window.validateNewCategoryName === "function") {
    const categoryValidation = window.validateNewCategoryName(newCategoryName);
    if (!categoryValidation.isValid) {
      if (typeof window.showAddEntityError === "function") {
        window.showAddEntityError(categoryValidation.error);
      }
      return;
    }
  }

  if (typeof window.validateTraits === "function") {
    const traitValidation = window.validateTraits();
    if (!traitValidation.isValid) {
      if (typeof window.showAddEntityError === "function") {
        window.showAddEntityError(traitValidation.error);
      }
      return;
    }

    const traits = traitValidation.traits;
    
    const pictureFile = document.getElementById("entity-add-picture").files[0];

    if (typeof window.createEntityWithNewCategory === "function") {
      const entityData = {
        name: formData.name,
        description: formData.description,
        city: formData.city
      };

      window.createEntityWithNewCategory(entityData, newCategoryName, traits, pictureFile)
        .then(() => {
          handleSuccessfulCreation();
        })
        .catch((error) => {
          console.error("Error creating entity with new category:", error);
          if (typeof window.showAddEntityError === "function") {
            window.showAddEntityError(error.message || "Failed to create entity with new category");
          }
        });
    } else {
      console.error("API module not loaded");
      if (typeof window.showAddEntityError === "function") {
        window.showAddEntityError("Required modules not loaded. Please refresh the page.");
      }
    }
  }
}

function handleExistingCategorySubmit(formData, categoryId) {
  const pictureFile = document.getElementById("entity-add-picture").files[0];
  
  if (typeof window.createNewEntity === "function") {
    const entityData = {
      name: formData.name,
      description: formData.description,
      city: formData.city,
      categoryId: categoryId
    };

    window.createNewEntity(entityData, pictureFile)
      .then(() => {
        handleSuccessfulCreation();
      })
      .catch((error) => {
        console.error("Error creating entity:", error);
        if (typeof window.showAddEntityError === "function") {
          window.showAddEntityError(error.message || "Failed to create entity");
        }
      });
  } else {
    console.error("API module not loaded");
    if (typeof window.showAddEntityError === "function") {
      window.showAddEntityError("Required modules not loaded. Please refresh the page.");
    }
  }
}

function handleSuccessfulCreation() {
  if (typeof window.showAddEntitySuccess === "function") {
    window.showAddEntitySuccess("Entity created successfully!");
  }
  setTimeout(() => {
    if (typeof window.closeAddEntityForm === "function") {
      window.closeAddEntityForm();
    }
    
    const myEntitiesContainer = document.getElementById("my-entities-container");
    if (myEntitiesContainer && 
        myEntitiesContainer.style.display !== "none" && 
        typeof window.loadMyEntities === "function") {
      window.loadMyEntities();
    }
  }, 2000);
}

window.handleAddEntitySubmit = handleAddEntitySubmit;
