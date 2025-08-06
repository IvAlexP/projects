class EntityManager {
  constructor() {
    this.currentEntityId = null;
  }
  async loadEntity(entityId) {
    try {
      const response = await fetch(`/IRI_LilKartoffel/api/entity/${entityId}`);

      if (!response.ok) {
        throw new Error(response.error);
      }

      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();

      if (data.status == 200 && data.entity && data.entity.id) {
        this.currentEntityId = data.entity.id;
        this.displayEntity(data.entity);
        return data.entity;
      } else {
        throw new Error(data.error || "Entity not found");
      }
    } catch (error) {
      console.error("Error fetching entity:", error);
      this.displayError("Failed to load entity. Please try again later.");
      throw error;
    }
  }
  displayEntity(entity) {
    const entityContainer = document.querySelector(".entity");
    if (!entityContainer) return;

    entityContainer.innerHTML = "";    const entityImage = document.createElement("img");
    entityImage.src = `/IRI_LilKartoffel/public/${
      entity.picture || "assets/default.jpg"
    }`;
    entityImage.alt = entity.name || "Entity";
    entityImage.className = "entity_image";
    entityImage.onerror = function () {
      this.src = "/IRI_LilKartoffel/public/assets/logo.png";
    };
    
    // Add click event to open image in modal
    entityImage.addEventListener("click", function () {
      if (window.imageViewer) {
        window.imageViewer.open(entityImage.src);
      }
    });
    
    entityContainer.appendChild(entityImage);

    const entityTextContainer = document.createElement("div");
    entityTextContainer.className = "entity_text";

    const entityName = document.createElement("h3");
    entityName.textContent = entity.name || "Unnamed Entity";
    entityName.className = "entity_name";
    entityTextContainer.appendChild(entityName);

    if (entity.owner_name) {
      const ownerDiv = document.createElement("div");
      ownerDiv.className = "entity-owner";
      const labelSpan = document.createElement("span");
      labelSpan.className = "owner-label";
      const nameSpan = document.createElement("span");
      nameSpan.className = "owner-name";
      nameSpan.textContent = `Owned by: ${entity.owner_name}`;
      ownerDiv.appendChild(labelSpan);
      ownerDiv.appendChild(nameSpan);
      entityTextContainer.appendChild(ownerDiv);
    }

    const entityDescription = document.createElement("p");
    const description = entity.description || "";
    entityDescription.textContent = description ? description : "";
    entityDescription.className = "entity_description";
    entityDescription.style.whiteSpace = "pre-line";
    entityTextContainer.appendChild(entityDescription);

    if (entity.traits && entity.traits.length > 0) {
      const traitsContainer = document.createElement("div");
      traitsContainer.className = "entity_traits";

      const traitsTitle = document.createElement("h4");
      traitsTitle.textContent = "Average Ratings";
      traitsTitle.className = "traits_title";
      traitsContainer.appendChild(traitsTitle);

      entity.traits.forEach((trait) => {
        const traitDiv = document.createElement("div");
        traitDiv.className = "trait_item";

        const traitName = document.createElement("span");
        traitName.textContent = trait.name;
        traitName.className = "trait_name";

        const traitRating = document.createElement("span");
        traitRating.textContent =
          trait.averageRating > 0
            ? trait.averageRating.toFixed(1) + "/5"
            : "No ratings";
        traitRating.className = "trait_rating";

        const starsContainer = document.createElement("span");
        starsContainer.className = "trait_stars";
        const rating = parseFloat(trait.averageRating);
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement("span");
          star.innerHTML = "&#9733;";
          star.className = i <= rating ? "star filled" : "star empty";
          starsContainer.appendChild(star);
        }

        traitDiv.appendChild(traitName);
        traitDiv.appendChild(traitRating);
        traitDiv.appendChild(starsContainer);
        traitsContainer.appendChild(traitDiv);
      });

      entityTextContainer.appendChild(traitsContainer);
    }

    entityContainer.appendChild(entityTextContainer);
  }
  displayError(message) {
    const entityContainer = document.querySelector(".entity");
    if (entityContainer) {
      entityContainer.textContent = "";
      const errorP = document.createElement("p");
      errorP.className = "error";
      errorP.textContent = message;
      entityContainer.appendChild(errorP);
    }
  }

  getCurrentEntityId() {
    return this.currentEntityId;
  }
}

window.EntityManager = EntityManager;
