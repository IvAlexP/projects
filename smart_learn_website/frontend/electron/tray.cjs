const { app, Menu, Tray } = require("electron");
const path = require("path");

let tray = null; // prevent garbage collection

function createTray(win) {
  const iconPath = path.join(__dirname, "../src/assets/icon.png");
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Dashboard",
      click: () => {
        if (win) {
          win.show();
        }
      },
    },
    { type: "separator" },
    {
      label: "Quit Application",
      click: () => {
        app.isQuitting = true;
        app.quit(); // kill the background process
      },
    },
  ]);

  tray.setToolTip("SmartLearn Manager");
  tray.setContextMenu(contextMenu);

  // left-clicking the icon toggles the dashboard window
  tray.on("click", () => {
    if (win && win.isVisible()) {
      win.hide();
    } else if (win) {
      win.show();
    }
  });

  return tray;
}

module.exports = { createTray };
