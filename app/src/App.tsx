import { Outlet, createBrowserRouter, type DataRouter } from "react-router-dom";

import NavBar from "@/components/navbar";

import Log from "@/pages/Log"
import Home from "@/pages/Home";
import Stats from "@/pages/Stats";
import Manage from "@/pages/Manage";
import type { JSX } from "react";

// default layout of app
function AppLayout(): JSX.Element {
    return (
        <div className="h-dvh flex flex-col">
            <header className="sticky top-0 z-50 w-full bg-background border-b shadow-md">
                <NavBar />
            </header>

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>

            <footer className="sticky bottom-0 z-50 bg-background text-sm text-center text-secondary">
                Copyright © 2025 Ahmad Janjua
            </footer>
        </div>
    );
}

// sets the routing paths
const App: DataRouter = createBrowserRouter(
    [{
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "log/:id?", element: <Log /> },
            { path: "stats", element: <Stats /> },
            { path: "manage", element: <Manage /> },
        ]
    }],
    { basename: import.meta.env.BASE_URL }
);


export default App;
