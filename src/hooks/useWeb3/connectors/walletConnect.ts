import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_PROJECT_ID } from "../dappInfo";
import type { provider } from "web3-core";
import type { ConnectedReturnType } from "../../../utils/types";

/**
 * @returns the provider for WalletConnect
 */
const initWalletConnectProvider = () =>
  new WalletConnectProvider({
    infuraId: INFURA_PROJECT_ID,
  });

/**
 * @returns `{ provider, web3, accounts }`
 */
export const connectWalletConnect = async (): Promise<ConnectedReturnType> => {
  // We have to wrap the WalletConnect provider in a promise to handle
  // when the user declines the connection from their wallet application
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    // Initialize the WalletConnectProvider
    const provider = initWalletConnectProvider();
    // We initialize the Web3 instance
    const web3 = new Web3(provider as unknown as provider);

    // This controls whether or not we fire the 'disconnect' listener
    // This is because WalletConnect does not provide a removeEventListener
    // for the provider.connector.on('disconnect', ...) method
    let listen = true;
    const shouldCallListener = () => {
      return listen;
    };

    // If the user rejects connection from their provider, this listener
    // will catch the failure.
    const disconnectListener = () => {
      if (shouldCallListener()) reject();
    };

    // This starts the disconnect listener
    provider.connector.on("disconnect", disconnectListener);

    try {
      // This opens the wallet provider prompt to connect to this dapp
      // If the user was already connected, they will not be prompted
      const accounts = await provider.enable();
      // This tells the disconnect listener to not fire once the provider is enabled
      listen = false;

      // provider.connector.removeEventListener("disconnect", disconnectListener);
      // We return the ethereum wallet provider and web3 instance for the UI to
      // know the user is connected and ready to interact with the dapp
      resolve({ provider, web3, accounts });
    } catch {
      // If the user closes the WalletConnect modal, this will happen
      reject();
    }
  });
};
