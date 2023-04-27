import { Goerli } from "@thirdweb-dev/chains";
import { useEffect, useState } from "react";
import EmailForm from "./email-form";
import "./styles/Home.css";
import { Signer, utils } from "ethers";
import Connected from "./connected";
import {
  EVMWallet,
  getAssociatedAccounts,
  isAccountIdAvailable,
  SmartWallet,
  LocalWallet,
} from "@thirdweb-dev/wallets";
import { chain, factoryAddress } from "./main";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { decode } from "./lib/cbor-decode.js";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Home() {
  const [pw, setPw] = useState<EVMWallet | null>(null);
  const [associatedAccounts, setAssociatedAccounts] = useState<Record<
    string,
    any
  > | null>(null);
  const [signer, setSigner] = useState<Signer>();

  // useEffect(() => {
  //   const initDeviceWallet = async () => {
  //     const pw = new LocalWallet({
  //       chain: Goerli,
  //     });
  //     await pw.loadOrCreate({
  //       strategy: "encryptedJson",
  //       password: "web3flight",
  //     });
  //     console.log("device wallet connected", await pw.getAddress());
  //     return pw;
  //   };
  //   initDeviceWallet()
  //     .then((pw) => setPw(pw))
  //     .catch(console.error);
  // }, []);

  // useEffect(() => {
  //   if (!pw) return;
  //   getAssociatedAccounts(pw, factoryAddress, chain).then((accounts) => {
  //     setAssociatedAccounts(accounts);
  //     console.log("associated accounts", accounts);
  //     if (accounts.length > 0) {
  //       onUsernameSubmitted(accounts[0].accountId, false);
  //     }
  //   });
  // }, [pw]);

  const createPasskey = async () => {
    // if (!("TextEncoder" in window)) {
    //   console.log("Sorry, this browser does not support TextEncoder...");
    //   return;
    // }
    //const encoder = new TextEncoder();
    const challengeBufferString = "grehttjujkiklolkikjujhyhgtgfrfde";
    const userId = "joaquim";

    const challengeBuffer = Uint8Array.from(
      challengeBufferString as string,
      (c) => c.charCodeAt(0)
    );

    const userIdBuffer = Uint8Array.from(userId, (c) => c.charCodeAt(0));
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
      {
        challenge: challengeBuffer,
        rp: {
          name: "web3flight",
          // id: "127.0.0.1",
        },
        user: {
          id: userIdBuffer,
          name: "john78",
          displayName: "John",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        // excludeCredentials: [
        //   {
        //     id: encoder.encode("user-id"),
        //     type: "public-key",
        //     transports: ["internal"],
        //   },
        // ],
        // authenticatorSelection: {
        //   authenticatorAttachment: "platform",
        //   requireResidentKey: true,
        // },
      };

    console.log(
      "publicKeyCredentialCreationOptions",
      publicKeyCredentialCreationOptions
    );

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    console.log("credential", credential);

    // Encode and send the credential to the server for verification.
  };

  const createPasskey2 = async () => {
    const resp = await startRegistration({
      challenge: "grehttjujkiklolkikjujhyhgtgfrfde",
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      rp: {
        name: "web3flight",
      },
      user: {
        id: "joaquim",
        name: "john78",
        displayName: "John",
      },
      extensions: {},
    });
    console.log("resp", resp);
  };

  const connectPasskey = async () => {
    const resp = await startAuthentication({
      challenge: "grehttjujkiklolkikjujhyhgtgfrfde",
    });
    console.log("resp", resp);
    // const clientDataHash = await toHash(isoBase64URL.toBuffer(assertionResponse.clientDataJSON));
    // const signatureBase = isoUint8Array.concat([authDataBuffer, clientDataHash]);

    // const signature = isoBase64URL.toBuffer(assertionResponse.signature);
    const authData = utils.toUtf8Bytes(resp.response.authenticatorData);
    const clientJSONHash = utils.toUtf8Bytes(resp.response.clientDataJSON);
    const messageHashBytes = concat([authData, clientJSONHash]);
    // Uint8Array.resp.response.authenticatorData + resp.response.clientDataJSON;
    const signature = decodeECDSASignature(resp.response.signature);
    console.log("signature", signature);
    // const messageHash = utils.hashMessage(message);
    // const messageHashBytes = utils.arrayify(messageHash);
    const recoveredAddress = utils.recoverAddress(messageHashBytes, signature);
    console.log("recoveredAddress", recoveredAddress);
  };

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
      thirdwebApiKey: "12314343", // TODO
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
        <button onClick={createPasskey2}>Create Passkey</button>
        <button onClick={connectPasskey}>Connect Passkey</button>
        <ConnectWallet
          dropdownPosition={{
            align: "center",
            side: "bottom",
          }}
        />
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

function concat(arrays: Uint8Array[]): Uint8Array {
  let pointer = 0;
  const totalLength = arrays.reduce((prev, curr) => prev + curr.length, 0);

  const toReturn = new Uint8Array(totalLength);

  arrays.forEach((arr) => {
    toReturn.set(arr, pointer);
    pointer += arr.length;
  });

  return toReturn;
}

function hexToBytes(hex: string | number) {
  hex = hex.toString(16);
  if (!hex.startsWith("0x")) {
    hex = `0x${hex}`;
  }
  if (!isHexStrict(hex)) {
    throw new Error(`Given value "${hex}" is not a valid hex string.`);
  }
  hex = hex.replace(/^0x/i, "");
  const bytes: number[] = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  }
  return bytes;
}

/**
 * @internal
 * @param hex
 */
function isHexStrict(hex: string | number) {
  return (
    (typeof hex === "string" || typeof hex === "number") &&
    /^(-)?0x[0-9a-f]*$/i.test(hex.toString())
  );
}

// function decodeBase64Url(base64Url: string) {
//   // Replace '-' with '+' and '_' with '/'
//   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

//   // Decode the Base64 string
//   var binary = atob(base64);

//   // Convert the binary data to a hex string
//   var hex = "";
//   for (var i = 0; i < binary.length; i++) {
//     var byte = binary.charCodeAt(i);
//     hex += (byte >>> 4).toString(16);
//     hex += (byte & 0xf).toString(16);
//   }

//   return "0x" + hex;
// }

function decodeBase64Url(base64Url: string): Uint8Array {
  // Replace '-' with '+' and '_' with '/'
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  // Decode the Base64 string
  const binary = atob(base64);

  // Convert the binary data to a Uint8Array
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function decodeECDSASignature(signature: string): {
  r: string;
  s: string;
  v: number;
} {
  // Decode the signature from Base64Url to binary
  const binary = decodeBase64Url(signature);

  console.log("binary", binary);

  // Extract the r, s, and v values from the binary string
  const r = binary
    .slice(6, 38)
    .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  const s = binary
    .slice(38, 70)
    .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  const v = binary[70];

  return { r: "0x" + r, s: "0x" + s, v: v };
}
