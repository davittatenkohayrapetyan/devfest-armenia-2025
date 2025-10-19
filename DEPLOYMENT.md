# Deployment Guide

## WordPress Deployment

This guide explains how to deploy the DevFest Armenia 2025 site to a WordPress installation.

### Building for Production

The project is pre-configured to build for the `/devfest2025/` subfolder deployment:

```bash
npm run build
```

All files will be generated in the `/dist` directory.

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to WordPress:**
   Upload all files from the `/dist` directory to your WordPress installation. The recommended location is:
   ```
   /wp-content/devfest2025/
   ```
   
   Or any other location under your WordPress installation, such as:
   ```
   /wp-content/uploads/devfest2025/
   /wp-content/themes/your-theme/devfest2025/
   ```

3. **Access the site:**
   The site will be accessible at:
   ```
   https://yourdomain.com/devfest2025/
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

1. ✅ The site loads correctly at the configured URL
2. ✅ All navigation links work
3. ✅ Sessionize embeds load (check Agenda, Sessions, Speakers, Wall sections)
4. ✅ Partner logos display correctly
5. ✅ Organizers section shows GDG Yerevan information
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
- Verify the base path matches the actual deployment location
- Check that all files from `/dist` were uploaded correctly
- Ensure the web server can serve static files from the upload location

**Issue: PWA not working**
- Verify the manifest.webmanifest file is accessible
- Check that the service worker (sw.js) is accessible
- Ensure the base path is correctly configured in manifest and service worker

**Issue: Sessionize embeds not showing**
- Verify the Sessionize event ID is correct
- Check browser console for any errors
- Ensure Sessionize scripts are not blocked by ad blockers or privacy extensions

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
- Sessionize content is cached for 24 hours

### Support

For issues or questions about deployment:
1. Check the [README.md](README.md) for general information
2. Review this deployment guide
3. Check browser console for errors
4. Verify all configuration settings match your deployment environment
