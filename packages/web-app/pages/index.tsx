import dynamic from "next/dynamic";

const FeedbackForm = dynamic(() => import("../components/FeedbackForm"), {
  ssr: false,
});

const AddFeedback = () => {
  return <FeedbackForm />;
};

export default AddFeedback;
