import { useState } from "react";
import { createPublicClient, http, getAddress } from "viem";
import { mainnet } from "viem/chains";

interface ConnectWalletProps {
  onAccountChange?: (account: `0x${string}` | null) => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onAccountChange }) => {
  const [account, setAccount] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dappHost = "silver-tables-smash.loca.lt";
  const deepLink = `https://metamask.app.link/dapp/${dappHost}`;

  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  const connectWallet = async () => {
    if (isMobile && typeof window.ethereum === "undefined") {
      // 📱 На мобильном устройстве без MetaMask — перенаправляем
      window.location.href = deepLink;
      return;
    }

    if (!window.ethereum) {
      setError("MetaMask не установлен или недоступен");
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const userAddress = getAddress(accounts[0]) as `0x${string}`;
      setAccount(userAddress);
      onAccountChange?.(userAddress);

      const client = createPublicClient({
        chain: mainnet,
        transport: http(),
      });

      console.log("Клиент Ethereum готов:", client);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ошибка подключения кошелька",
      );
    }
  };

  return (
    <div className="p-4 text-center">
      <button
        onClick={connectWallet}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {account ? "Кошелёк подключён" : "Открыть MetaMask"}
      </button>

      {account && <p className="mt-2 text-green-600">Адрес: {account}</p>}
      {error && <p className="mt-2 text-red-600">Ошибка: {error}</p>}
    </div>
  );
};

export default ConnectWallet;
