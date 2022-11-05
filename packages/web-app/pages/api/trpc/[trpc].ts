import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "../../../server/context";
import { appRouter } from "../../../server/routers/app";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
  }),
  {
    cookieName: "siwe",
    password: process.env.IRON_SESSION_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
