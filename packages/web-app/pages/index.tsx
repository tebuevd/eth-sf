import dynamic from "next/dynamic";

const FeedbackForm = dynamic(() => import("../components/FeedbackForm"), {
  ssr: false,
});

const CreateAirdrop = () => {
  return <FeedbackForm />;
};

export default CreateAirdrop;
