import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { Goerli } from "@thirdweb-dev/chains";
import {
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  smartWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react";

export const chain = Goerli;
export const factoryAddress = "0xe448A5878866dD47F61C6654Ee297631eEb98966";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={chain}
      supportedWallets={[
        smartWallet({
          factoryAddress,
          thirdwebApiKey: "",
          gasless: true,
        }),
        metamaskWallet(),
        coinbaseWallet(),
      ]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
