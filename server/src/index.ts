import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'node:path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueId}${fileExtension}`);
  }
});

const upload = multer({ storage });

// Ensure uploads directory exists
fs.ensureDirSync('uploads');

// File upload route
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const fileId = path.basename(req.file.filename, path.extname(req.file.filename));
    const fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    
    // Schedule file deletion after 60 seconds
    setTimeout(() => {
      const filePath = path.join('uploads', req.file?.filename || '');
      if (req.file?.filename) {
        fs.remove(filePath)
          .then(() => console.log(`File deleted: ${filePath}`))
          .catch(err => console.error(`Error deleting file: ${filePath}`, err));
      }
    }, 60 * 1000);

    res.status(200).json({
      message: 'File uploaded successfully',
      fileId,
      filename: req.file.filename,
      url: fileUrl,
      expiresIn: 60 // seconds
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Route to serve files
app.get('/files/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
    return;
  }
  
  res.status(404).json({ error: 'File not found or expired' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Files will be deleted 60 seconds after upload');
}); 