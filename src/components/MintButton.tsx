import React, { useState } from "react";
import type { Abi } from "viem";
import { encodeFunctionData } from "viem";

interface MintButtonProps {
  contractAddress: `0x${string}`;
  account: `0x${string}` | null;
  currentNetwork?: string | null;
  requiredChainIdHex?: string;
  abi: Abi;
}

const MintButton: React.FC<MintButtonProps> = ({
  contractAddress,
  account,
  currentNetwork,
  requiredChainIdHex,
  abi,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const handleMint = async () => {
    if (!window.ethereum) {
      setError("MetaMask не установлен");
      return;
    }
    if (!account) {
      setError("Сначала подключите кошелёк");
      return;
    }
    if (
      requiredChainIdHex &&
      currentNetwork?.toLowerCase() !== requiredChainIdHex.toLowerCase()
    ) {
      setError("Вы находитесь в другой сети. Сначала переключите сеть.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const data = encodeFunctionData({
        abi,
        functionName: "purchase",
        args: [BigInt(quantity)],
      });

      const tx = (await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: contractAddress,
            data,
          },
        ],
      })) as `0x${string}`;

      setTxHash(tx);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Минт не удался");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border px-2 py-1 rounded w-20"
      />

      <button
        onClick={handleMint}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Минтим..." : "Mint"}
      </button>

      {txHash && (
        <p className="mt-2 text-blue-600 break-all">
          ✅ Транзакция отправлена: {txHash}
        </p>
      )}
      {error && <p className="mt-2 text-red-600">Ошибка: {error}</p>}
    </div>
  );
};

export default MintButton;
