import createRouter from "../createRouter";
import { authenticatedMiddleware } from "../middleware/authenticated";
import { z } from "zod";
import { authRouter } from "./auth";
import { tokenDistribution } from "../../utils/helpers";

export const appRouter = createRouter()
  .middleware(authenticatedMiddleware)
  .query("getAirdropAddress", {
    async resolve() {
      return process.env.AIRDROP_CONTRACT;
    },
  })
  .mutation("handleAirdropMint", {
    input: z.object({
      tokenAddress: z.string(),
      tokenDistribution: tokenDistribution,
      startDate: z.string(),
      endDate: z.string(),
      onchainAirdropId: z.string(),
    }),
    async resolve({
      input: {
        tokenAddress,
        tokenDistribution,
        startDate,
        endDate,
        onchainAirdropId,
      },
      ctx: { prisma, publicAddress },
    }) {
      if (!publicAddress) throw new Error("user unauthenticated");

      const airdrop = await prisma.airdrop.create({
        data: {
          distributionJson: tokenDistribution,
          adminAddress: publicAddress,
          startDate,
          endDate,
          tokenAddress,
          onchainId: onchainAirdropId,
        },
        select: { id: true },
      });
      return airdrop.id;
    },
  })

  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
