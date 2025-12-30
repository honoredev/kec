import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (auction: any) => void;
  auction?: any;
}

const AuctionModal = ({ isOpen, onClose, onSave, auction }: AuctionModalProps) => {
  const [formData, setFormData] = useState({
    title: auction?.title || '',
    description: auction?.description || '',
    startingBid: auction?.startingBid || '',
    endTime: auction?.endTime || '',
    category: auction?.category || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{auction ? 'Edit Auction' : 'New Auction'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Starting Bid</label>
            <Input
              type="number"
              value={formData.startingBid}
              onChange={(e) => setFormData({...formData, startingBid: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {auction ? 'Update' : 'Create'} Auction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionModal;