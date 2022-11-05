import react, { useCallback, useState } from "react";
import { useProvider, useSigner } from "wagmi";
import Generator from "../generateTree";
import { Airdrop__factory } from "../typechain";
import { preprocessDist } from "../utils/chainHelper";
import { TokenDistribution } from "../utils/helpers";
import { trpc } from "../utils/trpc";

type CreateParams = {
  startDate: Date;
  endDate: Date;
  tokenAddress: string;
  tokenDistribution: TokenDistribution;
};

export const useCreateAirdrop = () => {
  const { data: signer } = useSigner();
  const [processing, setProcessing] = useState(false);
  const [createdAirdropUUID, setCreatedAirdropUUID] = useState<
    undefined | string
  >(undefined);

  const { data: airdropContract, isLoading } = trpc.useQuery([
    "getAirdropAddress",
  ]);

  const updateDb = trpc.useMutation("handleAirdropMint");

  const sendCreateTx = useCallback(
    async ({
      endDate,
      startDate,
      tokenAddress,
      tokenDistribution,
    }: CreateParams) => {
      const { decimals, treeData, totalSum } =
        preprocessDist(tokenDistribution);
      const gen = new Generator(decimals, treeData);
      const { root } = await gen.generateMerkleData();

      if (isLoading || !airdropContract || !signer) return;

      const airdrop = Airdrop__factory.connect(airdropContract, signer);

      try {
        const { wait } = await airdrop.createAirdrop(
          root,
          totalSum,
          tokenAddress,
          (startDate.getTime() / 1000).toString(),
          (endDate.getTime() / 1000).toString()
        );
        setProcessing(true);

        const receipt = await wait(1);
        if (receipt.status) {
          const event = receipt.events?.find(
            (event) => event.event === "AirdropCreated"
          );

          const { airdropId } = event!.args!;

          const airdropUUID = await updateDb.mutateAsync({
            endDate: endDate.toISOString(),
            startDate: startDate.toISOString(),
            tokenAddress,
            tokenDistribution,
            onchainAirdropId: airdropId.toString(),
          });

          setCreatedAirdropUUID(airdropUUID);
        }
      } finally {
        setProcessing(false);
      }
    },
    [airdropContract, isLoading, signer, updateDb]
  );

  return { sendCreateTx, processing, createdAirdropUUID };
};
