import createRouter from "../createRouter";
import { authenticatedMiddleware } from "../middleware/authenticated";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .middleware(authenticatedMiddleware)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
