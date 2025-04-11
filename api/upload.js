import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'node:path';
import { put } from '@vercel/blob';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper to process the upload
const processUpload = upload.single('file');

// Process the upload request as a Promise
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Process the file upload
    await runMiddleware(req, res, processUpload);

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate a unique filename
    const uniqueId = uuidv4();
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${uniqueId}${fileExtension}`;
    
    // Set expiration time - 60 seconds from now
    const expiresAt = new Date(Date.now() + 60 * 1000);
    
    // Upload to Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: req.file.mimetype,
      expiresAt
    });

    // Return success response
    return res.status(200).json({
      message: 'File uploaded successfully',
      fileId: uniqueId,
      filename: req.file.originalname,
      url: blob.url,
      expiresIn: 60 // seconds
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Server error during upload' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 