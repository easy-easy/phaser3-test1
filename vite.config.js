import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    //   resolve: {
    //     alias: {
    //       "@": path.resolve(__dirname, "./src"),
    //       "./src/": path.resolve(__dirname, "./src"),
    //     //   img: path.resolve("/img"),
    //     },
    //   },
    //   root: "./public/",
    server: {
        host: '0.0.0.0',
        port: 3000,
        watch: {
            usePolling: true,
        },
    },
})
