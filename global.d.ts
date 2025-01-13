import { TokenResponse } from "@/types/user.type";

export interface IElectronAPI {
  startLogin: () => void;
  onLoginSuccess: (callback: (data: TokenResponse) => void) => void;
  onLoginFailure: (callback: (error: string) => void) => void;
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}