import { memo } from "react";
import type Web3 from "web3";
import type { ProviderStringType } from "../../utils/types";

type ConnectedProps = {
  web3: Web3;
  account: string;
  providerString: ProviderStringType | undefined;
  handleChangeProvider: () => void;
};

export const Connected = memo(
  ({ account, web3, providerString, handleChangeProvider }: ConnectedProps) => {
    return (
      <div className="content">
        <small>Selected account: {account}</small>
        <button type="button" onClick={() => signMessage({ web3, account })}>
          Sign Message
        </button>
        <button
          className="change-provider"
          type="button"
          onClick={handleChangeProvider}
        >
          Change Provider
        </button>
        <small>Connected via {providerString}</small>
      </div>
    );
  }
);

type SignMessageParams = { web3: Web3; account: string };

const signMessage = async ({ web3, account }: SignMessageParams) => {
  try {
    // This will send a request to the wallet provider to sign a message
    const signature = await web3.eth.personal.sign(
      "Example message",
      account,
      ""
    );
    // The signature is returned, do with it what you will
    console.info(signature);
  } catch (e) {
    // This error means that user canceled the signature request
    console.warn(e);
  }
};
