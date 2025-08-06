let userPersonalAddress = null;

async function fetchUserPersonalAddress() {
    const userProfile = await fetchUserProfile();
    return userProfile ? userProfile.address : null;
}

async function displayPersonalAddress() {
    const personalAddressDiv = document.getElementById("personalAddressInfo");

    userPersonalAddress = await fetchUserPersonalAddress();
    if (userPersonalAddress && userPersonalAddress.latitude && userPersonalAddress.longitude) {
        personalAddressDiv.innerHTML = `
            <div class="current-address">                
                📍 Latitude: ${userPersonalAddress.latitude}<br>
                📍 Longitude: ${userPersonalAddress.longitude}
            </div>
        `;
    } else {
        personalAddressDiv.innerHTML = `
                <div style="color: #dc3545;">
                    ⚠️ You do not have an address in your profile.<br>
                    You need to type an address for the order.
                </div>
            `;
        document.getElementById("useCustomAddress").checked = true;
        document.getElementById("usePersonalAddress").disabled = true;
        toggleAddressInputs();
    }
}

function toggleAddressInputs() {
    const isCustomSelected = document.getElementById("useCustomAddress").checked;
    const customInputs = document.getElementById("customAddressInputs");

    if (isCustomSelected) {
        customInputs.classList.add("active");
    } else {
        customInputs.classList.remove("active");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    displayPersonalAddress();

    document.querySelectorAll('input[name="addressChoice"]').forEach(radio => {
        radio.addEventListener("change", toggleAddressInputs);
    });

    document.getElementById("newOrderForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const errorEl = document.getElementById("newOrderError");
        const submitBtn = document.getElementById("submitBtn");

        errorEl.style.display = "none";
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        const description = document.getElementById("description").value.trim();
        if (description.length === 0) {
            showError("Description cannot be empty.");
            return;
        }

        let payload = {
            description: description
        };

        const addressChoice = document.querySelector('input[name="addressChoice"]:checked').value;

        if (addressChoice === "custom") {
            const lat = parseFloat(document.getElementById("latitude").value);
            const lng = parseFloat(document.getElementById("longitude").value);

            if (isNaN(lat) || isNaN(lng)) {
                showError("Invalid input of coordinates.");
                return;
            }

            payload.latitude = lat;
            payload.longitude = lng;
        } else {
            let user = await fetchUserProfile();
            payload.latitude = user.address.latitude;
            payload.longitude = user.address.longitude;
        }

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    logoutUser();
                    return;
                }

                let errMsg = "Error at sending the order.";
                try {
                    const errData = await response.json();
                    if (errData && errData.message) {
                        errMsg = errData.message;
                    }
                } catch (e) {
                    errMsg = `Error ${response.status}: ${response.statusText}`;
                }

                showError(errMsg);
                return;
            }

            window.location.href = "/orders.html";

        } catch (e) {
            console.error("Connection error:", e);
            showError("Server connection error. Try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send order";
        }
    });
});

function showError(message) {
    const errorEl = document.getElementById("newOrderError");
    errorEl.textContent = message;
    errorEl.style.display = "block";
    errorEl.scrollIntoView({behavior: "smooth", block: "center"});
}