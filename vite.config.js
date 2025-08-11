import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import fs from "fs";
export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.js"],
            refresh: true,
        }),
    ],
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true, // Necesario para entornos virtuales (Vagrant, WSL2, etc.)
            interval: 100, // Intervalo de sondeo en milisegundos
            ignored: ["!**/dist/"],
        },
        hmr: {
            protocol: "wss",
            host: "30days.isw811.xyz",
            port: 5173,
        },
    },
});
