window.confirmLogout = function () {
  if (confirm("Are you sure you want to log out?")) {
    JWTManager.removeToken();

    window.location.href = "/IRI_LilKartoffel";
  }
};

window.createAuthenticatedButtons = function (
  firstButton,
  secondButton,
  userData = null
) {
  // Clear existing content
  while (firstButton.firstChild) {
    firstButton.removeChild(firstButton.firstChild);
  }
  while (secondButton.firstChild) {
    secondButton.removeChild(secondButton.firstChild);
  }
  const profileBtn = document.createElement("button");
  profileBtn.className = "button-full";
  profileBtn.onclick = () =>
    (window.location.href = "/IRI_LilKartoffel/profile");

  let displayName = "Profile";
  
  if (userData && userData.first_name) {
    displayName = userData.first_name;
  } else {
    const storedUserData = JWTManager.getUserData();
    if (storedUserData && storedUserData.first_name) {
      displayName = storedUserData.first_name;
    }
  }

  if (displayName.length > 8) {
    displayName = displayName.substring(0, 8) + "...";
  }
  
  profileBtn.textContent = displayName;

  firstButton.appendChild(profileBtn);

  const logoutBtn = document.createElement("button");
  logoutBtn.className = "button-border";
  logoutBtn.onclick = confirmLogout;
  logoutBtn.textContent = "Log out";
  secondButton.appendChild(logoutBtn);
};

window.createUnauthenticatedButtons = function (firstButton, secondButton) {
  // Clear existing content
  while (firstButton.firstChild) {
    firstButton.removeChild(firstButton.firstChild);
  }
  while (secondButton.firstChild) {
    secondButton.removeChild(secondButton.firstChild);
  }

  const registerBtn = document.createElement("button");
  registerBtn.className = "button-full";
  registerBtn.onclick = () =>
    (window.location.href = "/IRI_LilKartoffel/register");
  registerBtn.textContent = "Register";
  firstButton.appendChild(registerBtn);

  const loginBtn = document.createElement("button");
  loginBtn.className = "button-border";
  loginBtn.onclick = () => (window.location.href = "/IRI_LilKartoffel/login");
  loginBtn.textContent = "Log in";
  secondButton.appendChild(loginBtn);
};

window.checkAuthStatus = function (firstButton, secondButton) {
  // Clear existing content
  while (firstButton.firstChild) {
    firstButton.removeChild(firstButton.firstChild);
  }
  while (secondButton.firstChild) {
    secondButton.removeChild(secondButton.firstChild);
  }

  fetch("/IRI_LilKartoffel/api/auth-status", {
    headers: JWTManager.getAuthHeaders(),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isAuthenticated) {
        // Fetch user profile data to get the last name and role information
        fetch("/IRI_LilKartoffel/api/profile", {
          headers: JWTManager.getAuthHeaders(),
        })
          .then((response) => response.json())
          .then((profileData) => {
            if (profileData.success && profileData.user) {
              // Save user data in local storage for future use
              JWTManager.saveUserData(profileData.user);
              createAuthenticatedButtons(
                firstButton,
                secondButton,
                profileData.user
              );
            } else {
              createAuthenticatedButtons(firstButton, secondButton);
            }
          })
          .catch((error) => {
            console.error("Error fetching profile data:", error);
            createAuthenticatedButtons(firstButton, secondButton);
          });

        if (data.token) {
          JWTManager.setToken(data.token);
        }      } else {
        createUnauthenticatedButtons(firstButton, secondButton);
        JWTManager.removeToken();
      }
    })    .catch((error) => {
      console.error("Error checking auth status:", error);
      createUnauthenticatedButtons(firstButton, secondButton);
    });
};

// Function to update header profile button
window.updateHeaderProfileButton = function () {
  fetch("/IRI_LilKartoffel/api/profile", {
    headers: JWTManager.getAuthHeaders(),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.user) {
        // Find the profile button and update its text
        const profileBtn = document.querySelector(
          "#auth-register button.button-full"
        );
        if (profileBtn && data.user.first_name) {
          let displayName = data.user.first_name;
          if (displayName.length > 8) {
            displayName = displayName.substring(0, 8) + "...";
          }
          profileBtn.textContent = displayName;
        }
      }
    })
    .catch((error) => {
      console.error("Error updating header profile button:", error);
    });
};

function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    const containerDiv = document.createElement("div");
    containerDiv.className = "container";

    const logoDiv = document.createElement("div");
    const logoLink = document.createElement("a");
    logoLink.href = "/IRI_LilKartoffel";
    const logoImg = document.createElement("img");
    logoImg.src = "/IRI_LilKartoffel/public/assets/logo.png";
    logoImg.className = "logo";
    logoImg.alt = "logo";
    logoLink.appendChild(logoImg);    logoDiv.appendChild(logoLink);

    const emptyDiv = document.createElement("div");

    const firstButton = document.createElement("div");
    firstButton.className = "button-full";
    firstButton.id = "auth-register";

    const secondButton = document.createElement("div");
    secondButton.className = "button-border";
    secondButton.id = "auth-login";    containerDiv.appendChild(logoDiv);
    containerDiv.appendChild(emptyDiv);
    containerDiv.appendChild(firstButton);
    containerDiv.appendChild(secondButton);

    headerContainer.appendChild(containerDiv);

    checkAuthStatus(firstButton, secondButton);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    loadHeader();
  }
});
