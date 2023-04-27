import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { Goerli } from "@thirdweb-dev/chains";
import {
  coinbaseWallet,
  metamaskWallet,
  smartWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react";

export const chain = Goerli;
export const factoryAddress = "0x407D276eb753BAb485CCA218F7fE2fb9bb039BAA";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={chain}
      supportedWallets={[
        smartWallet({
          factoryAddress,
          gasless: true,
          thirdwebApiKey: "",
        }),
        metamaskWallet(),
        coinbaseWallet(),
      ]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
