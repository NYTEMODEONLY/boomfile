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
  const [isLinkHovered, setIsLinkHovered] = useState(false);

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

  // Calculate progress percentage for countdown timer
  const progressPercentage = (timeLeft / fileInfo.expiresIn) * 100;

  return (
    <div className="file-display">
      <div className="file-info">
        <div className="success-icon-container">
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="success-icon"
            aria-label="Success icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12l2 2 6-6"></path>
          </svg>
        </div>
        <h2>File Uploaded!</h2>
        <p className="filename">{fileInfo.filename}</p>
        
        <div className="countdown-container">
          <div className="countdown-ring">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="rgba(247, 37, 133, 0.1)" 
                strokeWidth="8" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="var(--secondary-color)" 
                strokeWidth="8" 
                strokeDasharray="251.3" 
                strokeDashoffset={251.3 - (251.3 * progressPercentage) / 100} 
                strokeLinecap="round"
                className="progress-ring"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="countdown-number">{timeLeft}</div>
          </div>
          <p className="expiry-warning">
            This file will be deleted in <span className="countdown">{formatTime(timeLeft)}</span>
          </p>
        </div>
        
        <div className="url-container">
          <div className="url-input-container" onMouseEnter={() => setIsLinkHovered(true)} onMouseLeave={() => setIsLinkHovered(false)}>
            <input 
              type="text" 
              value={fileInfo.url} 
              readOnly 
              className={`file-url ${isLinkHovered ? 'highlight' : ''}`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            {isLinkHovered && 
              <div className="url-hover-message">Click to select</div>
            }
          </div>
          <button 
            type="button"
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="copy-icon"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="copy-icon"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy URL
              </>
            )}
          </button>
        </div>
        
        <div className="action-buttons">
          <button 
            type="button"
            className="download-btn" 
            onClick={handleDownload}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="download-icon"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download File
          </button>
          <button 
            type="button"
            className="new-upload-btn" 
            onClick={resetUpload}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="upload-again-icon"
              aria-hidden="true"
            >
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9" />
              <polyline points="21 3 21 9 15 9" />
              <line x1="16" y1="7" x2="12" y2="3" />
            </svg>
            Upload Another File
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDisplay; 