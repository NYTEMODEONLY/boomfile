import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract filename from query params
    const { filename } = req.query;
    
    if (!filename) {
      return res.status(400).json({ error: 'No filename provided' });
    }

    // Get file path in temporary directory
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, filename);
    
    // Check if file exists
    const fileExists = await fs.pathExists(filePath);
    
    if (!fileExists) {
      return res.status(404).json({ error: 'File not found or expired' });
    }
    
    // Read file content
    const fileContent = await fs.readFile(filePath);
    
    // Set the appropriate content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream'; // Default
    
    // Map common extensions to content types
    const contentTypeMap = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.zip': 'application/zip',
    };
    
    if (contentTypeMap[ext]) {
      contentType = contentTypeMap[ext];
    }
    
    // Set content type and length headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileContent.length);
    
    // Suggest a filename for the download
    const originalFilename = path.basename(filename);
    res.setHeader('Content-Disposition', `inline; filename="${originalFilename}"`);
    
    // Send the file
    return res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(500).json({ error: 'Server error serving file' });
  }
}

export const config = {
  api: {
    responseLimit: '20mb', // Adjust based on your file size needs
  },
}; 