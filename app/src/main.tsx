import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { setTheme, getTheme } from "@/lib/themes.ts";
import App from '@/App.tsx'
import './index.css'

// check theme and set it
setTheme(getTheme());

// render page
createRoot(document.getElementById('root')!)
    .render(
        <StrictMode>
            <RouterProvider router={App} />
        </StrictMode>,
    )