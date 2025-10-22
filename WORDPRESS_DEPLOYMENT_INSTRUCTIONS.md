# WordPress File Manager Deployment Instructions

## Quick Start Guide for devfest.am/2025

This project is now configured to use **relative paths**, making it perfect for deployment via WordPress file manager plugin.

### Step-by-Step Deployment

1. **Build the project** (if not already done):
   ```bash
   npm install
   npm run build
   ```
   
   This creates a `dist/` folder with all static files.

2. **Upload to WordPress**:
   - Log into your WordPress admin panel
   - Navigate to your file manager plugin
   - Create or navigate to the `/2025/` directory in your WordPress installation
   - Upload **all contents** from the `dist/` folder to `/2025/`
   - Maintain the folder structure:
     ```
     /2025/
     ├── assets/           (folder with CSS and JS files)
     ├── partners/         (folder with partner logos)
     ├── organizers/       (folder with organizer photos)
     ├── index.html        (main file - replaces index.php if present)
     ├── manifest.webmanifest
     ├── registerSW.js
     ├── sw.js
     ├── workbox-*.js
     ├── *.png             (icons and images)
     ├── *.jpeg
     ├── *.avif
     ├── *.svg
     ├── favicon.ico
     ├── robots.txt
     └── sitemap.xml
     ```

3. **Access your site**:
   - Navigate to `https://devfest.am/2025/`
   - The site should load with all resources working correctly

### Why Relative Paths?

The site now uses relative paths (like `./assets/index-XXXXX.js` instead of `/devfest2025/assets/index-XXXXX.js`), which means:

✅ **Flexible deployment** - Works from any folder location  
✅ **No configuration needed** - Just upload and go  
✅ **WordPress friendly** - No .htaccess or server configuration required  
✅ **Portable** - Can move the folder later without rebuilding  

### File Sizes

Total size of all files: ~233 KB (compressed)

- CSS: ~17 KB
- JavaScript: ~28 KB  
- Images and assets: ~188 KB
- PWA files: ~23 KB

### Verification Checklist

After deployment, verify these items:

- [ ] Site loads at `https://devfest.am/2025/`
- [ ] All navigation links work (#about, #agenda, #sessions, #speakers, #location, #partners, #organizers)
- [ ] Partner logos display correctly (Woods Center, Ardy)
- [ ] Organizer photos display correctly (Davit, Vardan, Roland)
- [ ] GDG Yerevan logo appears
- [ ] Social media links work (Instagram, LinkedIn, Facebook)
- [ ] Registration button redirects to Meetup
- [ ] Browser console shows no errors
- [ ] Service worker registers successfully (optional, for PWA features)

### Troubleshooting

**Problem**: Images not loading  
**Solution**: Ensure the `partners/` and `organizers/` folders were uploaded with all their contents

**Problem**: CSS/JS not loading  
**Solution**: Ensure the `assets/` folder was uploaded with all files

**Problem**: 404 errors  
**Solution**: Check that folder permissions are correct (typically 755 for folders, 644 for files)

**Problem**: PWA not working  
**Solution**: This is optional - the site works fine without PWA. Ensure `manifest.webmanifest`, `sw.js`, and `registerSW.js` are accessible.

### Need to Move the Site?

Since all paths are relative, you can:
1. Simply move all files to a new folder location
2. No rebuild required
3. Access via the new URL

For example, if you later want to move from `/2025/` to `/archive/2025/`, just move the files - no changes needed!

### Support

For issues or questions:
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide
- Check [README.md](README.md) for project information
- Review browser console for specific error messages
