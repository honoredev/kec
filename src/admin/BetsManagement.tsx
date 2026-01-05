import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';

export default function BetsManagement() {
  const navigate = useNavigate();
  const [bets, setBets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    options: [{ name: '', yesPercent: 50, noPercent: 50, yesVotes: 500, noVotes: 500, image: '' }],
    volume: '$0',
    status: 'active'
  });

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/bets');
      if (response.ok) {
        const data = await response.json();
        setBets(data.bets || []);
      }
    } catch (error) {
      console.error('Error fetching bets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://kec-backend-1.onrender.com/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchBets();
        setShowForm(false);
        setFormData({
          title: '',
          options: [{ name: '', yesPercent: 50, noPercent: 50, yesVotes: 500, noVotes: 500, image: '' }],
          volume: '$0',
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Error creating bet:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bet?')) return;
    try {
      const response = await fetch(`https://kec-backend-1.onrender.com/api/bets/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchBets();
      }
    } catch (error) {
      console.error('Error deleting bet:', error);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { name: '', yesPercent: 50, noPercent: 50, yesVotes: 500, noVotes: 500, image: '' }]
    });
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/dashboard')} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Manage Bets</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Add Bet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Bet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                <input
                  type="text"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="$1.5M"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <button type="button" onClick={addOption} className="text-indigo-600 text-sm">+ Add Option</button>
                </div>
                {formData.options.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-2">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => updateOption(index, 'name', e.target.value)}
                        placeholder="Option name"
                        className="border border-gray-300 rounded px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        value={option.image}
                        onChange={(e) => updateOption(index, 'image', e.target.value)}
                        placeholder="Image URL (optional)"
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    {formData.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-600 text-sm mt-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
                  Create Bet
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {bets.map((bet) => (
            <div key={bet.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{bet.title}</h3>
                  <div className="space-y-2">
                    {bet.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm">
                        {option.image && <img src={option.image} alt={option.name} className="w-8 h-8 rounded-full" />}
                        <span className="font-medium">{option.name}</span>
                        <span className="text-green-600">Yes: {option.yesPercent}%</span>
                        <span className="text-red-600">No: {option.noPercent}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Volume: {bet.volume} • Comments: {bet.comments}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(bet.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
