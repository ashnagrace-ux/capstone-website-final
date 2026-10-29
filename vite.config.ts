import vinext from "vinext";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: { watch: { ignored: ["**/outputs/**", "**/test-results/**", "**/playwright-report/**"] } },
  plugins: [
    vinext(),
    cloudflare({
      configPath: process.env.CAPSTONE_DEMO === "1" ? "wrangler.demo.jsonc" : "wrangler.jsonc",
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      inspectorPort: false,
    }),
  ],
});
