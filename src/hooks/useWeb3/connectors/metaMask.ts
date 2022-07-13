import Web3 from "web3";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import type { ConnectedReturnType } from "../../../utils/types";

/**
 * @returns the provider for MetaMask
 */
const initMetaMaskProvider = () =>
  // We will prefer a provider where the property `isMetaMask` is set to true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window.ethereum as any)?.providers?.find(
    (p: MetaMaskInpageProvider) => !!p.isMetaMask
  ) ?? window.ethereum;

/**
 * @returns `{ provider, web3, accounts }`
 */
export const connectMetaMask = async (): Promise<ConnectedReturnType> => {
  // Initializes the MetaMask provider using the provider at window.ethereum
  const provider = initMetaMaskProvider();
  // If the user selected MetaMask to connect
  // We make sure that the user has MetaMask installed in their browser
  if (!provider || !provider.isMetaMask || !window.ethereum) {
    // If they don't have MetaMask installed, we send them over to MetaMask
    // and we throw an error to reject the connection request
    window.open("https://metamask.io/download.html", "_blank");
    throw new Error("METAMASK EXTENSION IS NOT INSTALLED");
  }

  // We initialize the Web3 instance
  const web3 = new Web3(provider);
  // This opens the wallet provider prompt to connect to this dapp
  // If the user was already connected, they will not be prompted
  const accounts: string[] = await provider.request({
    method: "eth_requestAccounts",
  });

  return { provider, web3, accounts };
};
