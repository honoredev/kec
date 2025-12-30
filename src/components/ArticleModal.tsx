import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: any) => void;
  article?: any;
}

const ArticleModal = ({ isOpen, onClose, onSave, article }: ArticleModalProps) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    categoryId: article?.categoryId || '',
    excerpt: article?.excerpt || '',
    sideCategories: article?.sideCategories || '',
    imageUrl: article?.imageUrl || '',
    leftColumnContent: article?.leftColumnContent || '',
    rightColumnContent: article?.rightColumnContent || ''
  });
  
  const [selectedSideCategories, setSelectedSideCategories] = useState<string[]>(
    article?.sideCategories ? article.sideCategories.split(',') : []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
          if (!formData.categoryId && data.categories?.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: String(data.categories[0].id) }));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);
  
  const handleSideCategoryChange = (category: string, checked: boolean) => {
    let updated = [...selectedSideCategories];
    if (checked) {
      updated.push(category);
    } else {
      updated = updated.filter(c => c !== category);
    }
    setSelectedSideCategories(updated);
    setFormData({...formData, sideCategories: updated.join(',')});
  };
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(article?.images || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key as keyof typeof formData]);
    });
    
    // Append multiple images
    imageFiles.forEach((file, index) => {
      submitData.append('images', file);
    });
    
    // Send existing images that weren't removed
    submitData.append('existingImages', JSON.stringify(existingImages));
    
    try {
      const url = article ? 
        `http://localhost:3000/api/articles/${article.id}` : 
        'http://localhost:3000/api/articles';
      const method = article ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: submitData
      });
      
      if (response.ok) {
        const result = await response.json();
        onSave(result);
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save article'}`);
        console.error('Server error:', errorData);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Network error: Could not connect to server');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#021b41]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{article ? 'Edit Article' : 'New Article'}</h2>
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
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          

          
          <div>
            <label className="block text-sm font-medium mb-2">Images (Multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImageFiles(files);
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {/* Preview Grid */}
            {(existingImages.length > 0 || imageFiles.length > 0) && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Image Preview Grid:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                  {/* Existing Images */}
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img 
                        src={img} 
                        alt={`Existing ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {/* New Images */}
                  {imageFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`New ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Sample Article Display */}
                <div className="mt-4 p-4 border rounded-lg bg-white">
                  <p className="text-sm font-medium mb-2">How it will appear in article:</p>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">{formData.title || 'Article Title'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...existingImages, ...imageFiles.map(f => URL.createObjectURL(f))].map((img, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={typeof img === 'string' ? img : img}
                            alt={`Article image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
            <label className="block text-sm font-medium mb-2">Content (Main)</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={4}
              required
            />
          </div>
          
          {/* Two Column Layout */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Two-Column Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Left Column Content</label>
                <Textarea
                  value={formData.leftColumnContent}
                  onChange={(e) => setFormData({...formData, leftColumnContent: e.target.value})}
                  rows={6}
                  placeholder="Enter content for left column..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Right Column Content</label>
                <Textarea
                  value={formData.rightColumnContent}
                  onChange={(e) => setFormData({...formData, rightColumnContent: e.target.value})}
                  rows={6}
                  placeholder="Enter content for right column..."
                />
              </div>
            </div>
          </div>
          
          {/* Two Column Layout Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Two-Column Layout Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Left Column</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Left Column Content</label>
                  <Textarea
                    value={formData.leftColumnContent}
                    onChange={(e) => setFormData({...formData, leftColumnContent: e.target.value})}
                    rows={6}
                    placeholder="Enter content for left column..."
                  />
                </div>
                
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Right Column</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Right Column Content</label>
                  <Textarea
                    value={formData.rightColumnContent}
                    onChange={(e) => setFormData({...formData, rightColumnContent: e.target.value})}
                    rows={6}
                    placeholder="Enter content for right column..."
                  />
                </div>
              </div>
            </div>
            
            {/* Preview */}
            {(formData.leftColumnContent || formData.rightColumnContent) && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <p className="text-sm font-medium mb-2">Two-Column Preview:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-2">Left Column</h5>
                    <p className="text-sm text-gray-600">{formData.leftColumnContent.substring(0, 150)}...</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Right Column</h5>
                    <p className="text-sm text-gray-600">{formData.rightColumnContent.substring(0, 150)}...</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Note: Images from the main image gallery will be randomly distributed throughout both columns.</p>
              </div>
            )}
          </div>
          
                    <div className="mt-2 border rounded-md p-4 bg-gray-50 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">Side categories</p>
              <p className="text-xs text-gray-500">
                Choose where else this story should appear.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {['latest', 'breaking', 'trending', 'main', 'didyouknow', 'culture', 'environment'].map((category) => (
                <label key={category} className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedSideCategories.includes(category)}
                    onChange={(e) => handleSideCategoryChange(category, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>
                    {category === 'latest' && 'Latest news'}
                    {category === 'breaking' && 'Breaking news'}
                    {category === 'trending' && 'Trending news'}
                    {category === 'main' && 'Main news'}
                    {category === 'didyouknow' && 'Did you know'}
                    {category === 'culture' && 'Culture'}
                    {category === 'environment' && 'Environment'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {article ? 'Update' : 'Create'} Article
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleModal;