# DevFest Armenia 2025

Single-page PWA for DevFest Armenia 2025 (December 20, Woods Center). Built with Vite, TypeScript, and Tailwind CSS.

## Features

- ✅ Progressive Web App (PWA) with offline support
- ✅ Responsive design with dark mode support
- ✅ Google DevFest/GDG branding and color scheme
- ✅ SEO optimized with Open Graph tags
- ✅ Environment-driven base path for WordPress subfolder deployment
- ✅ Service worker with proper scope configuration
- ✅ Sitemap and robots.txt included
- ✅ Docker deployment ready
- ✅ GitHub Actions CI/CD pipeline

## Sections

1. **Hero** - Event title, date, location, and call-to-action
2. **About** - Information about DevFest Armenia
3. **Agenda** - Schedule with Sessionize GridSmart embed
4. **Sessions** - Detailed sessions with Sessionize Sessions embed
5. **Speakers** - Speaker profiles with Sessionize Speakers embed
6. **Speaker Wall** - Speaker wall with Sessionize SpeakerWall embed
7. **Partners** - Partner logos grid (8 SVG placeholders)
8. **Organizers** - GDG Yerevan team members

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173/

### Build for Production

```bash
npm run build
```

Static files will be exported to the `/dist` directory.

### Build with Custom Base Path

For WordPress subfolder deployment (default is `/devfest2025/`):

```bash
npm run build
```

The default base path is set to `/devfest2025/` in `vite.config.ts`. To change it, either:

1. Set the environment variable:
```bash
VITE_BASE_PATH=/your-path/ npm run build
```

2. Or create a `.env` file:
```env
VITE_BASE_PATH=/your-path/
```

For root deployment:
```bash
VITE_BASE_PATH=/ npm run build
```

### WordPress Deployment

The built files in `/dist` directory are ready for WordPress subfolder deployment:

1. Upload all files from `/dist` to your WordPress installation at `/wp-content/your-path/`
2. The app is configured to work at `/devfest2025/` by default
3. All asset paths, manifest, and service worker are correctly configured with the base path
4. Sessionize embeds will load automatically when the page is accessed

## Docker Deployment

Build the Docker image:

```bash
docker build -t devfest-armenia-2025 .
```

Run the container:

```bash
docker run -p 80:80 devfest-armenia-2025
```

## Customization

### Sessionize Integration

The app includes Sessionize embed scripts that automatically load the following widgets:

1. **GridSmart** - Smart grid view of the agenda (loads in #sessionize-grid-smart)
2. **Sessions** - Detailed session list (loads in #sessionize-sessions)
3. **Speakers** - Speaker profiles (loads in #sessionize-speakers)
4. **SpeakerWall** - Speaker wall display (loads in #sessionize-speaker-wall)

The Sessionize scripts are loaded at the bottom of `index.html` and styled to match the app theme in `src/style.css`.

Current Sessionize event ID: `fep0017x`

To change the event ID, update the script URLs in `index.html`.

### Adding Partners/Organizers

**Partners Section:** Replace the SVG placeholder logos in the Partners section of `src/main.ts` with actual partner logos (SVG or PNG).

**Organizers Section:** The section is pre-configured with GDG Yerevan branding and 8 organizer placeholders. Update the names and roles in `src/main.ts`.

### Updating Event Details

Edit `src/main.ts` to update event date, location, and other details.

## CI/CD

GitHub Actions workflow is configured to:
- Build the project on every push
- Create Docker image on main branch
- Upload build artifacts

## License

MIT
