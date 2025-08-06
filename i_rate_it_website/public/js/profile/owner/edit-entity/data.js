function openEntityEditModal(entity) {
  const modal = document.getElementById("entity-edit-modal");
  if (!modal) {
    console.error("Edit modal not found. Make sure createEntityEditModal() is called first.");
    return;
  }
  
  populateEditForm(entity);
  modal.style.display = "block";
}

function populateEditForm(entity) {
  const nameElement = document.getElementById("entity-name");
  const descElement = document.getElementById("entity-description");
  const cityElement = document.getElementById("entity-city");
  
  if (nameElement) nameElement.value = entity.name || "";
  if (descElement) descElement.value = entity.description || "";
  if (cityElement) cityElement.value = entity.city || "";

  populateCategoryDisplay(entity);
  
  showCurrentPicture(entity);
  
  const form = document.getElementById("entity-edit-form");
  if (form) {
    form.dataset.entityId = entity.id;
  }
}


function populateCategoryDisplay(entity) {
  const categoryDisplay = document.getElementById("entity-category-display");
  if (categoryDisplay && entity.category_id) {
    if (entity.category_name) {
      categoryDisplay.textContent = entity.category_name;
    } else {
      loadCategoryName(entity.category_id, categoryDisplay);
    }
  } else if (categoryDisplay) {
    categoryDisplay.textContent = "No category";
  }
}


function loadCategoryName(categoryId, displayElement) {
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
      
      const category = categories.find(cat => cat.id == categoryId);
      const categoryName = category ? category.name : `Category ID: ${categoryId}`;
      displayElement.textContent = categoryName;
    })
    .catch((error) => {
      console.error("Error loading categories:", error);
      displayElement.textContent = `Category ID: ${categoryId}`;
    });
}


function showCurrentPicture(entity) {
  const currentPictureDiv = document.getElementById("current-picture");
  if (!currentPictureDiv) return;
  
  while (currentPictureDiv.firstChild) {
    currentPictureDiv.removeChild(currentPictureDiv.firstChild);
  }

  if (entity.picture) {
    let imageUrl;
    if (entity.picture.startsWith("/assets/entities/")) {
      imageUrl = `/IRI_LilKartoffel/public${entity.picture}`;
    } else if (entity.picture.startsWith("assets/entities/")) {
      imageUrl = `/IRI_LilKartoffel/public/${entity.picture}`;
    } else {
      imageUrl = `/IRI_LilKartoffel/public/assets/entities/${entity.picture}`;
    }

    const currentText = document.createElement("p");
    currentText.textContent = "Current picture:";
    currentPictureDiv.appendChild(currentText);

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = entity.name;
    img.style.maxWidth = "200px";
    img.style.maxHeight = "200px";
    img.onerror = function () {
      console.error("Failed to load image:", imageUrl);
      while (currentPictureDiv.firstChild) {
        currentPictureDiv.removeChild(currentPictureDiv.firstChild);
      }
      const notFoundText = document.createElement("p");
      notFoundText.textContent = "Current picture not found";
      currentPictureDiv.appendChild(notFoundText);
    };
    currentPictureDiv.appendChild(img);
  } else {
    const noPictureText = document.createElement("p");
    noPictureText.textContent = "No current picture";
    currentPictureDiv.appendChild(noPictureText);
  }
}

window.openEntityEditModal = openEntityEditModal;
window.populateEditForm = populateEditForm;
window.populateCategoryDisplay = populateCategoryDisplay;
window.showCurrentPicture = showCurrentPicture;
