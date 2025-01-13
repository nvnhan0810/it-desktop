// See the Electron documentation for details on how to use preload scripts:

import { contextBridge, ipcRenderer } from "electron";
import { TokenResponse } from "./types/user.type";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('electron', {
    startLogin: () => ipcRenderer.send('start-login'),
    onLoginSuccess: (callback: (data: TokenResponse) => void) =>
        ipcRenderer.on('login-success', (_event, data) => callback(data)),
    onLoginFailure: (callback: (error: string) => void) =>
        ipcRenderer.on('login-failure', (_event, error) => callback(error)),
});