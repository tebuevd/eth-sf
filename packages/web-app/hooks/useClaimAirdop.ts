import react, { useCallback, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import Generator from "../generateTree";
import { Airdrop__factory } from "../typechain";
import { preprocessDist } from "../utils/chainHelper";
import { tokenDistribution, TokenDistribution } from "../utils/helpers";
import { trpc } from "../utils/trpc";

type ClaimParams = {
  treeData: Record<string, number>;
  decimals: number;
  airdropId: string;
  amount: string;
};

export const useClaimAirdrop = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [processing, setProcessing] = useState(false);

  const { data: airdropContract, isLoading } = trpc.useQuery([
    "getAirdropAddress",
  ]);

  const sendClaimTx = useCallback(
    async ({ treeData, decimals, airdropId, amount }: ClaimParams) => {
      if (isLoading || !airdropContract || !signer || !address) return;

      const gen = new Generator(decimals, treeData);
      const { tree } = await gen.generateMerkleData();
      const leaf = gen.generateLeaf(address, amount);
      const proof = tree.getHexProof(leaf);

      const airdrop = Airdrop__factory.connect(airdropContract, signer);

      try {
        const { wait } = await airdrop.claim(airdropId, address, amount, proof);
        setProcessing(true);

        const receipt = await wait(1);
        if (receipt.status) {
          return true;
        }
      } finally {
        setProcessing(false);
      }
      return false;
    },
    [address, airdropContract, isLoading, signer]
  );

  return { sendClaimTx, processing };
};
