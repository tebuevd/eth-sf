import { z } from "zod";

export const tokenDistribution = z.object({
  decimals: z.number(),
  dropInfo: z.array(
    z.object({ publicAddress: z.string(), tokens: z.number() })
  ),
});

export type TokenDistribution = ReturnType<typeof tokenDistribution.parse>;
