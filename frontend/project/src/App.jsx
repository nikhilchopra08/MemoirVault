import { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import DiaryEntryForm from './components/DiaryEntryForm';
import DiaryEntryList from './components/DiaryEntryList';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [key, setKey] = useState(0);

  const handleEntryCreated = () => {
    setKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Diary NFT</h1>
        
        {!account ? (
          <div className="flex justify-center">
            <ConnectWallet onConnect={setAccount} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-4">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <DiaryEntryForm onEntryCreated={handleEntryCreated} />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <DiaryEntryList key={key} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;