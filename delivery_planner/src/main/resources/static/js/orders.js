document.addEventListener("DOMContentLoaded", () => {
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

    showNewOrderButtonIfClient();
    loadMyOrders();
    setupSeeRouteButton();
});

async function loadMyOrders() {
    const msgEl = document.getElementById("ordersError");
    msgEl.textContent = "";

    const token = getToken();
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const role = getUserRole();
        const response = await fetch("/api/orders/my", {
            headers: {"Authorization": "Bearer " + token}
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logoutUser();
                return;
            }
            msgEl.textContent = "Error at loading orders.";
            return;
        }

        const orders = await response.json();
        const table = document.getElementById("ordersTable");
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";

        if (orders.length === 0) {
            msgEl.textContent = "You do not have any orders.";
            table.style.display = "none";
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.client.username}</td>
                <td>${order.courierId !== null ? order.courier.username  : "-"}</td>
                <td>${order.description}</td>
                <td>${order.statusName}</td>
                <td>${order.address.latitude !== null && order.address.longitude !== null
                         ? order.address.latitude.toFixed(3) + ", " + order.address.longitude.toFixed(3)
                             : "-"}</td>
                `;

            const actionTd = document.createElement("td");

            if (role === "courier" && order.statusName !== "done") {
                const btnDone = document.createElement("button");
                btnDone.textContent = "Done";
                btnDone.classList.add("btn-done");
                ~
                    btnDone.addEventListener("click", async () => {
                        await markOrderDone(order.id);
                    });
                actionTd.appendChild(btnDone);
            }
            tr.appendChild(actionTd);
            tbody.appendChild(tr);
        });

        table.style.display = "table";
    } catch (e) {
        console.error(e);
        msgEl.textContent = "Server connection error.";
    }
}

async function markOrderDone(orderId) {
    const token = getToken();
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch(`/api/orders/${orderId}/done`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        if (response.ok) {
            loadMyOrders();
        } else if (response.status === 401 || response.status === 403) {
            logoutUser();
        } else {
            alert("Error updating order. Status: " + response.status);
        }
    } catch (e) {
        console.error("Error at markOrderDone:", e);
        alert("Server connection error.");
    }
}

async function showNewOrderButtonIfClient() {
    const role = getUserRole();
    if (role && role === "client") {
        const container = document.getElementById("newOrderContainer");
        if (!container) return;

        const btn = document.createElement("button");
        btn.textContent = "New Order";

        btn.addEventListener("click", () => {
            window.location.href = "/orders-new.html";
        });

        container.appendChild(btn);
    }
}

function setupSeeRouteButton() {
    const btn = document.getElementById("seeRouteBtn");
    const role = getUserRole();
    if (role === "courier") {
        seeRouteBtn.style.display = "inline-block";
    }
    if (!btn) return;

    btn.addEventListener("click", async () => {
        await loadRouteGraph();
    });
}

async function markOrderDone(orderId) {
    const token = getToken();
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch(`/api/orders/${orderId}/done`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        if (response.ok) {

        } else if (response.status === 401 || response.status === 403) {
            logoutUser();
        } else {
            alert("Error updating order. Code: " + response.status);
        }
    } catch (e) {
        console.error("Error at markOrderDone:", e);
        alert("Server connection error.");
    }
    loadMyOrders();
}

async function loadRouteGraph() {
    const token = getToken();
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("/api/orders/route", {
            headers: {"Authorization": "Bearer " + token}
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logoutUser();
                return;
            }
            console.error("Error loading route:", response.status);
            return;
        }

        const routeDto = await response.json();
        renderRouteChart(routeDto);
    } catch (e) {
        console.error("Error at loadRouteGraph:", e);
    }
}

function renderRouteChart(routeData) {
    const title = document.getElementById("routeTitle");
    const wrapper = document.getElementById("chartWrapper");
    const canvas = document.getElementById("routeChart");

    if (!wrapper || !title || !canvas) return;

    const tspSteps = Array.isArray(routeData) ? routeData : [];

    if (tspSteps.length === 0) {
        wrapper.style.display = "none";
        title.style.display = "none";
        return;
    }

    title.style.display = "block";
    wrapper.style.display = "block";

    const sortedSteps = [...tspSteps].sort((a, b) => a.stepIndex - b.stepIndex);

    const points = sortedSteps.map(step => ({
        x: step.longitude,
        y: step.latitude,
        label: `Order #${step.orderId} - Step ${step.stepIndex}`
    }));

    const data = {
        datasets: [{
            label: "TSP Route",
            data: points,
            showLine: true,
            fill: false,
            pointBackgroundColor: "#2B7CE9",
            borderColor: "#2B7CE9",
            pointRadius: 6,
            tension: 0
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Longitude'
                },
                grid: {
                    drawOnChartArea: true,
                    color: '#e0e0e0'
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Latitude'
                },
                grid: {
                    drawOnChartArea: true,
                    color: '#e0e0e0'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: context => {
                        const p = context.raw;
                        return `${p.label}: (${p.y.toFixed(5)}, ${p.x.toFixed(5)})`;
                    }
                }
            },
            legend: {
                display: false
            }
        },
        elements: {
            point: {
                hoverRadius: 8
            }
        }
    };

    if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");
    canvas.chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: data,
        options: options
    });
}