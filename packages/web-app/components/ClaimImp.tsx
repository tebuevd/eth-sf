import { useAccount } from "wagmi";
import { useMemo, useState } from "react";
import { Button } from "@chakra-ui/react";
import { TokenDistribution } from "../utils/helpers";
import { useClaimAirdrop } from "../hooks/useClaimAirdop";
import { preprocessDist } from "../utils/chainHelper";

type Props = {
  tokenDistribution: TokenDistribution;
  startStr: string;
  endStr: string;
  tokenAddress: string;
  airdropId: string;
};

export default function ClaimImp(props: Props) {
  const { isConnected, address } = useAccount();
  const [claimed, setClaimed] = useState(false);
  const { tokenDistribution, startStr, endStr, tokenAddress, airdropId } =
    props;
  const { processing, sendClaimTx } = useClaimAirdrop();

  const startDate = useMemo(() => new Date(startStr), [startStr]);
  const endDate = useMemo(() => new Date(endStr), [endStr]);

  const Content = useMemo(() => {
    const now = new Date();

    if (!isConnected || !address)
      return <>Connect wallet to see claim status</>;

    if (now.getTime() < startDate.getTime()) {
      return <>{`Claim starts at ${startDate.toISOString()}`}</>;
    } else if (
      now.getTime() > startDate.getTime() &&
      now.getTime() < endDate.getTime()
    ) {
      const merkle = preprocessDist(tokenDistribution);
      const claimData = merkle.treeData[address.toLowerCase()];
      if (!claimData) return <>you are not eligible</>;

      return (
        <>
          <Button
            onClick={async () => {
              const res = await sendClaimTx({
                airdropId,
                amount: claimData.toString() + "0".repeat(merkle.decimals),
                treeData: merkle.treeData,
                decimals: merkle.decimals,
              });
              if (!!res) setClaimed(true);
            }}
            className="w-full bg-green-200 border-solid h-10 font-mono border-2"
            disabled={!!processing || !!claimed}
          >
            {!claimed ? (!processing ? "Claim" : "Processing...") : "Claimed!"}
          </Button>
        </>
      );
    } else {
      // TODO
      return <></>;
    }
  }, [
    address,
    airdropId,
    claimed,
    endDate,
    isConnected,
    processing,
    sendClaimTx,
    startDate,
    tokenDistribution,
  ]);

  return (
    <>
      <div className="h-full flex flex-col items-center justify-center pb-20">
        <div className="text-2xl flex-wrap pb-5 ">{`Claim your tokens!`}</div>
        <div className="pb-5"> {`Token contract address: ${tokenAddress}`}</div>
        {Content}
      </div>
    </>
  );
}
