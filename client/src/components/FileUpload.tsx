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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="file-upload-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="uploading-indicator">
            <p>Uploading...</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <p>{isDragActive 
              ? 'Drop the file here...' 
              : 'Drag & drop a file here, or click to select a file'}
            </p>
            <p className="file-note">The file will be deleted after 60 seconds</p>
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