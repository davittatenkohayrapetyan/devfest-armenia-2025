# Google Photos Album Integration

This document describes how to set up a Google Apps Script proxy to fetch photos from a Google Photos shared album for the DevFest Armenia website.

## Overview

The photo gallery on the DevFest Armenia website fetches images from a Google Photos shared album via a proxy endpoint. This proxy is necessary to:

1. Enable CORS (Cross-Origin Resource Sharing) for the website to fetch photos
2. Transform the Google Photos API response into a format expected by the gallery
3. Control which photos are displayed and their metadata

## Setting Up the Google Apps Script Proxy

### Prerequisites

- Access to Google Apps Script (https://script.google.com)
- A Google Photos shared album (e.g., https://photos.app.goo.gl/KbeAMmggDhFcuxCe7)
- Google Photos Library API enabled for your project

### Step 1: Create a New Google Apps Script Project

1. Go to https://script.google.com
2. Click "New project"
3. Name your project (e.g., "DevFest Photos Proxy")

### Step 2: Enable the Photos Library API

1. In your Apps Script project, click on "Services" (+ icon on the left sidebar)
2. Find "Photos Library API" in the list
3. Click "Add" to enable the Advanced Service
4. Set the identifier to `PhotosLibrary`

### Step 3: Add the Proxy Code

Replace the default code with the following:

```javascript
/**
 * Google Apps Script Proxy for Google Photos Album
 * Fetches photos from a shared Google Photos album and returns them in a format
 * suitable for the DevFest Armenia photo gallery.
 */

// Configuration
const ALBUM_URL = 'https://photos.app.goo.gl/KbeAMmggDhFcuxCe7';
const ALBUM_ID = extractAlbumId(ALBUM_URL);
const MAX_PHOTOS = 50; // Maximum number of photos to return

/**
 * Extract album ID from Google Photos share URL
 */
function extractAlbumId(url) {
  // For shared albums, we need to use the shareToken approach
  // This is a simplified version - you may need to adjust based on your album
  const match = url.match(/\/([A-Za-z0-9_-]+)$/);
  return match ? match[1] : null;
}

/**
 * Main handler for GET requests
 */
function doGet(e) {
  try {
    const photos = fetchPhotosFromAlbum(ALBUM_ID);
    const response = {
      items: photos,
      nextPageToken: null // Can be implemented for pagination
    };
    
    return createCorsResponse(JSON.stringify(response));
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createCorsResponse(JSON.stringify({
      error: error.toString(),
      items: []
    }), 500);
  }
}

/**
 * Fetch photos from the album using Photos Library API
 */
function fetchPhotosFromAlbum(albumId) {
  try {
    // List media items from the album
    const response = PhotosLibrary.MediaItems.search({
      albumId: albumId,
      pageSize: MAX_PHOTOS
    });
    
    if (!response.mediaItems) {
      return [];
    }
    
    // Transform to our expected format
    return response.mediaItems.map((item, index) => ({
      id: item.id,
      src: `${item.baseUrl}=w1920-h1080`, // Request 1920x1080 for 16:9 aspect ratio
      width: parseInt(item.mediaMetadata.width) || 1920,
      height: parseInt(item.mediaMetadata.height) || 1080,
      alt: item.description || `Photo ${index + 1} from DevFest Armenia 2025`,
      caption: item.description || null
    }));
  } catch (error) {
    Logger.log('Error fetching photos: ' + error.toString());
    return [];
  }
}

/**
 * Create a CORS-enabled response
 */
function createCorsResponse(content, status = 200) {
  const output = ContentService.createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON);
  
  return output;
}

/**
 * Handle OPTIONS request for CORS preflight
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### Step 4: Configure OAuth Scopes

Add the following to the top of your script to ensure proper OAuth scopes:

```javascript
/**
 * @OnlyCurrentDoc
 */

// Required OAuth scopes
const SCOPES = [
  'https://www.googleapis.com/auth/photoslibrary.readonly'
];
```

### Step 5: Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Select "Web app" as the type
3. Configure:
   - Description: "DevFest Photos API"
   - Execute as: "Me"
   - Who has access: "Anyone" (or "Anyone with the link")
4. Click "Deploy"
5. Authorize the script when prompted
6. Copy the Web App URL (this is your `VITE_GOOGLE_PHOTOS_FEED_URL`)

### Step 6: Test the Proxy

Open the Web App URL in your browser. You should see a JSON response like:

```json
{
  "items": [
    {
      "id": "...",
      "src": "https://...",
      "width": 1920,
      "height": 1080,
      "alt": "Photo 1 from DevFest Armenia 2025",
      "caption": null
    }
  ],
  "nextPageToken": null
}
```

## Configuration in the Website

### Environment Variable

Add the proxy URL to your `.env` file:

```bash
VITE_GOOGLE_PHOTOS_FEED_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Build Configuration

The photo gallery will automatically use this URL to fetch photos. If the URL is not set or fails, it will fall back to showing an iframe embed of the album.

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Ensure the script is deployed with "Who has access" set to "Anyone"
2. Check that the `createCorsResponse` function includes the proper headers
3. Verify the request is using the correct HTTP method (GET)

### No Photos Returned

If the API returns an empty array:

1. Check that the album ID is correct
2. Verify the Photos Library API is enabled
3. Ensure the script has been authorized with the correct OAuth scopes
4. Check the Apps Script execution logs for errors

### Rate Limiting

Google Apps Script has quotas and rate limits:

- Free tier: 20,000 URL Fetch calls per day
- Consider caching responses if you expect high traffic

## Maintenance

### Updating Photos

Photos in the Google Photos album will automatically appear in the gallery after:

1. Being added to the album
2. The cache expires (if caching is implemented)
3. The page is refreshed

### Security

- The proxy only exposes photos from the specified album
- No authentication is required for public shared albums
- Consider implementing rate limiting if needed

## Alternative: Direct Album Embed

If the proxy approach doesn't work, the website will automatically fall back to showing an iframe embed of the album. This is less feature-rich but requires no server-side setup.

## Resources

- [Google Photos Library API Documentation](https://developers.google.com/photos/library/guides/overview)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Apps Script Advanced Services](https://developers.google.com/apps-script/guides/services/advanced)
