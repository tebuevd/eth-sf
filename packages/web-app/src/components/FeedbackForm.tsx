import { WorldIDWidget } from "@worldcoin/id";

const FeedbackForm = () => {
  return (
    <WorldIDWidget
      actionId="wid_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
      signal="my_signal"
      enableTelemetry
      onSuccess={(verificationResponse) => console.log(verificationResponse)} // you'll actually want to pass the proof to the API or your smart contract
      onError={(error) => console.error(error)}
    />
  );
};

export default FeedbackForm;
