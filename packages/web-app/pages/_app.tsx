import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "../server/routers/app";
import Head from "next/head";
import dynamic from "next/dynamic";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      alchemyId: "Okhu3ghars8vVV7Y69ELnCQ1L0DGDgqy",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const SignIn = dynamic(() => import("../components/SignIn"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <div className="container font-mono text-lg flex mx-auto  pt-5 flex-col h-screen flex-none-">
            <Head>
              <title>Reputation</title>
              <meta
                name="description"
                content="Generated by @rainbow-me/create-rainbowkit"
              />
            </Head>

            <div className="flex-initial h-20">
              <div className="flex flex-row justify-between items-center h-full">
                <div className="font-mono text-lg ">Reputation</div>
                <SignIn />
              </div>
            </div>
            <div className="h-full flex flex-col items-stretch">
              <Component {...pageProps} />
            </div>
          </div>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      url: `${getBaseUrl()}/api/trpc`,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
