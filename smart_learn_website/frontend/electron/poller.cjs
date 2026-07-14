const { net, session, Notification } = require("electron");

let winRef = null;
let lastCheckedTime = new Date().toISOString();

function showNotification(title, body) {
  if (Notification.isSupported()) {
    const notification = new Notification({ title, body });
    notification.on("click", () => {
      if (winRef) winRef.show();
    });
    notification.show();
  }
}

function fetchUserAndNotify(backendURL, cookieString, title, bodyTemplate) {
  const userReq = net.request(`${backendURL}/user/profile`);
  if (cookieString) {
    userReq.setHeader("Cookie", cookieString);
  }

  userReq.on("response", (userResponse) => {
    let userData = "";
    userResponse.on("data", (chunk) => {
      userData += chunk;
    });
    userResponse.on("end", () => {
      try {
        const parsedUser = JSON.parse(userData);
        const displayName = parsedUser.displayName || "User";
        const finalBody = bodyTemplate.replace("{name}", displayName);
        showNotification(title, finalBody);
      } catch (e) {
        console.error("Failed to parse user for notification", e);
      }
    });
  });
  userReq.end();
}

async function fetchDueCards(isStartup) {
  const backendport = process.env.BACKEND_PORT || 3000;
  const baseURL = process.env.VITE_BASE_URL || `http://localhost`;
  const backendURL = `${baseURL}:${backendport}`;

  const cookies = await session.defaultSession.cookies.get({ url: backendURL });
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  let endpointURL = `${backendURL}/cards/due/count`;

  if (!isStartup) {
    endpointURL = `${backendURL}/cards/due/notif?lastNotification=${encodeURIComponent(lastCheckedTime)}`;
    lastCheckedTime = new Date().toISOString();
  }

  const request = net.request(endpointURL);

  if (cookieString) {
    request.setHeader("Cookie", cookieString);
  }

  request.on("error", (err) => console.log(`Network error: ${err.message}`));

  request.on("response", (response) => {
    if (response.statusCode === 401) {
      return; // user not logged in
    }

    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const { currentDueCount } = JSON.parse(data);

        if (currentDueCount > 0) {
          if (isStartup) {
            const text = currentDueCount === 1 ? "card" : "cards";
            fetchUserAndNotify(
              backendURL,
              cookieString,
              "Daily Study Summary",
              `Welcome back, {name}! You have ${currentDueCount} ${text} due for the day.`,
            );
          } else {
            fetchUserAndNotify(
              backendURL,
              cookieString,
              "Time to Study",
              `Hey {name}, ${currentDueCount} new ${text} just became due!`,
            );
          }
        }
      } catch (e) {
        console.error("Failed to parse due cards", e);
      }
    });
  });

  request.end();
}

function startBackgroundPolling(win) {
  winRef = win;

  setInterval(
    () => {
      fetchDueCards(false);
    },
    2 * 60 * 60 * 1000,
  ); // every 2 hours
}

function triggerStartupNotification() {
  fetchDueCards(true);
}

module.exports = { startBackgroundPolling, triggerStartupNotification };
