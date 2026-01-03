import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, type ConfigEnv } from 'vite'
import { resolve } from "path"
import { readFileSync } from "fs"

export default defineConfig((conf: ConfigEnv) => {
    const is_dev = conf.command === "serve" && conf.mode === "development";
    const base = is_dev ? "/" : "/ExerciseLog/";

    let server_opts = undefined;
    if (is_dev) {
        server_opts = {
            allowedHosts: ['zephyrus.local'],
            https: {
                key: readFileSync("/app/.cert/localhost-key.pem"),
                cert: readFileSync("/app/.cert/localhost.pem"),
            }
        };
    }

    return {
        base,
        plugins: [
            react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
            tailwindcss(),
            VitePWA({
                strategies: "generateSW",
                injectRegister: "auto",
                devOptions: { enabled: true },

                workbox: {
                    navigateFallback: `${base}index.html`,
                    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                },

                manifest: {
                    id: base,
                    name: "Exercise Log",
                    short_name: "Log",
                    description: "Offline workout tracking application",
                    start_url: base,
                    scope: base,
                    display: "standalone",
                    background_color: "#0b0b0c",
                    theme_color: "#0b0b0c",
                    icons: [
                        {
                            src: "icons/icon-192.png",
                            sizes: "192x192",
                            type: "image/png",
                            purpose: "any",
                        },
                        {
                            src: "icons/icon-512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "any",
                        },
                    ],
                    screenshots: [
                        {
                            src: "screenshots/screen-wide.png",
                            sizes: "2880x1800",
                            type: "image/png",
                            form_factor: "wide",
                        },
                        {
                            src: "screenshots/screen-narrow.png",
                            sizes: "494x1083",
                            type: "image/png",
                            form_factor: "narrow",
                        },
                    ],
                },
            }),
        ],
        resolve: { alias: { "@": resolve(__dirname, "./src") } },
        server: server_opts,
    };
});
