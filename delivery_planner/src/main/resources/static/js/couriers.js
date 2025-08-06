document.addEventListener("DOMContentLoaded", () => {

    loadUnassignedOrdersCount();

    // Show admin-only menu items
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

    const tableBody = document.querySelector("#couriersTable tbody");
    const form = document.getElementById("assign-form");
    const msgContainer = document.getElementById("message-container");

    function showMessage(text, type) {
        msgContainer.innerHTML = "";
        const div = document.createElement("div");
        div.classList.add("message");
        div.classList.add(type === "success" ? "success" : "error");
        div.textContent = text;
        msgContainer.append(div);
        setTimeout(() => {
            msgContainer.innerHTML = "";
        }, 4000);
    }

    function fetchCouriers() {
        fetch("/api/admin/couriers/pending", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error loading data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                tableBody.innerHTML = "";
                data.forEach(courier => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                    <td>${courier.courierId}</td>
                    <td>${courier.courierUsername}</td>
                    <td>${courier.pendingCount}</td>
                `;
                    tableBody.append(row);
                });
            })
            .catch(err => {
                console.error(err);
                showMessage("Could not load courier data.", "error");
            });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const courierId = document.getElementById("courier-id").value;
        const numOrders = document.getElementById("num-orders").value;

        try {
            fetch("/api/admin/couriers/assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                body: JSON.stringify({courierId: parseInt(courierId), numOrders: parseInt(numOrders)})
            })
                .then(async response => {

                    if (response.status === 200) {
                        const successMsg = await response.json();
                        showMessage(successMsg.message, "success");
                        form.reset();
                        fetchCouriers();
                        await loadUnassignedOrdersCount();
                    } else {
                        let errJson = {};
                        try {
                            errJson = await response.json();
                        } catch (e) {
                            alert("Error adding role.");
                            return;
                        }
                        alert(errJson.message || "Error adding role: " + errJson.error);
                    }
                })
        } catch (error) {
            console.error(error);
            alert("Error adding role.");
        }
    });
    fetchCouriers();
});

function getAuthHeaders() {
    const token = localStorage.getItem("jwtToken");
    return token ? {"Authorization": `Bearer ${token}`} : {};
}


async function loadUnassignedOrdersCount() {
    try {
            const response = await fetch("/api/admin/orders/unassigned/count",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders()
                    }
                });
            if (!response.ok) {
                    throw new Error("Status: " + response.status);
                }
            const count = await response.json();
            document.getElementById("unassignedCount").textContent = count;
        } catch (err) {
            console.error("Error fetching no of unallocated orders:", err);
            document.getElementById("unassignedCount").textContent = "ERROR";
        }
}