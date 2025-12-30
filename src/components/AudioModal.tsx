import { useState, useEffect } from 'react';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  audio?: any;
  onSave: (data: any) => void;
}

const AudioModal = ({ isOpen, onClose, audio, onSave }: AudioModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    audioUrl: '',
    duration: '',
    type: 'music',
    isActive: false
  });

  useEffect(() => {
    if (audio) {
      setFormData({
        title: audio.title || '',
        artist: audio.artist || '',
        audioUrl: audio.audioUrl || '',
        duration: audio.duration || '',
        type: audio.type || 'music',
        isActive: audio.isActive ?? false
      });
    } else {
      setFormData({ title: '', artist: '', audioUrl: '', duration: '', type: 'music', isActive: false });
    }
  }, [audio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{audio ? 'Edit' : 'Add'} Audio</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Artist</label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Audio URL</label>
            <input
              type="url"
              value={formData.audioUrl}
              onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 3:45"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="music">Music</option>
              <option value="news">News</option>
              <option value="podcast">Podcast</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium">Active (Show in player)</span>
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

export default AudioModal;
