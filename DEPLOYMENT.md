# Deployment Guide

## Production Deployment to devfest.am/2025

This guide explains how to deploy the DevFest Armenia 2025 site to https://devfest.am/2025.

### Building for Production

The project is pre-configured to build for the `/2025/` subfolder deployment:

```bash
npm run build
```

All files will be generated in the `/dist` directory with all paths correctly set to work at `devfest.am/2025/`.

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to web server:**
   Upload all files from the `/dist` directory to your web server. The recommended location is:
   ```
   /var/www/devfest.am/2025/
   ```
   
   Or wherever your web root maps `/2025/` to.

3. **Access the site:**
   The site will be accessible at:
   ```
   https://devfest.am/2025/
   ```

### Custom Base Path

If you need to deploy to a different subfolder, update the base path before building:

**Option 1: Environment variable**
```bash
VITE_BASE_PATH=/your-path/ npm run build
```

**Option 2: Create a `.env` file**
```env
VITE_BASE_PATH=/your-path/
```

**Option 3: Edit `vite.config.ts` directly**
```typescript
const basePath = process.env.VITE_BASE_PATH || '/your-path/'
```

### Root Deployment

To deploy at the root of your domain:

```bash
VITE_BASE_PATH=/ npm run build
```

### Verifying Deployment

After deployment, verify:

1. ✅ The site loads correctly at https://devfest.am/2025/
2. ✅ All navigation links work
3. ✅ All images and assets load correctly
4. ✅ PWA manifest is accessible at https://devfest.am/2025/manifest.webmanifest
5. ✅ Service worker registers successfully (check Console)
6. ✅ Robots.txt is accessible at https://devfest.am/2025/robots.txt
7. ✅ Sitemap is accessible at https://devfest.am/2025/sitemap.xml
8. ✅ Open Graph meta tags work correctly (test with social media preview tools)

### SEO and AEO Features

The site includes comprehensive SEO and Answer Engine Optimization (AEO) features:

**SEO Features:**
- ✅ Semantic HTML structure
- ✅ Meta descriptions and keywords
- ✅ Open Graph tags for social media
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ Sitemap.xml (automatically updated with correct base path)
- ✅ Robots.txt (automatically updated with sitemap location)
- ✅ Alt text for all images
- ✅ Proper heading hierarchy

**AEO Features:**
- ✅ JSON-LD structured data for Event schema
- ✅ Organization schema for GDG Yerevan
- ✅ Location schema for Woods Center
- ✅ Offer schema for registration

The sitemap.xml and robots.txt files are automatically generated during build with the correct base path and URLs.

### Troubleshooting

**Issue: Assets not loading (404 errors)**
- Verify the base path matches the actual deployment location
- Check that all files from `/dist` were uploaded correctly
- Ensure the web server can serve static files from the upload location
- Verify the `<base>` tag in index.html has the correct href

**Issue: PWA not working**
- Verify the manifest.webmanifest file is accessible
- Check that the service worker (sw.js) is accessible
- Ensure the base path is correctly configured in manifest and service worker

**Issue: Sitemap not found by search engines**
- Verify robots.txt is accessible and contains correct sitemap URL
- Ensure sitemap.xml exists at the correct path
- Submit sitemap directly to Google Search Console

### File Structure

```
dist/
├── assets/               # JavaScript and CSS bundles (with hashed names)
├── organizers/          # Organizer photos
├── partners/            # Partner logos
├── index.html           # Main HTML file with <base> tag
├── manifest.webmanifest # PWA manifest with correct paths
├── sw.js                # Service worker
├── registerSW.js        # Service worker registration
├── workbox-*.js         # Workbox runtime
├── *.png                # Icons and images
├── *.avif               # Optimized images
├── robots.txt           # SEO robots file (auto-generated)
├── sitemap.xml          # SEO sitemap (auto-generated)
├── data.json            # Session and speaker data
└── workshops.json       # Workshop data
```

### Performance Tips

- All assets are optimized and minified
- Service worker provides offline support
- Fonts and external resources are cached
- Images use modern formats (AVIF) for better compression
- All paths are relative to the base path for portability

### Support

For issues or questions about deployment:
1. Check the [README.md](README.md) for general information
2. Review this deployment guide
3. Check browser console for errors
4. Verify all configuration settings match your deployment environment
5. Test the build locally using `npm run preview`
