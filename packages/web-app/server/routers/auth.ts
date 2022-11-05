import createRouter from "../createRouter";
import { generateNonce, SiweMessage } from "siwe";
import { z } from "zod";

export const authRouter = createRouter()
  .mutation("nonce", {
    input: z.object({ address: z.string().nullish() }),
    output: z.string(),
    async resolve({ ctx }) {
      const { req } = ctx;
      req.session.nonce = generateNonce();
      await req.session.save();
      return req.session.nonce;
    },
  })
  .mutation("verify", {
    input: z.object({
      message: z.string(),
      signature: z.string(),
    }),
    output: z.object({
      ok: z.boolean(),
    }),
    async resolve({ input, ctx: { req } }) {
      const { message, signature } = input;
      try {
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.validate(signature);

        if (fields.nonce !== req.session.nonce) {
          throw new Error("Bad nonce.");
        }

        req.session.siwe = fields;
        await req.session.save();
        return { ok: true };
      } catch (err) {
        return { ok: false };
      }
    },
  })
  .mutation("logout", {
    input: z.object({
      address: z.string().nullish(),
    }),
    output: z.object({
      ok: z.boolean(),
    }),
    async resolve({ ctx: { req } }) {
      try {
        req.session?.destroy();
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
  });
