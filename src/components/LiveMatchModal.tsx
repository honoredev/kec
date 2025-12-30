import { useState, useEffect } from 'react';

interface LiveMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match?: any;
  onSave: (data: any) => void;
}

const LiveMatchModal = ({ isOpen, onClose, match, onSave }: LiveMatchModalProps) => {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    score: '',
    time: '',
    streamUrl: '',
    isActive: true
  });

  useEffect(() => {
    if (match) {
      setFormData({
        team1: match.team1 || '',
        team2: match.team2 || '',
        score: match.score || '',
        time: match.time || '',
        streamUrl: match.streamUrl || '',
        isActive: match.isActive ?? true
      });
    } else {
      setFormData({ team1: '', team2: '', score: '', time: '', streamUrl: '', isActive: true });
    }
  }, [match]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{match ? 'Edit' : 'Add'} Live Match</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Team 1</label>
            <input
              type="text"
              value={formData.team1}
              onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Team 2</label>
            <input
              type="text"
              value={formData.team2}
              onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Score</label>
            <input
              type="text"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 2-1"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 75'"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Stream URL</label>
            <input
              type="url"
              value={formData.streamUrl}
              onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveMatchModal;
