import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./components/providers";
import './index.scss';
import { router } from "./routes/router";

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Providers>
            <RouterProvider router={router}/>
        </Providers>
    </React.StrictMode>
);