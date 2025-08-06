class EntitiesManager {
  constructor() {
    this.allEntities = [];
    this.init();
  }

  init() {
    this.initializeEntitiesControls();
  }
  
  async loadCategory(categoryId) {
    try {
      const response = await fetch(`/IRI_LilKartoffel/api/category/${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status == 200 && data.category) {
        const categoryNameElement = document.getElementsByClassName("category-name")[0];
        if (categoryNameElement) {
          categoryNameElement.textContent = data.category.name;
        }
        return data.category.name;
      }
      return null;
    } catch (error) {
      console.error("Error loading category:", error);
      return null;
    }
  }

  async loadEntities(categoryId) {
    try {
      const response = await fetch(`/IRI_LilKartoffel/api/entities/${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status == 200 && data.entities) {
        this.allEntities = data.entities;
        this.applyFiltersAndSort();
        return data.entities;
      } else {
        this.allEntities = [];
        this.displayFilteredEntities([]);
        return [];
      }
    } catch (error) {
      this.allEntities = [];
      this.displayFilteredEntities([]);
      return [];
    }
  }

  getEntityAvgRating(entity) {
    if (Array.isArray(entity.traits) && entity.traits.length > 0) {
      const sum = entity.traits.reduce((acc, t) => acc + (typeof t.averageRating === 'number' ? t.averageRating : 0), 0);
      return sum / entity.traits.length;
    }
    return 0;
  }

  displayFilteredEntities(entities) {
    const entityContainer = document.querySelector(".entities");
    if (!entityContainer) return;
    entityContainer.innerHTML = "";
    if (!entities || entities.length === 0) {
      const noEntities = document.createElement("p");
      noEntities.textContent = "No entities found.";
      noEntities.className = "no-entities";
      entityContainer.appendChild(noEntities);
    } else {
        entities.forEach((entity) => {
        console.log("Entity:", entity);
        const entityDiv = document.createElement("div");
        entityDiv.className = "entity_item";
        entityDiv.addEventListener("click", function () {
          window.location.href = `/IRI_LilKartoffel/entity/${entity.id}`;
        });
        const entityImage = document.createElement("img");
        entityImage.src = `/IRI_LilKartoffel/public/${entity.picture}`;
        entityImage.alt = entity.name;
        entityImage.className = "entity_image";
        entityDiv.appendChild(entityImage);
        const textWrapper = document.createElement("div");
        textWrapper.className = "entity_text";

        const entityName = document.createElement("h3");
        entityName.textContent = entity.name;
        entityName.className = "entity_name";
        textWrapper.appendChild(entityName);

        if (entity.city) {
          const cityDiv = document.createElement("div");
          cityDiv.className = "entity-city";
          cityDiv.textContent = entity.city;
          textWrapper.appendChild(cityDiv);
        }


        const ratingDiv = document.createElement("div");
        ratingDiv.className = "entity-rating";
        let ratingValue = this.getEntityAvgRating(entity);
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement("span");
          star.innerHTML = "&#9733;";
          star.className = i <= Math.round(ratingValue) ? "star filled" : "star empty";
          ratingDiv.appendChild(star);
        }
        const ratingNum = document.createElement("span");
        ratingNum.className = "entity-rating-value";
        ratingNum.textContent = ` ${ratingValue.toFixed(2)}`;
        ratingDiv.appendChild(ratingNum);
        textWrapper.appendChild(ratingDiv);

        const entityDescription = document.createElement("p");
        entityDescription.textContent = entity.description || "";
        entityDescription.className = "entity_description";
        entityDescription.style.whiteSpace = "pre-line";
        textWrapper.appendChild(entityDescription);
        entityDiv.appendChild(textWrapper);
        entityContainer.appendChild(entityDiv);
      });
    }
  }

  initializeEntitiesControls() {
    const sortBy = document.getElementById("entities-sort-by");
    const cityFilter = document.getElementById("entities-city-filter");
    const searchInput = document.getElementById("entities-search");
    if (sortBy) sortBy.addEventListener("change", () => this.applyFiltersAndSort());
    if (cityFilter) cityFilter.addEventListener("change", () => this.applyFiltersAndSort());
    if (searchInput) searchInput.addEventListener("input", () => this.applyFiltersAndSort());
  }

  applyFiltersAndSort() {
    let filteredEntities = [...this.allEntities];

    const city = document.getElementById("entities-city-filter")?.value;
    if (city && city !== "all") {
      filteredEntities = filteredEntities.filter(e => e.city && e.city.toLowerCase() === city.toLowerCase());
    }

    const searchTerm = document.getElementById("entities-search")?.value.toLowerCase();
    if (searchTerm) {
      filteredEntities = filteredEntities.filter(e => e.name.toLowerCase().includes(searchTerm));
    }


    const sortBy = document.getElementById("entities-sort-by")?.value || "name-asc";
    switch (sortBy) {
      case "name-asc":
        filteredEntities.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredEntities.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating-desc":
        filteredEntities.sort((a, b) => this.getEntityAvgRating(b) - this.getEntityAvgRating(a));
        break;
      case "rating-asc":
        filteredEntities.sort((a, b) => this.getEntityAvgRating(a) - this.getEntityAvgRating(b));
        break;
      default:
        filteredEntities.sort((a, b) => a.name.localeCompare(b.name));
    }
    this.displayFilteredEntities(filteredEntities);
  }
}

window.EntitiesManager = EntitiesManager;
