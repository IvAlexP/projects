const { app, BrowserWindow, Notification, ipcMain } = require("electron");
require("dotenv").config();

const { createTray } = require("./electron/tray.cjs");
const {
  startBackgroundPolling,
  triggerStartupNotification,
} = require("./electron/poller.cjs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // later: true and use preload.js script to expose IPC securely
    },
  });

  const port = process.env.FRONTEND_PORT || 5173;
  const baseURL = process.env.VITE_BASE_URL || `http://localhost`;
  const frontendURL = `${baseURL}:${port}`;

  win.loadURL(frontendURL);

  win.on("close", (event) => {
    if (app.isQuitting) {
      win = null;
    } else {
      event.preventDefault(); // stop the window from destroying itself
      win.hide(); // hide window instead of closing
    }
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // can't get the lock -> another instance is already running
  app.quit();
} else {
  // try to open the app a second time -> bring the existing window to the front
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    app.setAppUserModelId("com.smartlearn.app");

    // open when system starts
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true,
    });

    createWindow();

    createTray(win);
    startBackgroundPolling(win);

    // notification at start-up after authentication
    ipcMain.once("user-auth-ready", () => {
      triggerStartupNotification();
    });

    ipcMain.on("clear-user-session", async () => {
      try {
        await session.defaultSession.clearStorageData({
          storages: ["cookies"],
        });
      } catch (err) {
        console.error("Failed to clear cookies", err);
      }
    });

    // app stays active in background so create new window when user clicks on the icon
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else if (win) {
        win.show();
      }
    });
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // app runs in the background
  }
});
