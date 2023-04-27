import { Goerli } from "@thirdweb-dev/chains";
import { SmartWallet } from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import {
  getAssociatedAccounts,
  isAccountIdAvailable,
} from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import { LocalWallet } from "@thirdweb-dev/wallets/evm/wallets/local-wallet";
import { useEffect, useState } from "react";
import EmailForm from "./email-form";
import "./styles/Home.css";
import { Signer } from "ethers";
import Connected from "./Claim";
import type { EVMWallet } from "@thirdweb-dev/wallets";
import { chain, factoryAddress } from "./main";

export default function Home() {
  const [pw, setPw] = useState<EVMWallet | null>(null);
  const [associatedAccounts, setAssociatedAccounts] = useState<Record<
    string,
    any
  > | null>(null);
  const [signer, setSigner] = useState<Signer>();

  useEffect(() => {
    const initDeviceWallet = async () => {
      const pw = new LocalWallet({
        chain: Goerli,
      });
      await pw.loadOrCreate({
        strategy: "encryptedJson",
        password: "web3flight",
      });
      console.log("device wallet connected", await pw.getAddress());
      return pw;
    };
    initDeviceWallet()
      .then((pw) => setPw(pw))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!pw) return;
    getAssociatedAccounts(pw, factoryAddress, chain).then((accounts) => {
      setAssociatedAccounts(accounts);
      console.log("associated accounts", accounts);
      if (accounts.length > 0) {
        onUsernameSubmitted(accounts[0].accountId, false);
      }
    });
  }, [pw]);

  const onUsernameSubmitted = async (
    username: string,
    checkAvailability: boolean = true
  ) => {
    if (!pw) return;
    if (checkAvailability) {
      const available = await isAccountIdAvailable(
        username,
        factoryAddress,
        chain
      );
      if (!available) {
        alert("Username already taken");
        return;
      }
      console.log("account available", username);
    }
    const account = new SmartWallet({
      chain,
      factoryAddress,
      thirdwebApiKey: "", // TODO
      gasless: true,
    });
    await account.connect({
      personalWallet: pw,
      accountId: username,
    });
    const accountAddress = await account.getAddress();
    console.log("Smart account connected", accountAddress);
    setSigner(await account.getSigner());
  };

  return (
    <div className="container">
      <main className="main">
        {/* <ConnectWallet
          dropdownPosition={{
            align: "center",
            side: "bottom",
          }}
        /> */}
        <h1 className="title">
          Welcome to{" "}
          <a href="https://thirdweb.com/" target="_blank">
            thirdweb
          </a>{" "}
          Airlines!
        </h1>

        <div>
          <p className="description">
            Get your boarding pass for your first web3 flight! ✈️
          </p>

          <div className="content">
            {associatedAccounts && associatedAccounts.length > 0 ? (
              <a
                className="card"
                href={`https://goerli.etherscan.io/address/${associatedAccounts[0].account}`}
                target="_blank"
              >
                <h3>Welcome back</h3>
                <p>{associatedAccounts[0].accountId}</p>
              </a>
            ) : (
              <EmailForm onSubmit={onUsernameSubmitted} />
            )}
            <Connected signer={signer} />
          </div>
        </div>
      </main>
    </div>
  );
}
