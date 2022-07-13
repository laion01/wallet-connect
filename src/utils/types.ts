import type Web3 from "web3";
import type { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import type WalletConnectProvider from "@walletconnect/web3-provider";

export type EthereumProvider =
  | CoinbaseWalletProvider
  | MetaMaskInpageProvider
  | WalletConnectProvider;

// Our supported wallet providers are Coinbase Wallet, MetaMask, and WalletConnect
export type ProviderStringType = "coinbase" | "metamask" | "walletconnect";

/**
 * This represents the return type of the connectProvider function, which contains
 * @param provider the wallet provider object
 * @param web3 the web3 provider
 * @param accounts the accounts array
 */
export type ConnectedReturnType = {
  provider: EthereumProvider;
  web3: Web3;
  accounts: string[];
};
