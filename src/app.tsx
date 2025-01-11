import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import './index.scss';
import { router } from "./routes/router";

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);