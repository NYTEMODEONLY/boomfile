# BoomFile

BoomFile is a simple file hosting web application that destroys uploaded files after 60 seconds. It provides a secure way to share files temporarily.

## Features

- Drag and drop file uploads
- Automatic file deletion after 60 seconds
- File URL sharing with copy to clipboard functionality
- Countdown timer showing time until file deletion
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **File Handling**: Multer for uploads, fs-extra for file management

## Project Structure

```
boomfile/
├── client/            # React frontend
│   ├── public/        # Static files
│   └── src/           # React source code
│       ├── components/# React components
│       └── ...
└── server/            # Node.js backend
    ├── src/           # TypeScript source code
    ├── uploads/       # Temporary file storage (auto-cleaned)
    └── ...
```

## Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/boomfile.git
   cd boomfile
   ```

2. Install frontend dependencies:
   ```
   cd client
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../server
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```
   The server will run on http://localhost:5000

2. Start the frontend in a new terminal:
   ```
   cd client
   npm start
   ```
   The React app will run on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Drag and drop a file or click to select a file to upload
3. After successful upload, you'll see a URL that can be shared
4. The file will be automatically deleted after 60 seconds
5. You can download the file or copy the URL to share with others

## License

MIT 