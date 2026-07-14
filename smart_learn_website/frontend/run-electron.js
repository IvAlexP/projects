import { exec } from "child_process";
import waitOn from "wait-on";
import dotenv from "dotenv";

dotenv.config();
const baseURL = process.env.BASE_URL || "http://localhost";
const port = process.env.FRONTEND_PORT || 5173;
const url = `${baseURL}:${port}`;

console.log(`[Electron] Waiting for ${url}...`);

const opts = {
  resources: [url],
  validateStatus: function (status) {
    return status >= 200 && status < 300; // success only if status code is 2xx
  },
};

waitOn(opts)
  .then(() => {
    console.log("[Electron] Server is ready! Waiting...");
    // native Electron command to start the app
    exec("npx electron .", (err) => {
      if (err) {
        console.error("[Electron] Error starting Electron:", err);
      }
    });
  })
  .catch((err) => {
    console.error("[Electron] Error in wait-on:", err);
  });
