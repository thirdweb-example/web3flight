import "./styles/Home.css";
import { Claim } from "./Claim";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Home() {
  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          Welcome to{" "}
          <a href="https://thirdweb.com/" target="_blank">
            thirdweb
          </a>{" "}
          Airlines!
        </h1>
        <div className="grid">
          <p className="description">
            Get your boarding pass for your first web3 flight! ✈️
          </p>
          <ConnectWallet
            dropdownPosition={{
              align: "center",
              side: "bottom",
            }}
          />
          <br />
          <Claim />
        </div>
      </main>
    </div>
  );
}
