function loadProfileData() {
  fetch("/IRI_LilKartoffel/api/profile", {
    headers: JWTManager.getAuthHeaders(),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        fillViewMode(data.user);
      } else {
        showError(`Failed to load profile data: ${data.error}`);
      }
    })
    .catch((err) => {
      console.error(err);
      showError("Error loading profile data. Please try again later.");
    });
}

function saveProfileData(updateData) {
  fetch("/IRI_LilKartoffel/api/profile", {
    method: "PUT",
    headers: {
      ...JWTManager.getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        toggleMode("view");

        const successMessage = updateData.role_id
          ? "Profile updated and role change request submitted successfully!"
          : "Profile updated successfully!";

        showSuccessMessage(
          successMessage,
          document.querySelector(".profile-container")
        );

        loadProfileData();

        if (updateData.first_name && window.updateHeaderProfileButton) {
          window.updateHeaderProfileButton();
        }
      } else {
        showError(`Failed to update profile: ${data.error || "Unknown error"}`);
      }
    })
    .catch((err) => {
      console.error(err);
      showError("An error occurred. Please try again.");
    });
}

window.loadProfileData = loadProfileData;
window.saveProfileData = saveProfileData;
