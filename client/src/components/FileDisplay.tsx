import { useState, useEffect } from 'react';

interface FileInfo {
  fileId: string;
  filename: string;
  url: string;
  expiresIn: number;
  uploadedAt: number;
}

interface FileDisplayProps {
  fileInfo: FileInfo;
  resetUpload: () => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ fileInfo, resetUpload }) => {
  const [timeLeft, setTimeLeft] = useState(fileInfo.expiresIn);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      resetUpload();
      return;
    }

    const elapsedTime = Math.floor((Date.now() - fileInfo.uploadedAt) / 1000);
    const remainingTime = Math.max(0, fileInfo.expiresIn - elapsedTime);
    setTimeLeft(remainingTime);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          resetUpload();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fileInfo, resetUpload, timeLeft]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fileInfo.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownload = () => {
    window.open(fileInfo.url, '_blank');
  };

  const formatTime = (seconds: number) => {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  return (
    <div className="file-display">
      <div className="file-info">
        <h2>File Uploaded!</h2>
        <p className="filename">{fileInfo.filename}</p>
        <p className="expiry-warning">
          This file will be deleted in <span className="countdown">{formatTime(timeLeft)}</span>
        </p>
        
        <div className="url-container">
          <input 
            type="text" 
            value={fileInfo.url} 
            readOnly 
            className="file-url" 
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button 
            type="button"
            className="copy-btn" 
            onClick={copyToClipboard}
          >
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
        
        <div className="action-buttons">
          <button 
            type="button"
            className="download-btn" 
            onClick={handleDownload}
          >
            Download File
          </button>
          <button 
            type="button"
            className="new-upload-btn" 
            onClick={resetUpload}
          >
            Upload Another File
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDisplay; 