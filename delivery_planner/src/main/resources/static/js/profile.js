document.addEventListener("DOMContentLoaded", async () => {
    const adminItems = document.querySelectorAll('.admin-only');
    if (isAdmin()) {
        adminItems.forEach(el => {
            el.style.display = 'inline-block';
        });
    } else {
        adminItems.forEach(el => {
            el.style.display = 'none';
        });
    }

    const errorEl = document.getElementById("addressError");
    const successEl = document.getElementById("addressSuccess");

    const profile = await fetchUserProfile();
    if (!profile) {
        window.location.href = "/login.html";
        return;
    }

    document.getElementById("userId").textContent = profile.id;
    document.getElementById("username").textContent = profile.username;
    document.getElementById("roles").textContent = profile.roles.join(", ");

    if (profile.address) {
        document.getElementById("latitude").value = profile.address.latitude;
        document.getElementById("longitude").value = profile.address.longitude;
    }

    const addressForm = document.getElementById("addressForm");
    if (!addressForm) {
        return;
    }

    addressForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (errorEl) {
            errorEl.textContent = "";
        }
        if (successEl) {
            successEl.textContent = "";
        }
        const latInput = document.getElementById("latitude").value;
        const lonInput = document.getElementById("longitude").value;
        const latitude = parseFloat(latInput);
        const longitude = parseFloat(lonInput);

        if (isNaN(latitude) || isNaN(longitude)) {
            alert("Please enter valid numbers for latitude and longitude.");
            return;
        }
        try {
            const response = await fetch("/api/users/me/address", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getToken(),
                },
                body: JSON.stringify({latitude, longitude}),
            });

            if (response.ok) {
                const addressDto = await response.json();
                const msg = `Address saved successfully!\n`;
                alert(msg);

                if (successEl) {
                    successEl.textContent =
                        `Address saved: ID=${addressDto.id}, ` +
                        `Lat=${addressDto.latitude}, Lon=${addressDto.longitude}.`;
                }
            } else {
                const data = await response.json();
                if (data.status === 401 || data.status === 403) {
                    localStorage.removeItem("jwtToken");
                    window.location.href = "/login.html";
                    return;
                }
                alert(data.message);
            }

        } catch (err) {
            console.error("Error saving address:", err);
            const connErr = "Error connecting to server.";
            alert(connErr);
            if (errorEl) {
                errorEl.textContent = connErr;
            }
        }
    });
});
