function parseJwt(token) {
    try {
        const payloadBase64Url = token.split('.')[1];
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(payloadBase64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error at decoding JWT:', e);
        return null;
    }
}

function getUserRole() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    const payload = parseJwt(token);
    if (!payload || typeof payload.role !== 'string') {
        return null;
    }
    return payload.role;
}


function isAdmin() {
    const role = getUserRole();
    console.log(role);
    return role === 'admin';
}

function getToken() {
    return localStorage.getItem("jwtToken");
}

function logoutUser() {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login.html";
}

async function fetchUserProfile() {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch(`api/users/me`, {
            headers: {"Authorization": "Bearer " + token}
        });

        if (!response.ok) {
            console.error("Error fetching user's profile:", response.status);
            return null;
        }

        return await response.json();
    } catch (e) {
        console.error("Error fetching user's profile:", e);
        return null;
    }
}
