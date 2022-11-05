import { tokenDistribution, TokenDistribution } from "../../utils/helpers";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { prisma } from "../../server/prisma";

const ClaimImp = dynamic(() => import("../../components/ClaimImp"), {
  ssr: false,
});

type Props = {
  tokenDistribution: TokenDistribution;
  startStr: string;
  endStr: string;
  tokenAddress: string;
  airdropId: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { airdropUUID } = context.query;
  if (!airdropUUID || typeof airdropUUID != "string")
    return {
      notFound: true,
    };

  const dropObject = await prisma.airdrop.findFirst({
    where: { id: airdropUUID },
    select: {
      distributionJson: true,
      startDate: true,
      endDate: true,
      tokenAddress: true,
      onchainId: true,
    },
  });
  const merkleData = tokenDistribution.safeParse(dropObject?.distributionJson);
  if (!merkleData.success || !dropObject) return { notFound: true };
  return {
    props: {
      tokenDistribution: merkleData.data,
      startStr: dropObject.startDate.toISOString(),
      endStr: dropObject.endDate.toISOString(),
      tokenAddress: dropObject.tokenAddress,
      airdropId: dropObject.onchainId,
    },
  };
};

const Claim = (props: Props) => {
  return <ClaimImp {...props} />;
};

export default Claim;
