import { memo } from "react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import type { ProviderStringType } from "../../utils/types";

type DisconnectedProps = {
  handleConnect: (selectedProvider: ProviderStringType) => Promise<void>;
};

export const Disconnected = memo(({ handleConnect }: DisconnectedProps) => {
  return (
    <div className="content">
      <p>Connect your wallet</p>
      <ConnectWalletButton
        providerString="coinbase"
        handleConnect={handleConnect}
        text="Coinbase Wallet"
      />
      <ConnectWalletButton
        providerString="metamask"
        handleConnect={handleConnect}
        text="MetaMask"
      />
      <ConnectWalletButton
        providerString="walletconnect"
        handleConnect={handleConnect}
        text="WalletConnect"
      />
    </div>
  );
});
