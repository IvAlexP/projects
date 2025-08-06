class EntityPageController {
  constructor() {
    this.loadModules();
  }
  async loadModules() {
    try {
      // Import all modules from the entity folder
      await import('/IRI_LilKartoffel/public/js/entity/entity-manager.js');
      await import('/IRI_LilKartoffel/public/js/entity/report-alert.js');
      await import('/IRI_LilKartoffel/public/js/entity/review-manager.js');
      await import('/IRI_LilKartoffel/public/js/entity/review-renderer.js');
      await import('/IRI_LilKartoffel/public/js/entity/image-viewer.js');
      await import('/IRI_LilKartoffel/public/js/entity/picture-upload.js');
      await import('/IRI_LilKartoffel/public/js/entity/trait-rating.js');
      await import('/IRI_LilKartoffel/public/js/entity/vote-manager.js');
      await import('/IRI_LilKartoffel/public/js/entity/reply-manager.js');
      await import('/IRI_LilKartoffel/public/js/entity/review-form.js');
      // Import entity-specific controller
      await import('/IRI_LilKartoffel/public/js/entity/entity-controller.js');
      
      this.initializeController();
    } catch (error) {
      console.error('Failed to load entity modules:', error);
    }
  }

  initializeController() {
    if (window.EntityController) {
      const entityController = new window.EntityController();
      
      // Expose getCurrentEntityId globally for backward compatibility
      window.currentEntityId = () => entityController.getCurrentEntityId();
    } else {
      console.error('EntityController not found');
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new EntityPageController();
});
