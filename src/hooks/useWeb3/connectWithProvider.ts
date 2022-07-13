import { connectCoinbaseWallet } from "./connectors/coinbaseWallet";
import { connectMetaMask } from "./connectors/metaMask";
import { connectWalletConnect } from "./connectors/walletConnect";
import type {
  ConnectedReturnType,
  ProviderStringType,
} from "../../utils/types";

/**
 * @param providerString 'coinbase', 'metamask', or 'walletconnect'
 * @returns `{ provider, web3, accounts }`
 *
 * This function only returns these values if the user successfully connects
 */
export const connectWithProvider = async (
  providerString: ProviderStringType
): Promise<ConnectedReturnType> => connectors[providerString]();

// An object where the key is a providerString
// and the value is the associated provider's connector function
const connectors: Record<
  ProviderStringType,
  () => Promise<ConnectedReturnType>
> = {
  coinbase: connectCoinbaseWallet,
  metamask: connectMetaMask,
  walletconnect: connectWalletConnect,
};
