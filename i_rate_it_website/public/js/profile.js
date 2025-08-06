class ProfileController {
  constructor() {
    this.loadModules();
  }
  async loadModules() {
    try {
      await import('/IRI_LilKartoffel/public/js/profile/admin/admin-reports.js');
      
      await import('/IRI_LilKartoffel/public/js/profile/data/profile-api.js');
      await import('/IRI_LilKartoffel/public/js/profile/data/roles.js');

      await import('/IRI_LilKartoffel/public/js/profile/profile-base.js');
      await import('/IRI_LilKartoffel/public/js/profile/role-sections.js');
     
      await import('/IRI_LilKartoffel/public/js/profile/profile-controller.js');

      await import('/IRI_LilKartoffel/public/js/profile/admin/pending-roles.js');
      await import('/IRI_LilKartoffel/public/js/profile/admin/pending-entities.js');
      await import('/IRI_LilKartoffel/public/js/profile/admin/manage-accounts.js');

      await import('/IRI_LilKartoffel/public/js/profile/admin/statistics/statistics-ui.js');
      await import('/IRI_LilKartoffel/public/js/profile/admin/statistics/statistics-export-handlers.js');
      await import('/IRI_LilKartoffel/public/js/profile/admin/statistics/statistics-data.js');
      await import('/IRI_LilKartoffel/public/js/profile/admin/statistics/statistics-rankings.js');
      await import('/IRI_LilKartoffel/public/js/profile/admin/statistics/statistics-export.js');

      await import('/IRI_LilKartoffel/public/js/profile/owner/my-entities.js');

      await import('/IRI_LilKartoffel/public/js/profile/owner/edit-entity/modal.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/edit-entity/data.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/edit-entity/validation.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/edit-entity/api.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/edit-entity/ui.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/edit-entity/edit-entity.js');
      
      await import('/IRI_LilKartoffel/public/js/profile/owner/add-entity/ui.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/add-entity/validation.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/add-entity/api.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/add-entity/categories.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/add-entity/form.js');
      await import('/IRI_LilKartoffel/public/js/profile/owner/add-entity/add-entity.js');
    } catch (error) {
      console.error('Failed to load profile modules:', error);
    }
  }
}

new ProfileController();
