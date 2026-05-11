import { Hono } from 'hono';
import { cors } from "hono/cors";
import generateLogoRoute from "./routes/generate-logo";

const app = new Hono()
  .basePath('api')
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true }))
  .get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'ok' }, 200))
  .route('/', generateLogoRoute);

export type AppType = typeof app;
export default app;
