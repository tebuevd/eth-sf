import { ConnectButton } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";
import { SiweMessage } from "siwe";
import { trpc } from "../utils/trpc";
import { useAccount, useProvider, useSignMessage, useDisconnect } from "wagmi";
import { useEffect } from "react";

export default function SignIn() {
  const fetchNonce = trpc.useMutation(["auth.nonce"]);
  const verifySignature = trpc.useMutation(["auth.verify"]);
  const logout = trpc.useMutation(["auth.logout"]);
  const { disconnect } = useDisconnect();

  const provider = useProvider();
  const { signMessageAsync, error } = useSignMessage();

  useEffect(() => {
    if (error) disconnect();
  }, [disconnect, error]);

  const { address } = useAccount({
    async onConnect({ address }) {
      const network = await provider.getNetwork();
      if (!address) {
        throw new Error("Address not found upon connection.");
      }

      const nonce = await fetchNonce.mutateAsync({ address });

      const msgData: Partial<SiweMessage> = {
        address,
        domain: window.location.host,
        uri: window.location.origin,
        statement:
          "Welcome to Magna Airdrops! Please click 'Sign' to sign-in. No password needed!",
        version: "1",
        chainId: network.chainId,
        nonce,
        expirationTime: dayjs().add(1, "week").toISOString(),
      };
      const message = new SiweMessage(msgData);
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      await verifySignature.mutateAsync({
        message: message.prepareMessage(),
        signature,
      });
    },
    async onDisconnect() {
      await logout.mutateAsync({ address });
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
