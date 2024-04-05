import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../backend/src/public/swagger.json",
  output: "lib/backend-client",
  name: "Service",
});
