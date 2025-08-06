function createMyEntitiesContainer() {
  if (document.getElementById("my-entities-container")) {
    return; 
  }
  const container = document.createElement("div");
  container.id = "my-entities-container";
  container.className = "shared-entities-container";
  
  const containerHeader = document.createElement("div");
  containerHeader.className = "shared-entities-header";
  
  const headerTitle = document.createElement("h3");
  headerTitle.textContent = "My Entities";
  
  const closeButton = document.createElement("span");
  closeButton.id = "close-my-entities";
  closeButton.className = "close";
  closeButton.textContent = "X";
  containerHeader.appendChild(headerTitle);
  containerHeader.appendChild(closeButton);
  
  const entitiesList = document.createElement("div");
  entitiesList.id = "my-entities-list";
  entitiesList.className = "shared-entities-list";
  
  const comment = document.createComment(
    " Lista entităților va fi populată prin JavaScript "
  );
  entitiesList.appendChild(comment);
  
  container.appendChild(containerHeader);
  container.appendChild(entitiesList);
  
  document.body.appendChild(container);
  
  document
    .getElementById("close-my-entities")
    .addEventListener("click", hideMyEntities);
  
    container.addEventListener("click", (e) => {
    if (e.target.id === "my-entities-container") {
      hideMyEntities();
    }
  });
}

function hideMyEntities() {
  const myEntitiesContainer = document.getElementById("my-entities-container");
  
  if (myEntitiesContainer) {
    myEntitiesContainer.style.display = "none";
  }
}

function loadMyEntities() {
  const myEntitiesList = document.getElementById("my-entities-list");
  if (!myEntitiesList) {
    console.log("My entities list container not found, skipping load");
    return;
  }
  
  while (myEntitiesList.firstChild) {
    myEntitiesList.removeChild(myEntitiesList.firstChild);
  }
  
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "shared-loading";
  loadingDiv.textContent = "Loading entities...";
  myEntitiesList.appendChild(loadingDiv);
  fetch("/IRI_LilKartoffel/api/my-entities", {
    headers: JWTManager.getAuthHeaders(),
  })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text().then((text) => {
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error("Invalid JSON response:", text);
            throw new Error("Server returned invalid JSON response");
          }
        });
      })
      .then((data) => {
        if (data.success) {
          displayMyEntities(data.entities);
        } else {
          console.error(`Failed to load entities: ${data.error}`);
          showLoadingError(`Failed to load entities: ${data.error}`);
        }
      })
      .catch((err) => {
        console.error("Error loading entities:", err);
        showLoadingError("Error loading entities. Please try again later.");
      });
}

function showLoadingError(message) {
  const container = document.getElementById("my-entities-list");
  
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  const errorDiv = document.createElement("div");
  errorDiv.className = "no-shared-entities";
  errorDiv.textContent = message;
  container.appendChild(errorDiv);
}

function displayMyEntities(entities) {
  const container = document.getElementById("my-entities-list");
  
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (!entities || entities.length === 0) {
    const noEntitiesDiv = document.createElement("div");
    noEntitiesDiv.className = "no-shared-entities";
    noEntitiesDiv.textContent = "You don't have any entities yet.";
    container.appendChild(noEntitiesDiv);
  }
  else {
    const sortedEntities = entities.sort(
      (a, b) => parseInt(a.id) - parseInt(b.id)
    );
    sortedEntities.forEach((entity) => {
      const entityElement = createEntityElement(entity);
      container.appendChild(entityElement);
    });
    setupEntityInteractions(sortedEntities);
  }
}

function setupEntityInteractions(entities) {
  entities.forEach((entity) => {
    document
      .getElementById(`entity-item-${entity.id}`)
      .addEventListener("click", (e) => {
        if (!e.target.closest(".entity-actions")) {
          if (entity.status === 'approved') {
            window.location.href = `/IRI_LilKartoffel/entity/${entity.id}`;
          }
        }
      });

    document
      .getElementById(`delete-entity-${entity.id}`)
      .addEventListener("click", (e) => {
        e.stopPropagation(); 
        deleteEntity(entity);
      });

    document
      .getElementById(`edit-entity-${entity.id}`)
      .addEventListener("click", (e) => {
        e.stopPropagation(); 
        createEntityEditModal();
        openEntityEditModal(entity);
      });
  });
}

function createEntityElement(entity) {
  const entityItem = document.createElement("div");
  entityItem.className = "shared-entity-item";
  entityItem.id = `entity-item-${entity.id}`;
  entityItem.setAttribute("data-status", entity.status || "unknown");

  // Header info (image, main info, actions)
  const entityHeader = document.createElement("div");
  entityHeader.className = "shared-entity-basic-info";

  // Image
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "shared-entity-image-wrapper";
  const imageDiv = document.createElement("img");
  imageDiv.className = "shared-entity-image";
  let imageUrl = null;
  if (entity.picture) {
    if (entity.picture.startsWith("/assets/entities/")) {
      imageUrl = `/IRI_LilKartoffel/public${entity.picture}`;
    } else if (entity.picture.startsWith("assets/entities/")) {
      imageUrl = `/IRI_LilKartoffel/public/${entity.picture}`;
    } else {
      imageUrl = `/IRI_LilKartoffel/public/assets/entities/${entity.picture}`;
    }
    imageDiv.src = imageUrl;
    imageDiv.alt = entity.name;
    imageDiv.onerror = function () {
      this.style.display = "none";
    };
    imageWrapper.appendChild(imageDiv);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "entity-image-placeholder";
    placeholder.textContent = "No Image";
    imageWrapper.appendChild(placeholder);
  }

  // Main info
  const mainInfoWrapper = document.createElement("div");
  mainInfoWrapper.className = "shared-entity-main-info";
  const entityName = document.createElement("div");
  entityName.className = "shared-entity-name";
  entityName.textContent = entity.name;
  mainInfoWrapper.appendChild(entityName);

  // Details
  const entityDetails = document.createElement("div");
  entityDetails.className = "shared-entity-details";

  if (entity.category_name) {
    const categoryDetail = document.createElement("div");
    categoryDetail.className = "shared-entity-detail";
    const categoryLabel = document.createElement("span");
    categoryLabel.className = "shared-entity-detail-label";
    categoryLabel.textContent = "Category:";
    const categoryValue = document.createElement("span");
    categoryValue.className = "shared-entity-detail-value";
    categoryValue.textContent = entity.category_name;
    categoryDetail.appendChild(categoryLabel);
    categoryDetail.appendChild(categoryValue);
    entityDetails.appendChild(categoryDetail);
  }
  if (entity.city) {
    const cityDetail = document.createElement("div");
    cityDetail.className = "shared-entity-detail";
    const cityLabel = document.createElement("span");
    cityLabel.className = "shared-entity-detail-label";
    cityLabel.textContent = "City:";
    const cityValue = document.createElement("span");
    cityValue.className = "shared-entity-detail-value";
    cityValue.textContent = entity.city;
    cityDetail.appendChild(cityLabel);
    cityDetail.appendChild(cityValue);
    entityDetails.appendChild(cityDetail);
  }
  // Status in place of owner
  if (entity.status) {
    const statusDetail = document.createElement("div");
    statusDetail.className = "shared-entity-detail";
    const statusLabel = document.createElement("span");
    statusLabel.className = "shared-entity-detail-label";
    statusLabel.textContent = "Status:";
    const statusValue = document.createElement("span");
    statusValue.className = "shared-entity-detail-value";
    statusValue.textContent = entity.status.charAt(0).toUpperCase() + entity.status.slice(1);
    statusDetail.appendChild(statusLabel);
    statusDetail.appendChild(statusValue);
    entityDetails.appendChild(statusDetail);
  }
  mainInfoWrapper.appendChild(entityDetails);

  // Actions (edit/delete)
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "shared-entity-actions";
  const deleteBtn = document.createElement("button");
  deleteBtn.id = `delete-entity-${entity.id}`;
  deleteBtn.className = "button-full";
  deleteBtn.textContent = "Delete";
  actionsDiv.appendChild(deleteBtn);
  const editBtn = document.createElement("button");
  editBtn.id = `edit-entity-${entity.id}`;
  editBtn.className = "button-border";
  editBtn.textContent = "Edit";
  actionsDiv.appendChild(editBtn);

  entityHeader.appendChild(imageWrapper);
  entityHeader.appendChild(mainInfoWrapper);
  entityHeader.appendChild(actionsDiv);

  // Description
  const entityInfo = document.createElement("div");
  entityInfo.className = "shared-entity-description";
  entityInfo.textContent = entity.description || "No description available";

  entityItem.appendChild(entityHeader);
  entityItem.appendChild(entityInfo);
  return entityItem;
}

function deleteEntity(entity) {
  if (
    !confirm(
      `Are you sure you want to delete "${entity.name}"? This will also delete all reviews and the entity image. This action cannot be undone.`
    )
  ) {
    return;
  }
  const deleteBtn = document.getElementById(`delete-entity-${entity.id}`);
  const originalText = deleteBtn.textContent;
  deleteBtn.textContent = "Deleting...";
  deleteBtn.disabled = true;
  fetch(`/IRI_LilKartoffel/api/entities/${entity.id}`, {
    method: "DELETE",
    headers: JWTManager.getAuthHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        const entityItem = document.getElementById(`entity-item-${entity.id}`);
        if (entityItem) {
          entityItem.remove();
        }
        const entitiesList = document.getElementById("my-entities-list");
        const remainingEntities =
          entitiesList.querySelectorAll(".my-entity-item");
        if (remainingEntities.length === 0) {
          const noEntitiesDiv = document.createElement("div");
          noEntitiesDiv.className = "no-entities";
          noEntitiesDiv.textContent = "You don't have any entities yet.";
          entitiesList.appendChild(noEntitiesDiv);
        }
      } else {
        throw new Error(data.error || "Failed to delete entity");
      }
    })
    .catch((error) => {
      console.error("Error deleting entity:", error);
      alert(`Failed to delete entity: ${error.message}`);
      deleteBtn.textContent = originalText;
      deleteBtn.disabled = false;
    });
}

function showMyEntities() {
  closeAllRoleSections();
  createMyEntitiesContainer();
  const myEntitiesContainer = document.getElementById("my-entities-container");
  myEntitiesContainer.style.display = "block";
  loadMyEntities();
  setTimeout(() => {
    myEntitiesContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

window.showMyEntities = showMyEntities;
window.createMyEntitiesContainer = createMyEntitiesContainer;
window.hideMyEntities = hideMyEntities;
window.displayMyEntities = displayMyEntities;
window.loadMyEntities = loadMyEntities;
window.deleteEntity = deleteEntity;
