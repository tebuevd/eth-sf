import { TRPCError } from "@trpc/server";
import { MiddlewareFunction } from "@trpc/server/dist/declarations/src/internals/middlewares";
import dayjs from "dayjs";
import type { Context, Meta } from "../context";

export const authenticatedMiddleware: MiddlewareFunction<
  Context,
  Context,
  Meta
> = async function ({ ctx, next, meta }) {
  //invalidate expired sessions
  if (ctx.req.session?.siwe) {
    const { expirationTime, issuedAt } = ctx.req.session.siwe;

    if (dayjs().isAfter(dayjs(expirationTime))) {
      ctx.req.session.destroy();
    }

    //invalidate sessions older than a week by default
    if (dayjs().isAfter(dayjs(issuedAt).add(1, "week"))) {
      ctx.req.session.destroy();
    }
    //TODO invalidate user-revoked sessions
  }

  if (meta?.hasAuth) {
    if (!ctx.req.session?.siwe) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "The session is expired. Please sign-in again.",
      });
    }
  }

  return next({
    ctx: { ...ctx, publicAddress: ctx.req.session.siwe?.address },
  });
};
