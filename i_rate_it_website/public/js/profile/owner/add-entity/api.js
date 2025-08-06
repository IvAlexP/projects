function createNewCategory(categoryName, traits) {
  const categoryData = {
    name: categoryName,
    traits: traits,
  };

  const headers = window.JWTManager.getAuthHeaders();
  headers["Content-Type"] = "application/json";

  return fetch("/IRI_LilKartoffel/api/categories", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(categoryData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.category_id) {
        return data;
      } else {
        throw new Error(data.error || "Failed to create category");
      }
    });
}

function createNewEntity(entityData, pictureFile = null) {
  const formData = new FormData();
  formData.append("name", entityData.name);
  formData.append("description", entityData.description);
  formData.append("city", entityData.city);
  formData.append("category_id", entityData.categoryId);

  if (pictureFile) {
    formData.append("picture", pictureFile);
  }

  const headers = window.JWTManager.getAuthHeaders();
  delete headers["Content-Type"]; 

  return fetch("/IRI_LilKartoffel/api/entities", {
    method: "POST",
    headers: headers,
    body: formData,
  })
    .then((res) => {
      return res.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          throw new Error("Invalid JSON response: " + text);
        }
      });
    })
    .then((data) => {
      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || "Failed to create entity");
      }
    });
}


function loadCategories() {
  return fetch("/IRI_LilKartoffel/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === 200 && data.categories && Array.isArray(data.categories)) {
        return data.categories;
      } 
      else if (Array.isArray(data.categories)) {
        return data.categories;
      }
      else if (Array.isArray(data)) {
        return data;
      }
      else {
        console.error("Invalid categories response format:", data);
        throw new Error("Invalid categories response format");
      }
    });
}

function createEntityWithNewCategory(entityData, categoryName, traits, pictureFile = null) {
  return createNewCategory(categoryName, traits)
    .then((categoryResult) => {
      const entityDataWithCategory = {
        ...entityData,
        categoryId: categoryResult.category_id
      };
      return createNewEntity(entityDataWithCategory, pictureFile);
    });
}

window.createNewCategory = createNewCategory;
window.createNewEntity = createNewEntity;
window.loadCategories = loadCategories;
window.createEntityWithNewCategory = createEntityWithNewCategory;
