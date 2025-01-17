import "source-map-support/register";

import path from "node:path";
import { app, BrowserWindow } from "electron";

// trying to get better stacks
app.commandLine.appendSwitch("js-flags", "--stack_trace_limit=100");

let mainWindow: BrowserWindow | null;

const PUBLIC = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/`);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 500,
    height: 800,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(PUBLIC, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => createWindow());
