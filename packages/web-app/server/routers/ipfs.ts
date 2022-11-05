import createRouter from "../createRouter";
import { z } from "zod";

export const ipfsRouter = createRouter().mutation("add", {
  input: z.string(),
  resolve: async ({ input, ctx: { ipfsClient } }) => {
    const { cid } = await ipfsClient.add(input);
    return cid.toString();
  },
});
