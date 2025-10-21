# Deployment Guide

## WordPress Deployment

This guide explains how to deploy the DevFest Armenia 2025 site to a WordPress installation using the file manager plugin.

### Building for Production

The project is pre-configured to build with relative paths (`./`) which works for any deployment location:

```bash
npm run build
```

All files will be generated in the `/dist` directory with relative URLs.

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to WordPress:**
   Upload all files from the `/dist` directory to your WordPress installation using the WordPress file manager plugin. You can deploy to any location, for example:
   ```
   /2025/                    (recommended for devfest.am/2025/)
   /wp-content/uploads/2025/
   /wp-content/devfest2025/
   ```
   
   Simply replace `index.php` with `index.html` and place all resources nearby in the folders.

3. **Access the site:**
   The site will be accessible at the URL where you uploaded it, for example:
   ```
   https://devfest.am/2025/
   ```
   
   Since all paths are relative, the site will work from any folder location.

### Custom Base Path

If you need absolute paths for a specific deployment, you can override the base path before building:

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

To deploy at the root of your domain with absolute paths:

```bash
VITE_BASE_PATH=/ npm run build
```

### Verifying Deployment

After deployment, verify:

1. ✅ The site loads correctly at the configured URL
2. ✅ All navigation links work (they use hash navigation, so they're relative)
3. ✅ All images and assets load correctly
4. ✅ Partner logos display correctly
5. ✅ Organizers section shows GDG Yerevan information with photos
6. ✅ PWA manifest is accessible (check browser DevTools)
7. ✅ Service worker registers successfully (check Console)

### Sessionize Configuration

The site includes Sessionize embeds for:
- **Agenda** (GridSmart view)
- **Sessions** (detailed session list)
- **Speakers** (speaker profiles)
- **Speaker Wall** (speaker wall display)

Current Sessionize event ID: `fep0017x`

To change the event ID, update the script URLs in `index.html` before building:
```html
<script type="text/javascript" src="https://sessionize.com/api/v2/YOUR-EVENT-ID/view/GridSmart"></script>
<script type="text/javascript" src="https://sessionize.com/api/v2/YOUR-EVENT-ID/view/Sessions"></script>
<script type="text/javascript" src="https://sessionize.com/api/v2/YOUR-EVENT-ID/view/Speakers"></script>
<script type="text/javascript" src="https://sessionize.com/api/v2/YOUR-EVENT-ID/view/SpeakerWall"></script>
```

### Troubleshooting

**Issue: Assets not loading (404 errors)**
- Verify that all files from `/dist` were uploaded correctly, maintaining the folder structure
- Check that the web server can serve static files from the upload location
- Ensure folder permissions allow reading files (typically 755 for folders, 644 for files)

**Issue: PWA not working**
- Verify the manifest.webmanifest file is accessible
- Check that the service worker (sw.js) is accessible
- Relative paths ensure PWA works from any location

**Issue: Images not showing**
- Ensure the `partners/` and `organizers/` folders were uploaded with all contents
- Check that image files have correct permissions (typically 644)

### File Structure

```
dist/
├── assets/               # JavaScript and CSS bundles
├── index.html           # Main HTML file
├── manifest.webmanifest # PWA manifest
├── sw.js                # Service worker
├── registerSW.js        # Service worker registration
├── workbox-*.js         # Workbox runtime
├── *.png                # Icons and images
├── robots.txt           # SEO robots file
└── sitemap.xml          # SEO sitemap
```

### Performance Tips

- All assets are optimized and minified
- Service worker provides offline support
- Fonts and external resources are cached
- All paths are relative, making deployment flexible and portable

### Important Notes

- The default build uses **relative paths** (`./`), which means the site will work from any folder location
- You can upload the contents of `/dist` to any directory in your WordPress installation
- The site works as static HTML/CSS/JS with no server-side dependencies
- All navigation uses hash-based routing (`#about`, `#agenda`, etc.)

### Support

For issues or questions about deployment:
1. Check the [README.md](README.md) for general information
2. Review this deployment guide
3. Check browser console for errors
4. Verify all configuration settings match your deployment environment
