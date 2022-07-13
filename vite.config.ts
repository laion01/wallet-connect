import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      util: "util",
      web3: path.resolve(__dirname, "./node_modules/web3/dist/web3.min.js"),
      "@walletconnect/web3-provider": path.resolve(
        __dirname,
        "./node_modules/@walletconnect/web3-provider/dist/umd/index.min.js"
      ),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
});
