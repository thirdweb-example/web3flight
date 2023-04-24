import {
  ThirdwebNftMedia,
  ThirdwebSDKProvider,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";
import { useOwnedNFTs } from "@thirdweb-dev/react-core";
import { Signer } from "ethers";
import React from "react";
import { chain } from "./main";

interface ConnectedProps {
  signer: Signer | undefined;
}

const Connected: React.FC<ConnectedProps> = ({ signer }) => {
  return (
    <ThirdwebSDKProvider signer={signer} activeChain={chain}>
      <Claim />
    </ThirdwebSDKProvider>
  );
};

const Claim: React.FC = () => {
  const address = useAddress();
  const { contract: editionContract } = useContract(
    "0x408308c85D7073192deEAcC1703E234A783fFfF1"
  );
  const {
    mutateAsync: claimNFT,
    isLoading: nftClaimLoading,
    isSuccess: nftClaimSuccess,
  } = useClaimNFT(editionContract);
  const { data: nfts } = useOwnedNFTs(editionContract, address);
  return (
    <div className="grid">
      {address ? (
        <>
          <a
            href={`https://goerli.etherscan.io/address/${address}`}
            className="card"
            target="_blank"
          >
            <h2>Your onchain address &darr;</h2>
            <p>{address ? address : "Not logged in"}</p>
          </a>
          <a
            onClick={async () =>
              await claimNFT({
                tokenId: 0,
                quantity: 1,
              })
            }
            className="card"
          >
            <h2>Get your Boarding pass &darr;</h2>
            <p>
              {nftClaimLoading
                ? "Loading..."
                : nftClaimSuccess
                ? "Succesfully claimed!"
                : "Click to obtain your free web3 boarding pass"}
            </p>
          </a>
        </>
      ) : null}
      {nfts && nfts.length > 0 ? (
        <>
          <ThirdwebNftMedia metadata={nfts[0].metadata} />
          <p>{nfts[0].metadata.name}</p>
        </>
      ) : address ? (
        <p>You don't have a boarding pass yet</p>
      ) : null}
    </div>
  );
};

export default Connected;
