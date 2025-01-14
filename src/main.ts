import axios from 'axios';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'path';
import { Config } from './config';

let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(Config.app.protocol, process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient(Config.app.protocol)
}


// Handle the protocol. In this case, we choose to show an Error Box.
app.on('open-url', (event, url) => {
  event.preventDefault();
  handleAuthCallback(url);
})

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    // the commandLine is array of strings in which last element is deep link url
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`)
  })

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createWindow()
  })
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('start-login', async () => {
  // Open the login URL in the default browser
  await shell.openExternal(`${Config.auth.baseUrl}/oauth/login?client_id=${Config.auth.clientId}&redirect_url=${Config.auth.redirect}`);
});

const handleAuthCallback = async (url: string) => {
  if (url.startsWith(Config.auth.redirect)) {
    const params = new URL(url).searchParams;
      const code = params.get('code');

      if (code) {
        try {
          const res = await axios.post(`${Config.auth.baseUrl}/oauth/token`, {
            grant_type: 'authorization_code',
            client_id: Config.auth.clientId,
            // TODO: hide it
            client_secret: Config.auth.secret,
            redirect_uri: Config.auth.redirect,
            code: code,
          });

          const data = res.data;

          // Send token and user info to the renderer process
          mainWindow.webContents.send('login-success', data);
        } catch (e) {
          mainWindow.webContents.send('login-failure', e.message);
        }
      }
  }
};