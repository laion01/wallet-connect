import Web3 from "web3";
import { useCallback, useEffect, useState } from "react";
import { connectWithProvider } from "./connectWithProvider";
import type { EthereumProvider, ProviderStringType } from "../../utils/types";

// The localstorage key for the selected provider
// If defined, value is either 'coinbase', 'metamask', or 'walletconnect'
const LS_KEY = "web3-provider";

export const useWeb3 = () => {
  // This is the connected provider's Web3 Instance
  const [web3, setWeb3] = useState<Web3>();
  // This is the connected provider's ethereum provider
  const [provider, setProvider] = useState<EthereumProvider>();
  // This is the connected provider's active address
  const [account, setAccount] = useState<string>();
  // We set the providerString from the localstorage key
  // We use this to see if it was set during a previous session
  const [providerString, setProviderString] = useState<
    ProviderStringType | undefined
  >(window.localStorage.getItem(LS_KEY) as ProviderStringType);

  const changeProvider = useCallback(() => {
    // Removes localstorage key that defines the wallet provider
    localStorage.removeItem(LS_KEY);
    // Clear out web3 and ethereum state variables
    setProviderString(undefined);
    setProvider(undefined);
    setWeb3(undefined);
    setAccount(undefined);
  }, [provider]);

  const connectProvider = useCallback(
    // Accepts the user's wallet provider selection
    // Coinbase Wallet, MetaMask, or WalletConnect
    async (selectedProvider: ProviderStringType) => {
      try {
        const {
          provider: connectedProvider,
          web3: web3Instance,
          accounts,
        } = await connectWithProvider(selectedProvider);
        // Set the localstorage key with the selected wallet provider
        // 'coinbase', 'metamask', or 'walletconnect'
        // We will use this key to connect the user automatically
        localStorage.setItem(LS_KEY, selectedProvider);
        // set the web3, provider, and account state variables using the
        // resolved values from the connectWallet function
        setProviderString(selectedProvider);
        setProvider(connectedProvider);
        setWeb3(web3Instance);
        setAccount(accounts[0]);
      } catch {
        // If the user cancels the request to connect from the wallet provider
        console.warn("FAILED TO SIGN IN!");
        changeProvider();
      }
    },
    [changeProvider]
  );

  /**
   * Accounts Changed and MetaMask Disconnect Effect
   * ***********************************************
   * If the user is connected, we can listen to their wallet provider for
   * the accountsChanged event. This means the user changed their
   * active/selected wallet address while they were connected to the DAPP.
   */
  useEffect(() => {
    // I will use account/address interchangeably in these comments
    // This listener provides an array of address strings when it calls back
    const listener = (accounts: string[]): void => {
      if (!accounts.length) {
        // This only applies to MetaMask
        // When a user disconnects this dapp using MetaMask
        // The accountsChanged returns an empty array, so we disconnect them.
        changeProvider();
        return;
      }
      // Typically, it will only return an array with ONE address, so we get accounts[0]
      // We set the new active account to display it in the UI
      setAccount(accounts[0]);
    };
    // This listener emits when the user changes their account from their wallet provider
    provider?.on("accountsChanged", listener);
    return () => {
      // This cleans up the event listener
      provider?.removeListener("accountsChanged", listener);
    };
  }, [provider, changeProvider]);

  /**
   * WalletConnect Disconnect Effect
   * ************************************************
   * This only applies to WalletConnect
   * If the dapp is in an open browser tab when it is disconnected by the provider,
   * this will clear out the provider localstorage key so that the user won't
   * fall into the auto-connect flow.
   */
  useEffect(() => {
    const listener = () => {
      changeProvider();
    };
    // This listener emits when the user changes their account from their wallet provider
    provider?.on("disconnect", listener);
    return () => {
      // This cleans up the event listener
      provider?.removeListener("disconnect", listener);
    };
  }, [provider, changeProvider]);

  /**
   * Coinbase Wallet Disconnect Effect
   * ************************************************
   * This only applies to Coinbase Wallet
   * If the dapp is in an open browser tab when it is disconnected by the provider,
   * this will clear out the provider localstorage key so that when the
   * page automatically reloads, the user won't fall into the auto-connect flow.
   */
  useEffect(() => {
    // The listener function for the onbeforeunload event that lets us clean up
    // state when the user disconnects the dapp from their Coinbase Wallet
    const beforeUnloadListener = () => {
      if (
        !localStorage.getItem("-walletlink:https://www.walletlink.org:version")
      ) {
        localStorage.removeItem(LS_KEY);
      }
    };

    if (providerString !== "coinbase") {
      // If the providerString is not 'coinbase', we don't want to run this listener
      // If we did, the user would get put into a disconnected state regardless of
      // their active provider when Coinbase Wallet SDK reloads the page
      removeEventListener("beforeunload", beforeUnloadListener);
      return;
    }
    // We listen to the beforeunload event to clear the localstorage provider key
    // before the page has a chance to refresh
    addEventListener("beforeunload", beforeUnloadListener);

    return () => {
      // This cleans up the event listener
      removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, [providerString]);

  /**
   * Auto-Reconnect Effect
   *
   * If the user was connected, then closes the browser tab for this dapp or
   * reloads this tab, then this will put them back into a connected UI state.
   */
  useEffect(function autoReconnectEffect() {
    // Get the providerString from localStorage
    const providerString = window.localStorage.getItem(
      LS_KEY
    ) as ProviderStringType;
    // Set the providerString into react state
    setProviderString(providerString);

    // If there is no provider in localStorage, we can assume the user needs to connect
    // via the connect wallet buttons. Otherwise...
    if (providerString) {
      // We call connectProvider with the provider from localstorage
      connectProvider(providerString).catch(changeProvider);
      // If this request fails, the user will be disconnected
      // this should only happen if the user closes this dapp tab in the browser,
      // then disconnects from this dapp via their wallet provider,
      // then returns to this dapp
    }
  }, []);

  return {
    providerString,
    connectProvider,
    changeProvider,
    account,
    web3,
  };
};
