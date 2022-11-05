import dynamic from "next/dynamic";

const CreateAirdopImpl = dynamic(() => import("../components/AirdropForm"), {
  ssr: false,
});

const CreateAirdrop = () => {
  return <CreateAirdopImpl />;
};

export default CreateAirdrop;
