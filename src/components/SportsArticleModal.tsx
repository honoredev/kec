import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SportsArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: any) => void;
  article?: any;
}

const SportsArticleModal = ({ isOpen, onClose, onSave, article }: SportsArticleModalProps) => {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    categoryId: '4', // Sports category ID
    excerpt: article?.excerpt || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key as keyof typeof formData]);
    });
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    
    try {
      const url = article ? 
        `https://kec-backend-1.onrender.com/api/articles/${article.id}` : 
        'https://kec-backend-1.onrender.com/api/articles';
      const method = article ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: submitData
      });
      
      if (response.ok) {
        const result = await response.json();
        onSave(result);
        onClose();
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-green-600">{article ? 'Edit Sports Article' : 'New Sports Article'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={6}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {article ? 'Update' : 'Create'} Sports Article
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SportsArticleModal;