import { store } from "@/store";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Provider } from "react-redux";

export function Providers({ children }: { children: ReactNode }) {

  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        {children}
      </Provider>
    </ThemeProvider>
    );
}
