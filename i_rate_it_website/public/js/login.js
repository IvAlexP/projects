document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
    },
    password: {
      input: document.getElementById("password"),
      error: document.getElementById("password-error"),
    },
  };

  const loginForm = document.getElementById("form-login");

  setupEmailValidation();

  function setupEmailValidation() {
    if (elements.email.input) {
      elements.email.input.addEventListener("blur", function () {
        validateEmail(elements.email.input.value.trim());
      });
    }
  }

  function validateEmail(email) {
    if (email === "") {
      updateFieldStatus(elements.email, { success: true });
      return;
    }

    fetch("/IRI_LilKartoffel/api/email-login", {
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
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      email: elements.email.input.value,
      password: elements.password.input.value,
    };

    fetch("/IRI_LilKartoffel/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status == 200) {
          console.log(data);
          if (data.token) {
            JWTManager.saveToken(data.token);
            JWTManager.saveUserData(data.user);
          } else {
            alert("No token received from server.");
            return;
          }

          alert(
            data.message || "Login successful! Redirecting to home page..."
          );
          const redirectUrl = data.redirect || "/IRI_LilKartoffel/";
          console.log("Redirecting to:", redirectUrl);
          window.location.href = redirectUrl;
        } else {
          console.error("Login failed:", data);
          if (data.error) {
            updateFieldStatus(elements.password, {
              error: data.error,
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
