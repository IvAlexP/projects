function validateAddEntityForm(formData) {
  const { name, description, city, category } = formData;

  if (!name || !name.trim()) {
    return {
      isValid: false,
      error: "Entity name is required"
    };
  }

  if (!description || !description.trim()) {
    return {
      isValid: false,
      error: "Description is required"
    };
  }

  if (!city || !city.trim()) {
    return {
      isValid: false,
      error: "City is required"
    };
  }

  if (!category) {
    return {
      isValid: false,
      error: "Category is required"
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: "Entity name must be at least 2 characters long"
    };
  }

  if (description.trim().length < 10) {
    return {
      isValid: false,
      error: "Description must be at least 10 characters long"
    };
  }

  if (city.trim().length < 2) {
    return {
      isValid: false,
      error: "City name must be at least 2 characters long"
    };
  }

  return {
    isValid: true,
    error: null
  };
}

function validateNewCategoryName(categoryName) {
  if (!categoryName || !categoryName.trim()) {
    return {
      isValid: false,
      error: "New category name is required"
    };
  }

  if (categoryName.trim().length < 3) {
    return {
      isValid: false,
      error: "Category name must be at least 3 characters long"
    };
  }

  if (categoryName.trim().length > 50) {
    return {
      isValid: false,
      error: "Category name must be less than 50 characters"
    };
  }

  return {
    isValid: true,
    error: null
  };
}

function extractAndValidateAddFormData() {
  const nameElement = document.getElementById("entity-add-name");
  const descElement = document.getElementById("entity-add-description");
  const cityElement = document.getElementById("entity-add-city");
  const categoryElement = document.getElementById("entity-add-category");
  const pictureInput = document.getElementById("entity-add-picture");

  if (!nameElement || !descElement || !cityElement || !categoryElement || !pictureInput) {
    return {
      isValid: false,
      error: "Form elements not found. Please try again.",
      formData: null
    };
  }

  
  if (!pictureInput.files || pictureInput.files.length === 0) {
    return {
      isValid: false,
      error: "A picture is required to add an entity.",
      formData: null
    };
  }

  const formData = {
    name: nameElement.value.trim(),
    description: descElement.value.trim(),
    city: cityElement.value.trim(),
    category: categoryElement.value
  };

  const validation = validateAddEntityForm(formData);
  return {
    isValid: validation.isValid,
    error: validation.error,
    formData: formData
  };
}

window.validateAddEntityForm = validateAddEntityForm;
window.validateNewCategoryName = validateNewCategoryName;
window.extractAndValidateAddFormData = extractAndValidateAddFormData;
