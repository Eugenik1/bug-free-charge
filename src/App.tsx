import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import NetworkSwitcher from "./components/NetworkSwitcher";
import MintButton from "./components/MintButton";
import contractAbi from "./abi/contractAbi.json";
import type { Abi } from "viem";

function App() {
  const [account, setAccount] = useState<`0x${string}` | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);

  const contractAddress: `0x${string}` =
    "0xb4e798b539518fe5002195e9d77e7dd45dd4702d";

  const abi = contractAbi as Abi;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        🚀 Web3 Dashboard
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <ConnectWallet onAccountChange={setAccount} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <NetworkSwitcher onNetworkChange={setCurrentNetwork} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <MintButton
            contractAddress={contractAddress}
            account={account}
            currentNetwork={currentNetwork}
            abi={abi}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
