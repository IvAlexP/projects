function validateEntityEditForm(formData) {
  const { name, description, city } = formData;

  if (!name || !name.trim()) {
    return {
      isValid: false,
      error: "Entity name is required"
    };
  }

  if (!city || !city.trim()) {
    return {
      isValid: false,
      error: "City is required"
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: "Entity name must be at least 2 characters long"
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


function extractAndValidateEditFormData() {
  const nameElement = document.getElementById("entity-name");
  const descElement = document.getElementById("entity-description");
  const cityElement = document.getElementById("entity-city");

  if (!nameElement || !descElement || !cityElement) {
    return {
      isValid: false,
      error: "Form elements not found. Please try again.",
      formData: null
    };
  }

  const formData = {
    name: nameElement.value.trim(),
    description: descElement.value.trim(),
    city: cityElement.value.trim()
  };

  const validation = validateEntityEditForm(formData);
  
  return {
    isValid: validation.isValid,
    error: validation.error,
    formData: formData
  };
}

window.validateEntityEditForm = validateEntityEditForm;
window.extractAndValidateEditFormData = extractAndValidateEditFormData;
