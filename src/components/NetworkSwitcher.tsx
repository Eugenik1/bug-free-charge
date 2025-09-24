import { useState, useEffect } from "react";

interface NetworkSwitcherProps {
  onNetworkChange?: (network: string | null) => void;
}

const networks = [
  { name: "Ethereum Mainnet", chainId: "0x1" },
  { name: "Polygon", chainId: "0x89" },
  { name: "Arbitrum One", chainId: "0xa4b1" },
  { name: "Binance Smart Chain", chainId: "0x38" },
  { name: "Sepolia Testnet", chainId: "0xaa36a7" },
];

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  onNetworkChange,
}) => {
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!window.ethereum) {
        setError("MetaMask не установлен");
        return;
      }
      try {
        const chainId = (await window.ethereum.request({
          method: "eth_chainId",
        })) as string;
        setCurrentNetwork(chainId);
        onNetworkChange?.(chainId);
      } catch {
        setError("Не удалось получить сеть");
      }
    };

    fetchNetwork();

    const handleChainChanged = (...args: unknown[]) => {
      const chainId = args[0];
      if (typeof chainId === "string") {
        setCurrentNetwork(chainId);
        onNetworkChange?.(chainId);
      }
    };

    window.ethereum?.on?.("chainChanged", handleChainChanged);
    return () => {
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [onNetworkChange]);

  const switchNetwork = async (chainId: string) => {
    if (!window.ethereum) {
      setError("MetaMask не установлен");
      return;
    }

    if (chainId === "solana") {
      setError("Solana не поддерживается MetaMask");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      // мягкий релоуд: обновляем состояние вручную
      const newChainId = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;

      setCurrentNetwork(newChainId);
      onNetworkChange?.(newChainId);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Не удалось переключить сеть",
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Выберите сеть</h2>

      {error && (
        <p className="mb-4 p-2 rounded bg-red-100 text-red-700 border border-red-300">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3">
        {networks.map((network) => {
          const isActive = currentNetwork === network.chainId;
          return (
            <button
              key={network.chainId}
              onClick={() => switchNetwork(network.chainId)}
              className={`px-5 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
            >
              {network.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkSwitcher;
