
function handleCategoryChange() {
  const categorySelect = document.getElementById("entity-add-category");
  const newCategoryContainer = document.getElementById("new-category-container");

  if (!categorySelect || !newCategoryContainer) {
    return;
  }

  if (categorySelect.value === "new") {
    showNewCategoryForm();
  } else {
    hideNewCategoryForm();
  }
}

function showNewCategoryForm() {
  const newCategoryContainer = document.getElementById("new-category-container");
  if (newCategoryContainer) {
    newCategoryContainer.style.display = "block";

    const newCategoryNameInput = document.getElementById("new-category-name");
    if (newCategoryNameInput) {
      newCategoryNameInput.required = true;
    }

    for (let i = 1; i <= 5; i++) {
      const traitInput = document.getElementById(`new-trait-${i}`);
      if (traitInput) {
        traitInput.required = true;
      }
    }
  }
}


function hideNewCategoryForm() {
  const newCategoryContainer = document.getElementById("new-category-container");
  if (newCategoryContainer) {
    newCategoryContainer.style.display = "none";

    const newCategoryNameInput = document.getElementById("new-category-name");
    if (newCategoryNameInput) {
      newCategoryNameInput.required = false;
      newCategoryNameInput.value = "";
    }

    for (let i = 1; i <= 5; i++) {
      const traitInput = document.getElementById(`new-trait-${i}`);
      if (traitInput) {
        traitInput.required = false;
        traitInput.value = "";
      }
    }
  }
}


function loadCategoriesForAddForm() {
  const categorySelect = document.getElementById("entity-add-category");
  if (!categorySelect) {
    return;
  }

  while (categorySelect.children.length > 1) {
    categorySelect.removeChild(categorySelect.lastChild);
  }

  if (typeof window.loadCategories === "function") {
    window.loadCategories()
      .then((categories) => {
        populateCategoryDropdown(categories);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        if (typeof window.showAddEntityError === "function") {
          window.showAddEntityError("Failed to load categories. Please refresh the page.");
        }
      });  } else {
    fetch("/IRI_LilKartoffel/api/categories")
      .then((response) => response.json())
      .then((data) => {
        let categories;
        if (data.status === 200 && data.categories && Array.isArray(data.categories)) {
          categories = data.categories;
        } else if (Array.isArray(data.categories)) {
          categories = data.categories;
        } else if (Array.isArray(data)) {
          categories = data;
        } else {
          throw new Error("Invalid categories response format");
        }
        populateCategoryDropdown(categories);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        if (typeof window.showAddEntityError === "function") {
          window.showAddEntityError("Failed to load categories. Please refresh the page.");
        }
      });
  }
}


function populateCategoryDropdown(categories) {
  const categorySelect = document.getElementById("entity-add-category");
  if (!categorySelect) return;

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  const newCategoryOption = document.createElement("option");
  newCategoryOption.value = "new";
  newCategoryOption.textContent = "New Category...";
  categorySelect.appendChild(newCategoryOption);
}


function extractTraitValues() {
  const traits = [];
  for (let i = 1; i <= 5; i++) {
    const traitElement = document.getElementById(`new-trait-${i}`);
    if (traitElement) {
      const traitValue = traitElement.value.trim();
      if (traitValue) {
        traits.push(traitValue);
      }
    }
  }
  return traits;
}


function validateTraits() {
  const traits = extractTraitValues();
  
  if (traits.length < 5) {
    return {
      isValid: false,
      error: "All 5 traits are required for a new category"
    };
  }
  
  const uniqueTraits = [...new Set(traits)];
  if (uniqueTraits.length !== traits.length) {
    return {
      isValid: false,
      error: "All traits must be unique"
    };
  }
  
  return {
    isValid: true,
    traits: traits
  };
}

window.handleCategoryChange = handleCategoryChange;
window.showNewCategoryForm = showNewCategoryForm;
window.hideNewCategoryForm = hideNewCategoryForm;
window.loadCategoriesForAddForm = loadCategoriesForAddForm;
window.extractTraitValues = extractTraitValues;
window.validateTraits = validateTraits;
