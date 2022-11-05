import * as trpc from "@trpc/server";
import type { Context, Meta } from "./context";

/**
 * Helper function to create a router with context
 */
export default function createRouter() {
  return trpc.router<Context, Meta>();
}
