import createRouter from "../createRouter";
import { authenticatedMiddleware } from "../middleware/authenticated";
import { authRouter } from "./auth";
import { ipfsRouter } from "./ipfs";

export const appRouter = createRouter()
  .middleware(authenticatedMiddleware)
  .merge("auth.", authRouter)
  .merge("ipfs.", ipfsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
