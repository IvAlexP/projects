class ProfileController {
  constructor() {
    if (!JWTManager.isAuthenticated() || JWTManager.isTokenExpired()) {
      window.location.href = "/IRI_LilKartoffel/login";
      return;
    }
    setupProfileUI();
    loadProfileData();
  }
}

new ProfileController();

window.ProfileController = ProfileController;