# Buzzbuddy API Service

This is a production-ready Express.js API server with optimized security, performance, and structured routing for handling social media, job search, and influencer search requests.

## Features

✅ **Security Enhancements** (Helmet, CORS, Rate Limiting)  
✅ **Performance Boost** (Compression enabled)  
✅ **Structured Routing** (Modular route handling)  
✅ **Logging** (Morgan for request logging)  
✅ **Global Error Handling**  

## Installation

1. Clone the repository

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and set the required environment variables:

   ```env
   PORT=5300
   ```

4. Start the server:

   ```sh
   npm run dev
   ```

## API Routes

### Social Media Routes
- `/social/instagram`
- `/social/facebook`
- `/social/youtube`
- `/social/tiktok`
- `/social/x`

### Job Search Routes
- `/jobs/linkedin`
- `/jobs/glassdoor`
- `/jobs/apollo`
- `/jobs/crunchbase`
- `/jobs/indeed`

### Other Routes
- `/influencerSearch` - Search influencers
- `/maps` - Retrieve map-related data
- `/db` - Database interactions

## Middleware
- **CORS**: Enables cross-origin requests
- **Helmet**: Secures HTTP headers
- **Compression**: Gzip compression for response optimization
- **Rate Limiting**: Prevents abuse (100 requests per 15 min per IP)
- **Morgan**: Logs HTTP requests in `combined` format

🚀 **Happy Coding!**

