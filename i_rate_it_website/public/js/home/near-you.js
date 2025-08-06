class NearYouManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadNearbyEntities();
  }

  loadNearbyEntities() {
    const token = JWTManager.getToken();
    if (!token) {
      return;
    }

    fetch("/IRI_LilKartoffel/api/nearby-entities", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200 && data.entities && data.entities.length > 0) {
          this.renderNearbyEntities(data);
        } else {
          this.hideSection();
        }
      })
      .catch((error) => {
        this.hideSection();
      });
  }

  renderNearbyEntities(data) {
    const nearYouSection = document.getElementById("near-you-section");
    const nearYouContainer = document.querySelector(".near-you-entities");
    const nearYouTitle = document.querySelector(".near-you-title");

    if (!nearYouSection || !nearYouContainer || !nearYouTitle) {
      return;
    }

    // Set title with city
    if (data.city) {
      nearYouTitle.textContent = `Near You in ${data.city}`;
    }

    // Show section
    nearYouSection.style.display = "block";

    // Render entities
    data.entities.forEach((entity) => {
      const entityDiv = this.createEntityElement(entity);
      nearYouContainer.appendChild(entityDiv);
    });

    // Initialize slider after rendering
    setTimeout(() => {
      if (window.NearYouSlider) {
        new window.NearYouSlider();
      }
    }, 100);
  }

  createEntityElement(entity) {
    const entityDiv = document.createElement("div");
    entityDiv.className = "near-you-item";
    entityDiv.setAttribute("data-category", entity.category_name);
    
    entityDiv.addEventListener("click", () => {
      window.location.href = `/IRI_LilKartoffel/entity/${entity.id}`;
    });

    const nameSpan = document.createElement("div");
    nameSpan.className = "entity-name";
    nameSpan.textContent = entity.name;

    const categorySpan = document.createElement("div");
    categorySpan.className = "entity-category";
    categorySpan.textContent = entity.category_name || "Restaurant";

    entityDiv.appendChild(nameSpan);
    entityDiv.appendChild(categorySpan);

    return entityDiv;
  }

  hideSection() {
    const nearYouSection = document.getElementById("near-you-section");
    if (nearYouSection) {
      nearYouSection.style.display = "none";
    }
  }
}

// Export for use in main file
window.NearYouManager = NearYouManager;
