# BoomFile

BoomFile is a simple file hosting web application that destroys uploaded files after 60 seconds. It provides a secure way to share files temporarily. The application is designed to run on Vercel's serverless platform.

## Features

- Drag and drop file uploads
- Automatic file deletion after 60 seconds
- File URL sharing with copy to clipboard functionality
- Countdown timer showing time until file deletion
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Vercel Serverless Functions
- **File Handling**: Temporary storage in Vercel's `/tmp` directory
- **Deployment**: Vercel Platform

## Project Structure

```
boomfile/
├── api/                # Vercel Serverless Functions
│   ├── files/          # File serving endpoint
│   └── upload.js       # File upload endpoint
├── client/             # React frontend
│   ├── public/         # Static files
│   └── src/            # React source code
│       ├── components/ # React components
│       └── ...
└── vercel.json         # Vercel configuration
```

## Setup and Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Vercel CLI (`npm install -g vercel`)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/NYTEMODEONLY/boomfile.git
   cd boomfile
   ```

2. Install dependencies:
   ```
   npm install
   cd client && npm install && cd ..
   ```

### Running Locally

Run the development server with Vercel CLI:
```
npm run dev
```

This will start the Vercel development server which handles both the React frontend and serverless functions.

### Deployment

Deploy to Vercel with a single command:
```
npm run deploy
```

Or manually deploy through the Vercel dashboard by connecting your GitHub repository.

## Usage

1. Open your browser and navigate to the deployed URL (or http://localhost:3000 locally)
2. Drag and drop a file or click to select a file to upload
3. After successful upload, you'll see a URL that can be shared
4. The file will be automatically deleted after 60 seconds
5. You can download the file or copy the URL to share with others

## Vercel Configuration

The application uses Vercel's serverless functions and routing configuration:

- The frontend is built from the `client` directory
- API routes are implemented as serverless functions
- Files are temporarily stored in Vercel's `/tmp` directory
- Automatic cleanup happens after 60 seconds

## License

MIT 