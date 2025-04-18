# BoomFile - Project Scope

## Project Overview

BoomFile is a web application that enables secure, temporary file sharing. Files uploaded to the platform are automatically deleted after 60 seconds, providing a clean, no-maintenance solution for sharing sensitive information. The application features a modern, responsive UI with real-time countdown functionality. The entire application will be hosted on Vercel.

## Technical Architecture

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Key Libraries**:
  - axios: For HTTP requests to the backend
  - react-dropzone: For drag-and-drop file uploads
  - typescript: For static type checking
- **Hosting**: Vercel (Static Site Hosting)

### Backend (Node.js + Express)
- **Framework**: Express 5 with TypeScript
- **Key Libraries**:
  - multer: For file upload handling and storage
  - cors: For cross-origin resource sharing
  - fs-extra: For enhanced file system operations
  - uuid: For generating unique identifiers for files
  - @vercel/blob: For file storage with auto-expiration
- **Hosting**: Vercel Serverless Functions

### Data Flow
1. User uploads a file via the drag-and-drop interface
2. File is sent to the server via a POST request to a Vercel serverless function
3. The function processes the file and uploads it to Vercel Blob Storage with a 60-second expiration
4. Function returns a direct URL to the file from Vercel Blob Storage
5. Client displays the URL and a countdown timer
6. File is automatically deleted by Vercel Blob when the expiration time is reached

## Component Structure

### Frontend Components
- **App**: Main application container and routing
- **FileUpload**: Handles file selection and upload, displaying upload progress
- **FileDisplay**: Displays uploaded file information, URL sharing options, and countdown timer

### Backend Components
- **Serverless API**: Vercel serverless functions handling API requests
- **Upload Handler**: Processes file uploads with Multer middleware
- **Vercel Blob Storage**: Handles file storage with automatic expiration

## API Endpoints

### Backend APIs (Vercel Serverless Functions)
- `POST /api/upload`: Accepts file uploads and returns file metadata including:
  - fileId: Unique identifier for the file
  - filename: Original filename
  - url: Direct URL to the file in Vercel Blob Storage
  - expiresIn: Time in seconds until the file is deleted

## File Lifecycle

1. **Upload**: User selects or drags a file into the upload area
2. **Processing**: File is uploaded to Vercel serverless function and assigned a unique ID
3. **Storage**: File is stored in Vercel Blob Storage with a 60-second expiration time
4. **Availability**: File is available for download via the direct Vercel Blob URL
5. **Countdown**: A 60-second countdown begins immediately after upload
6. **Deletion**: File is automatically deleted by Vercel Blob when the expiration time is reached

## Security Considerations

- Files are stored temporarily (60 seconds maximum)
- Each file has a unique, randomly generated ID (UUID)
- No persistent storage of file data
- Server-side validation to prevent malicious uploads
- Frontend validation for file selection
- Vercel's built-in security features and HTTPS
- Vercel Blob's secure storage with automatic expiration

## Deployment Requirements

### Vercel Configuration
- **Project Structure**: 
  - Frontend: Standard Create React App structure in root directory
  - Backend: Serverless functions in `/api` directory
- **Environment Variables**:
  - API URL configuration for production/development environments
  - Vercel Blob configuration variables
  - Other necessary configuration variables
- **Vercel Build Settings**:
  - Build command: `npm run build`
  - Output directory: `build`
  - Install command: `npm install`

### Storage Considerations
- **Blob Storage**: Using Vercel Blob for file storage with auto-expiration
- **File Size Restrictions**: Implement size limits (10MB limit)
- **Function Execution Time**: Consider Vercel's serverless function timeout limits (default 10s)

## Development Workflow

1. Local development:
   - Run frontend: `npm start`
   - Run backend locally with Vercel CLI: `vercel dev`
2. Deployment:
   - Connect repository to Vercel
   - Configure build settings
   - Deploy with `git push` or Vercel dashboard
3. Monitoring:
   - Use Vercel dashboard for logs and performance metrics

## Future Enhancements (Potential)

1. **Extended Expiry Options**: Allow users to set custom expiry times
2. **Password Protection**: Add option for password-protected files
3. **File Size Limits**: Implement configurable file size restrictions
4. **Multiple File Upload**: Support for uploading multiple files at once
5. **Admin Dashboard**: Monitor active files and system usage
6. **User Accounts**: Optional user registration for tracking file history
7. **Custom Branding**: White-label solution for businesses
8. **Edge Functions**: Migrate to Vercel Edge Functions for improved global performance

## Technical Debt & Limitations

1. No persistent storage of upload history
2. Limited to single file uploads
3. No file type restrictions or validation
4. Vercel serverless function limitations
5. No built-in monitoring or analytics beyond what Vercel provides
6. URLs are not customizable

## Conclusion

BoomFile provides a simple yet effective solution for secure, temporary file sharing. Its minimal approach to data retention (60-second lifespan) makes it particularly suitable for sharing sensitive information that shouldn't persist longer than needed for the recipient to access it. Vercel hosting provides a scalable, reliable platform with minimal DevOps overhead, enabling easy deployment and management of the application. 