import { useState } from 'react';
import { createDiaryEntry } from '../utils/web3';

function DiaryEntryForm({ onEntryCreated }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      // In a real app, you would encrypt the content and upload to IPFS first
      const ipfsHash = content; // This is just a placeholder
      await createDiaryEntry(ipfsHash);
      setContent('');
      onEntryCreated();
    } catch (error) {
      console.error("Failed to create diary entry:", error);
      alert("Failed to create diary entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your diary entry..."
          className="w-full h-32 p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        {isSubmitting ? "Creating..." : "Create Entry"}
      </button>
    </form>
  );
}

export default DiaryEntryForm;