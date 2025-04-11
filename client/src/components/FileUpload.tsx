import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface FileInfo {
  fileId: string;
  filename: string;
  url: string;
  expiresIn: number;
  uploadedAt: number;
}

interface FileUploadProps {
  setUploadedFile: (fileInfo: FileInfo) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setUploadedFile }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFile({
        ...response.data,
        uploadedAt: Date.now(),
      });
    } catch (err) {
      setError('Error uploading file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [setUploadedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxSize: 10485760, // 10MB in bytes
    multiple: false,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'text/*': [],
      'application/zip': [],
      'application/vnd.openxmlformats-officedocument.*': [],
      'application/msword': [],
    }
  });

  return (
    <div className="file-upload-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="uploading-indicator">
            <div className="spinner" />
            <p>Uploading your file...</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="upload-icon"
              aria-label="Upload icon"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>{isDragActive 
              ? 'Drop the file here...' 
              : 'Drag & drop a file here, or click to select a file'}
            </p>
            <p className="file-note">File will be deleted after 60 seconds • Max size: 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 