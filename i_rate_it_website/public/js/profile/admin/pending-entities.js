function showPendingEntities() {
  closeAllRoleSections();

  createPendingEntitiesContainer();
  const pendingEntitiesContainer = document.getElementById(
    "pending-entities-container"
  );
  pendingEntitiesContainer.style.display = "block";
  loadPendingEntities();

  setTimeout(() => {
    pendingEntitiesContainer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

function createPendingEntitiesContainer() {
  if (document.getElementById("pending-entities-container")) {
    return; 
  }

  const container = document.createElement("div");
  container.id = "pending-entities-container";
  container.className = "shared-entities-container";

  const containerHeader = document.createElement("div");
  containerHeader.className = "shared-entities-header";

  const headerTitle = document.createElement("h3");
  headerTitle.textContent = "Pending Entity Requests";

  const closeButton = document.createElement("button");
  closeButton.id = "close-pending-entities";
  closeButton.className = "close";
  closeButton.textContent = "X";

  containerHeader.appendChild(headerTitle);
  containerHeader.appendChild(closeButton);

  const entitiesList = document.createElement("div");
  entitiesList.id = "pending-entities-list";
  entitiesList.className = "shared-entities-list";

  const comment = document.createComment(
    " Lista entităților în așteptare va fi populată prin JavaScript "
  );
  entitiesList.appendChild(comment);

  container.appendChild(containerHeader);
  container.appendChild(entitiesList);

  document.body.appendChild(container);

  document
    .getElementById("close-pending-entities")
    .addEventListener("click", () => {
      document.getElementById("pending-entities-container").style.display =
        "none";
    });
}

function loadPendingEntities() {
  const pendingEntitiesList = document.getElementById("pending-entities-list");
  while (pendingEntitiesList.firstChild) {
    pendingEntitiesList.removeChild(pendingEntitiesList.firstChild);
  }

  if (!JWTManager.isAuthenticated()) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "no-shared-entities";
    errorDiv.textContent = "Please log in to view pending entities.";
    pendingEntitiesList.appendChild(errorDiv);
    return;
  } 
  const userData = JWTManager.getUserData();  console.log("DEBUG: Full userData from cookies:", userData);

  if (!userData) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "no-shared-entities";
    errorDiv.textContent = "User data not found. Please log in again.";
    pendingEntitiesList.appendChild(errorDiv);
    return;
  }

  if (userData.role_name !== "admin") {
    const errorDiv = document.createElement("div");
    errorDiv.className = "no-shared-entities";
    errorDiv.textContent = `Admin access required. Current role: ${
      userData.role_name || "unknown"
    }`;
    pendingEntitiesList.appendChild(errorDiv);
    return;
  }

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "shared-loading";
  loadingDiv.textContent = "Loading pending entity requests...";
  pendingEntitiesList.appendChild(loadingDiv);

  console.log("JWT Token:", JWTManager.getToken());
  console.log("Auth Headers:", JWTManager.getAuthHeaders());

  fetch("/IRI_LilKartoffel/api/pending-entities", {
    headers: JWTManager.getAuthHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.success && data.pendingEntities) {
        displayPendingEntities(data.pendingEntities);
      } else {
        while (pendingEntitiesList.firstChild) {
          pendingEntitiesList.removeChild(pendingEntitiesList.firstChild);
        }
        const noPendingDiv = document.createElement("div");
        noPendingDiv.className = "no-shared-entities";
        noPendingDiv.textContent = "No pending entity requests found.";
        pendingEntitiesList.appendChild(noPendingDiv);
      }
    })
    .catch((err) => {
      console.error("Error loading pending entities:", err);
      while (pendingEntitiesList.firstChild) {
        pendingEntitiesList.removeChild(pendingEntitiesList.firstChild);
      }
      const errorDiv = document.createElement("div");
      errorDiv.className = "no-shared-entities";

      if (err.message.includes("401")) {
        errorDiv.textContent = "Authentication required. Please log in.";
      } else if (err.message.includes("403")) {
        errorDiv.textContent = "Admin access required.";
      } else {
        errorDiv.textContent =
          "Error loading pending entities. Please try again.";
      }

      pendingEntitiesList.appendChild(errorDiv);
    });
}

function displayPendingEntities(entities) {
  const pendingEntitiesList = document.getElementById("pending-entities-list");

  while (pendingEntitiesList.firstChild) {
    pendingEntitiesList.removeChild(pendingEntitiesList.firstChild);
  }

  if (entities.length === 0) {
    const noPendingDiv = document.createElement("div");
    noPendingDiv.className = "no-shared-entities";
    noPendingDiv.textContent = "No pending entity requests found.";
    pendingEntitiesList.appendChild(noPendingDiv);
    return;
  }
  entities.forEach((entity) => {
    const entityItem = document.createElement("div");
    entityItem.className = "shared-entity-item";

    const entityHeader = document.createElement("div");
    entityHeader.className = "shared-entity-basic-info";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "shared-entity-image-wrapper";
    const entityImage = document.createElement("img");
    entityImage.className = "shared-entity-image";
    entityImage.src = "/IRI_LilKartoffel/public" + entity.picture;
    entityImage.alt = entity.name;
    imageWrapper.appendChild(entityImage);

    const mainInfoWrapper = document.createElement("div");
    mainInfoWrapper.className = "shared-entity-main-info";
    const entityName = document.createElement("h4");
    entityName.className = "shared-entity-name";
    entityName.textContent = entity.name;

    const entityDetails = document.createElement("div");
    entityDetails.className = "shared-entity-details";

    const categoryDetail = document.createElement("div");
    categoryDetail.className = "shared-entity-detail";
    const categoryLabel = document.createElement("span");
    categoryLabel.className = "shared-entity-detail-label";
    categoryLabel.textContent = "Category:";
    const categoryValue = document.createElement("span");
    categoryValue.className = "shared-entity-detail-value";
    categoryValue.textContent = entity.category_name || "Unknown Category";
    categoryDetail.appendChild(categoryLabel);
    categoryDetail.appendChild(categoryValue);

    const ownerDetail = document.createElement("div");
    ownerDetail.className = "shared-entity-detail";
    const ownerLabel = document.createElement("span");
    ownerLabel.className = "shared-entity-detail-label";
    ownerLabel.textContent = "Owner:";
    const ownerValue = document.createElement("span");
    ownerValue.className = "shared-entity-detail-value";
    ownerValue.textContent = entity.owner_name || "Unknown";
    ownerDetail.appendChild(ownerLabel);
    ownerDetail.appendChild(ownerValue);

    const cityDetail = document.createElement("div");
    cityDetail.className = "shared-entity-detail";
    const cityLabel = document.createElement("span");
    cityLabel.className = "shared-entity-detail-label";
    cityLabel.textContent = "City:";
    const cityValue = document.createElement("span");
    cityValue.className = "shared-entity-detail-value";
    cityValue.textContent = entity.city || "Unknown";
    cityDetail.appendChild(cityLabel);
    cityDetail.appendChild(cityValue);

    entityDetails.appendChild(categoryDetail);
    entityDetails.appendChild(ownerDetail);
    entityDetails.appendChild(cityDetail);

    mainInfoWrapper.appendChild(entityName);
    mainInfoWrapper.appendChild(entityDetails);

    const entityActions = document.createElement("div");
    entityActions.className = "shared-entity-actions";

    const approveBtn = document.createElement("button");
    approveBtn.className = "button-full pending-approve-btn";
    approveBtn.textContent = "Approve";
    approveBtn.addEventListener("click", () => {
      processEntityStatus(entity.id, "approved");
    });

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "button-border pending-reject-btn";
    rejectBtn.textContent = "Reject";
    rejectBtn.addEventListener("click", () => {
      processEntityStatus(entity.id, "rejected");
    });

    entityActions.appendChild(approveBtn);
    entityActions.appendChild(rejectBtn);

    entityHeader.appendChild(imageWrapper);
    entityHeader.appendChild(mainInfoWrapper);
    entityHeader.appendChild(entityActions);

    const entityInfo = document.createElement("div");
    entityInfo.className = "pending-entity-info";

    const entityDescription = document.createElement("div");
    entityDescription.className = "shared-entity-description";
    entityDescription.textContent = entity.description || "No description available";

    entityInfo.appendChild(entityDescription);

    entityItem.appendChild(entityHeader);
    entityItem.appendChild(entityInfo);

    pendingEntitiesList.appendChild(entityItem);
  });
}

function processEntityStatus(entityId, status) {
  const actionText = status === "approved" ? "approve" : "reject";

  if (!JWTManager.isAuthenticated()) {
    alert("Please log in to perform this action.");
    return;
  }

  const userData = JWTManager.getUserData();
  if (!userData || userData.role_name !== "admin") {
    alert("Admin access required to perform this action.");
    return;
  }

  if (!confirm(`Are you sure you want to ${actionText} this entity?`)) {
    return;
  }

  console.log("Processing entity status with token:", JWTManager.getToken());

  fetch("/IRI_LilKartoffel/api/update-entity-status", {
    method: "POST",
    headers: {
      ...JWTManager.getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entity_id: entityId,
      status: status,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        alert(`Entity ${status} successfully!`);
        loadPendingEntities(); // Reload the list
      } else {
        alert(`Error: ${data.message}`);
      }
    })
    .catch((err) => {
      console.error(`Error ${actionText}ing entity:`, err);
      if (err.message.includes("401")) {
        alert("Authentication required. Please log in.");
      } else if (err.message.includes("403")) {
        alert("Admin access required.");
      } else {
        alert(`Error ${actionText}ing entity. Please try again.`);
      }
    });
}

window.showPendingEntities = showPendingEntities;
window.createPendingEntitiesContainer = createPendingEntitiesContainer;
window.loadPendingEntities = loadPendingEntities;
