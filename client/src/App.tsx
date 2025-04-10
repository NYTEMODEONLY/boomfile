import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileDisplay from './components/FileDisplay';
import './App.css';

interface FileInfo {
  fileId: string;
  filename: string;
  url: string;
  expiresIn: number;
  uploadedAt: number;
}

function App() {
  const [uploadedFile, setUploadedFile] = useState<FileInfo | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>BoomFile</h1>
        <p>Upload files that self-destruct after 60 seconds</p>
      </header>
      <main>
        {!uploadedFile ? (
          <FileUpload setUploadedFile={setUploadedFile} />
        ) : (
          <FileDisplay fileInfo={uploadedFile} resetUpload={() => setUploadedFile(null)} />
        )}
      </main>
      <footer>
        <p>Files are automatically deleted after 60 seconds</p>
      </footer>
    </div>
  );
}

export default App;
