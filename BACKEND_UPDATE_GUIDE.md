# Backend Update Guide for Multiple Images

## Database Schema Update

Add a new column to your articles table to store multiple image URLs:

```sql
-- Add images column to articles table
ALTER TABLE articles ADD COLUMN images TEXT;
```

## Backend API Updates (Node.js/Express example)

### 1. Update Article Creation/Update Endpoint

```javascript
// Install multer for file uploads
npm install multer

// In your articles route file
const multer = require('multer');
const path = require('path');

// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/articles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'article-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Update your POST/PUT routes
app.post('/api/articles', upload.array('images', 10), async (req, res) => {
  try {
    const { title, content, categoryId, excerpt, sideCategories, existingImages } = req.body;
    
    // Handle new uploaded images
    const newImageUrls = req.files ? req.files.map(file => `/uploads/articles/${file.filename}`) : [];
    
    // Handle existing images (from edit mode)
    const existingImageUrls = existingImages ? JSON.parse(existingImages) : [];
    
    // Combine all images
    const allImages = [...existingImageUrls, ...newImageUrls];
    
    // Save to database
    const article = await db.query(
      'INSERT INTO articles (title, content, categoryId, excerpt, sideCategories, images, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, content, categoryId, excerpt, sideCategories, JSON.stringify(allImages), allImages[0] || null]
    );
    
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/articles/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, excerpt, sideCategories, existingImages } = req.body;
    
    // Handle new uploaded images
    const newImageUrls = req.files ? req.files.map(file => `/uploads/articles/${file.filename}`) : [];
    
    // Handle existing images
    const existingImageUrls = existingImages ? JSON.parse(existingImages) : [];
    
    // Combine all images
    const allImages = [...existingImageUrls, ...newImageUrls];
    
    // Update database
    await db.query(
      'UPDATE articles SET title = ?, content = ?, categoryId = ?, excerpt = ?, sideCategories = ?, images = ?, imageUrl = ? WHERE id = ?',
      [title, content, categoryId, excerpt, sideCategories, JSON.stringify(allImages), allImages[0] || null, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Update Article Retrieval

```javascript
// Update your GET routes to parse images JSON
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
    
    if (article.length > 0) {
      // Parse images JSON string back to array
      if (article[0].images) {
        article[0].images = JSON.parse(article[0].images);
      }
      res.json(article[0]);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await db.query('SELECT * FROM articles ORDER BY createdAt DESC');
    
    // Parse images for all articles
    const articlesWithImages = articles.map(article => ({
      ...article,
      images: article.images ? JSON.parse(article.images) : []
    }));
    
    res.json({ articles: articlesWithImages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Serve Static Files

```javascript
// Serve uploaded images
app.use('/uploads', express.static('uploads'));
```

### 4. Create Upload Directory

```bash
mkdir -p uploads/articles
```

## Frontend Changes Made

✅ **ArticleModal.tsx**: 
- Added multiple file upload input
- Added image preview grid
- Added sample article display
- Updated form submission to handle multiple images

✅ **ArticleDetail.tsx**:
- Updated to display multiple images in responsive grid
- Fallback to single image if multiple not available
- Added image counter overlay

## Testing

1. Create/edit an article and upload multiple images
2. Check the preview grid shows all images
3. Save the article and view it to see the grid layout
4. Verify images are properly stored and retrieved

## Notes

- Images are stored as JSON array in database
- First image is used as main `imageUrl` for backward compatibility
- Maximum 10 images per article (configurable)
- 5MB file size limit per image (configurable)
- Only image files are accepted