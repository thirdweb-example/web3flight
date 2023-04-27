import {
  ThirdwebNftMedia,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";
import { useConnectionStatus, useOwnedNFTs } from "@thirdweb-dev/react-core";
import React from "react";

export const Claim: React.FC = () => {
  const address = useAddress();
  const status = useConnectionStatus();
  const { contract: editionContract } = useContract(
    "0x408308c85D7073192deEAcC1703E234A783fFfF1"
  );
  const {
    mutateAsync: claimNFT,
    isLoading: nftClaimLoading,
    isSuccess: nftClaimSuccess,
  } = useClaimNFT(editionContract);
  const { data: nfts, isLoading: nftsLoading } = useOwnedNFTs(
    editionContract,
    address
  );
  return (
    <div className="grid">
      {status === "disconnected" ? (
        <p>Pick a username and fly with us!</p>
      ) : status === "connecting" ? (
        <p>Connecting...</p>
      ) : address ? (
        <>
          <a
            href={`https://goerli.etherscan.io/address/${address}`}
            className="card"
            target="_blank"
          >
            <h2>Your smart account address</h2>
            <p>{address ? address : "Not logged in"}</p>
          </a>
          <a
            onClick={async () => {
              if (!nftClaimLoading && !nftClaimSuccess) {
                await claimNFT({
                  tokenId: 0,
                  quantity: 1,
                });
              }
            }}
            className="card"
          >
            {nfts && nfts.length > 0 ? (
              <>
                <h2>web3 Boarding pass</h2>
                <ThirdwebNftMedia metadata={nfts[0].metadata} />
                <p>{nfts[0].metadata.name}</p>
              </>
            ) : address ? (
              nftClaimLoading || nftsLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <h2>Get your Boarding pass</h2>
                  <p>
                    {nftClaimSuccess
                      ? "Succesfully claimed!"
                      : "Click to obtain your free web3 boarding pass"}
                  </p>
                </>
              )
            ) : null}
          </a>
        </>
      ) : null}
    </div>
  );
};

export default Claim;
