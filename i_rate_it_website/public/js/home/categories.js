class CategoriesManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadCategories();
  }

  loadCategories() {
    fetch("/IRI_LilKartoffel/api/categories")
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200 && data.categories) {
          this.renderCategories(data.categories);
        } else {
          console.error("Error: Invalid response structure", data);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }

  renderCategories(categories) {
    const categoriesContainer = document.querySelector(".categories");
    if (!categoriesContainer) return;

    categories.forEach((category) => {
      const categoryDiv = this.createCategoryElement(category);
      categoriesContainer.appendChild(categoryDiv);
    });
  }

  createCategoryElement(category) {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category_item";
    categoryDiv.textContent = category.name;
    
    categoryDiv.addEventListener("click", () => {
      window.location.href = `/IRI_LilKartoffel/entities/${category.id}`;
    });

    return categoryDiv;
  }
}

// Export for use in main file
window.CategoriesManager = CategoriesManager;
