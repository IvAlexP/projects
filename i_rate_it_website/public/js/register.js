document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
    },
    password: {
      input: document.getElementById("password"),
      error: document.getElementById("password-error"),
    },    confirmPassword: {
      input: document.getElementById("confirm_password"),
      error: document.getElementById("confirm_password-error"),
    },    city: {
      input: document.getElementById("city"),
      error: document.getElementById("city-error"),
    },
    firstName: {
      input: document.getElementById("first_name"),
      error: document.getElementById("first_name-error"),
    },
    lastName: {
      input: document.getElementById("last_name"),
      error: document.getElementById("last_name-error"),
    },
  };

  initializeValidation();

  setupFormSubmission();  function initializeValidation() {
    setupEmailValidation();
    setupPasswordValidation();
    setupConfirmPasswordValidation();
    setupCityValidation();
    setupFirstNameValidation();
    setupLastNameValidation();
  }

  function setupEmailValidation() {
    if (elements.email.input) {
      elements.email.input.addEventListener("blur", function () {
        validateEmail(elements.email.input.value.trim());
      });
    }
  }

  function validateEmail(email) {
    fetch("/IRI_LilKartoffel/api/email-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateFieldStatus(elements.email, data);
      })
      .catch((error) => {
        console.error("Error checking email:", error);
      });
  }

  function setupPasswordValidation() {
    if (elements.password.input) {
      elements.password.input.addEventListener("blur", function () {
        validatePassword(elements.password.input.value.trim());
      });
    }
  }

  function validatePassword(password) {
    fetch("/IRI_LilKartoffel/api/password-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateFieldStatus(elements.password, data);
      })
      .catch((error) => {
        console.error("Error validating password:", error);
      });
  }

  function setupConfirmPasswordValidation() {
    if (elements.confirmPassword.input && elements.password.input) {
      elements.confirmPassword.input.addEventListener("blur", function () {
        validateConfirmPassword();
      });
    }
  }

  function validateConfirmPassword() {
    const password = elements.password.input.value.trim();
    const confirmPassword = elements.confirmPassword.input.value.trim();

    if (password !== confirmPassword) {
      elements.confirmPassword.error.textContent = "Passwords do not match";
      elements.confirmPassword.error.classList.add("visible");
      elements.confirmPassword.input.style.border = "1px solid red";
    } else {
      elements.confirmPassword.error.textContent = "";
      elements.confirmPassword.error.classList.remove("visible");
      elements.confirmPassword.input.style.border = "1px solid #ccc";
    }
  }  function setupCityValidation() {
    if (elements.city.input) {
      elements.city.input.addEventListener("blur", function () {
        validateCity(elements.city.input.value.trim());
      });
    }
  }

  function validateCity(city) {
    fetch("/IRI_LilKartoffel/api/city-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateFieldStatus(elements.city, data);
      })
      .catch((error) => {
        console.error("Error validating city:", error);
      });
  }

  function setupFirstNameValidation() {
    if (elements.firstName.input) {
      elements.firstName.input.addEventListener("blur", function () {
        validateFirstName(elements.firstName.input.value.trim());
      });
    }
  }

  function validateFirstName(firstName) {
    fetch("/IRI_LilKartoffel/api/first-name-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: firstName }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateFieldStatus(elements.firstName, data);
      })
      .catch((error) => {
        console.error("Error validating first name:", error);
      });
  }
  function setupLastNameValidation() {
    if (elements.lastName.input) {
      elements.lastName.input.addEventListener("blur", function () {
        validateLastName(elements.lastName.input.value.trim());
      });
    }
  }

  function validateLastName(lastName) {
    fetch("/IRI_LilKartoffel/api/last-name-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ last_name: lastName }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateFieldStatus(elements.lastName, data);
      })
      .catch((error) => {
        console.error("Error validating last name:", error);
      });
  }

  function setupCityValidation() {
    if (elements.city.input) {
      elements.city.input.addEventListener("blur", function () {
        validateCity(elements.city.input.value.trim());
      });
    }
  }
  function validateCity(city) {
    fetch("/IRI_LilKartoffel/api/city-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateFieldStatus(elements.city, data);
      })
      .catch((error) => {
        console.error("Error validating city:", error);
      });
  }

  function updateFieldStatus(field, data) {
    if (data.error) {
      field.error.textContent = data.error;
      field.error.classList.add("visible");
      field.input.style.border = "1px solid red";
    } else {
      field.error.textContent = "";
      field.error.classList.remove("visible");
      field.input.style.border = "1px solid #ccc";
    }
  }
  function setupFormSubmission() {
    const form = document.getElementById("form-register");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();      const payload = {
        first_name: elements.firstName.input.value.trim(),
        last_name: elements.lastName.input.value.trim(),
        city: elements.city.input.value.trim(),
        email: elements.email.input.value.trim(),
        password: elements.password.input.value.trim(),
        confirm_password: elements.confirmPassword.input.value.trim(),
      };
      fetch("/IRI_LilKartoffel/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            alert(
              data.message || "Register successful! Please log in to continue."
            );
            const redirectUrl = data.redirect || "/IRI_LilKartoffel/login";
            window.location.href = redirectUrl;
          } else if (data.errors) {
            Object.keys(data.errors).forEach((key) => {
              const field = elements[key];
              if (field) {
                field.error.textContent = data.errors[key];
                field.error.classList.add("visible");
                field.input.style.border = "1px solid red";
              }
            });
          } else if (data.error) {
            alert(data.error);
          }
        })
        .catch((error) => {
          alert("Server error during registration. Please try again later.");
          console.error("Registration error:", error);
        });
    });
  }
});
