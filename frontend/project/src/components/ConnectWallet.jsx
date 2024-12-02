import { useState } from 'react';
import { connectWallet } from '../utils/web3';

function ConnectWallet({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const account = await connectWallet();
      onConnect(account);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}

export default ConnectWallet;