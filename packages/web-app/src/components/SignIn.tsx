import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useProvider, useSignMessage, useDisconnect } from "wagmi";
import { useEffect } from "react";

export default function SignIn() {
  const { disconnect } = useDisconnect();
  const provider = useProvider();
  const { error } = useSignMessage();

  useEffect(() => {
    if (error) disconnect();
  }, [disconnect, error]);

  const { address } = useAccount({
    async onConnect({ address }) {
      const network = await provider.getNetwork();
      if (!address) {
        throw new Error("Address not found upon connection.");
      }
    },
  });

  return (
    <div>
      <ConnectButton
        accountStatus="full"
        chainStatus="none"
        label="Connect Wallet"
        showBalance={false}
      />
    </div>
  );
}
