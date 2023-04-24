import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { Goerli } from "@thirdweb-dev/chains";

export const chain = Goerli;
export const factoryAddress = "0xe448A5878866dD47F61C6654Ee297631eEb98966";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
