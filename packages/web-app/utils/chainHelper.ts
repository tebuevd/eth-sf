import type { TokenDistribution } from "./helpers";
import { BigNumber } from "ethers";

export const preprocessDist = (tokenDist: TokenDistribution) => {
  const { decimals, dropInfo } = tokenDist;
  let sum = 0;
  const treeData: Record<string, number> = {};
  dropInfo.forEach((e) => {
    treeData[e.publicAddress.toLowerCase()] = e.tokens;
    sum += e.tokens;
  });
  return {
    treeData,
    decimals,
    totalSum: BigNumber.from(sum.toString() + "0".repeat(decimals)),
  };
};
