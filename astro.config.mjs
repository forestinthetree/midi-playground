import { defineConfig } from "astro/config";
import mkcert from "vite-plugin-mkcert";

import react from "@astrojs/react";

const { PUBLIC_SITE_URL } = process.env;

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE_URL,
  vite: {
    plugins: [mkcert()],
  },
  integrations: [react()],
});
