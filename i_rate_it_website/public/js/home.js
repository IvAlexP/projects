class HomeController {
  constructor() {
    this.loadModules();
  }

  async loadModules() {
    try {
      await import('/IRI_LilKartoffel/public/js/home/categories.js');
      await import('/IRI_LilKartoffel/public/js/home/near-you.js');
      await import('/IRI_LilKartoffel/public/js/home/slider.js');
      
      this.initializeModules();
    } catch (error) {
      console.error('Failed to load home modules:', error);
    }
  }

  initializeModules() {
    if (window.CategoriesManager) {
      new window.CategoriesManager();
    }

    if (window.NearYouManager) {
      new window.NearYouManager();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new HomeController();
});
