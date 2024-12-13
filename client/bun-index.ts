import serveStatic from "serve-static-bun";

Bun.serve({ port: 3000, fetch: serveStatic("./public") });