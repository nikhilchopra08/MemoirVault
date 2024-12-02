import { useState, useEffect } from 'react';
import { getUserEntries, getDiaryEntry, setEntryPrivacy } from '../utils/web3';

function DiaryEntryList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const tokenIds = await getUserEntries();
      const entryPromises = tokenIds.map(async (tokenId) => {
        const entry = await getDiaryEntry(tokenId.toString());
        return {
          tokenId: tokenId.toString(),
          ipfsHash: entry.ipfsHash,
          timestamp: new Date(entry.timestamp * 1000).toLocaleString(),
          isPublic: entry.isPublic
        };
      });
      const entryDetails = await Promise.all(entryPromises);
      setEntries(entryDetails);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const togglePrivacy = async (tokenId, currentStatus) => {
    try {
      await setEntryPrivacy(tokenId, !currentStatus);
      await fetchEntries();
    } catch (error) {
      console.error("Failed to toggle privacy:", error);
      alert("Failed to update privacy settings. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading entries...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Diary Entries</h2>
      {entries.length === 0 ? (
        <p>No entries found. Create your first diary entry!</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.tokenId} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Entry #{entry.tokenId}</p>
                  <p className="text-sm text-gray-600">{entry.timestamp}</p>
                  <p className="mt-2">{entry.ipfsHash}</p>
                </div>
                <button
                  onClick={() => togglePrivacy(entry.tokenId, entry.isPublic)}
                  className={`${
                    entry.isPublic ? 'bg-yellow-500' : 'bg-gray-500'
                  } text-white px-3 py-1 rounded text-sm`}
                >
                  {entry.isPublic ? 'Public' : 'Private'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiaryEntryList;