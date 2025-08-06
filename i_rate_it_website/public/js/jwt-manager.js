class JWTManager {
  static TOKEN_KEY = "jwt_token";
  static USER_KEY = "user_data";

  static saveToken(token) {
    console.log("Saving token in secure cookie");
    CookieManager.setJWTCookie(token, 1);
  }

  static getToken() {
    return CookieManager.getCookie(this.TOKEN_KEY);
  }

  static removeToken() {
    CookieManager.deleteCookie(this.TOKEN_KEY);
    CookieManager.deleteCookie(this.USER_KEY);
  }

  static saveUserData(userData) {
    CookieManager.setUserDataCookie(userData, 1);
  }

  static getUserData() {
    return CookieManager.getUserDataFromCookie();
  }
  static isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }
  static getAuthHeaders(isFormData = false) {
    const token = this.getToken();
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  static async authenticatedFetch(url, options = {}) {
    const isFormData = options.body instanceof FormData;
    const headers = this.getAuthHeaders(isFormData);

    const config = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.handleTokenExpiration();
        return null;
      }

      return response;
    } catch (error) {
      console.error("Authenticated fetch error:", error);
      throw error;
    }
  }
  static handleTokenExpiration() {
    this.logout();
    alert("Your session has expired. Please log in again.");
    window.location.href = "/IRI_LilKartoffel/login";
  }

  static logout() {
    CookieManager.clearAppCookies();
    console.log("User logged out - cookies cleared");
  }

  static decodeToken(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  static isTokenExpired(token = null) {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;

    const decoded = this.decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }
}

window.JWTManager = JWTManager;
