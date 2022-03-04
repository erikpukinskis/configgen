import path from "path"
import { defineConfig } from "vite"
import macros from "vite-plugin-babel-macros"
import react from "@vitejs/plugin-react"

export default defineConfig({
  server: {
    hmr: {
      port: 443,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [macros(), react()],

  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "FrontendLib",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
})
