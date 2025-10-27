# DevFest Armenia 2025

Single-page PWA for DevFest Armenia 2025 (December 20, Woods Center). Built with Vite, TypeScript, and Tailwind CSS.

## Features

- ✅ Progressive Web App (PWA) with offline support
- ✅ Responsive design with dark mode support
- ✅ Google DevFest/GDG branding and color scheme
- ✅ Comprehensive SEO and AEO optimization with JSON-LD structured data
- ✅ Environment-driven base path for flexible deployment
- ✅ Service worker with proper scope configuration
- ✅ Auto-generated sitemap and robots.txt with correct base URLs
- ✅ Relative paths for portability
- ✅ Docker deployment ready
- ✅ GitHub Actions CI/CD pipeline

## Sections

1. **Hero** - Event title, date, location, and call-to-action
2. **About** - Information about DevFest Armenia
3. **Agenda** - Schedule with Sessionize GridSmart embed
4. **Sessions** - Detailed sessions with Sessionize Sessions embed
5. **Workshops** - Hands-on workshop sessions (JSON-configurable)
6. **Speakers** - Speaker profiles with Sessionize Speakers embed
7. **Speaker Wall** - Speaker wall with Sessionize SpeakerWall embed
8. **Partners** - Partner logos grid (8 SVG placeholders)
9. **Organizers** - GDG Yerevan team members

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

Static files will be exported to the `/dist` directory, configured for deployment at `https://devfest.am/2025/`.

### Build with Custom Base Path

The default base path is set to `/2025/` in `vite.config.ts` for deployment at `devfest.am/2025`. To change it:

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

The build process automatically:
- Sets all asset paths relative to the base path
- Updates sitemap.xml with correct URLs
- Updates robots.txt with correct sitemap location
- Updates Open Graph and canonical URLs
- Updates JSON-LD structured data

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to devfest.am/2025.

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

### SEO and AEO

The site includes comprehensive SEO (Search Engine Optimization) and AEO (Answer Engine Optimization) features:

**SEO Features:**
- Semantic HTML5 structure
- Meta descriptions and keywords
- Open Graph tags for social media sharing
- Twitter Card tags
- Canonical URLs
- XML sitemap (auto-generated)
- Robots.txt (auto-generated)
- Alt text for all images
- Proper heading hierarchy

**AEO Features:**
- JSON-LD structured data using Schema.org Event schema
- Organization schema for GDG Yerevan
- Place schema for Woods Center location
- Offer schema for event registration
- Answer Engine friendly content structure

All SEO/AEO URLs are automatically updated based on the configured base path during build.

### Adding Partners/Organizers

**Partners Section:** Replace the SVG placeholder logos in the Partners section of `src/main.ts` with actual partner logos (SVG or PNG).

**Organizers Section:** The section is pre-configured with GDG Yerevan branding and 8 organizer placeholders. Update the names and roles in `src/main.ts`.

### Workshops Configuration

Workshops are configured through `public/workshops.json`. Each workshop includes:
- Title and description
- Speaker information and image
- Maximum number of participants
- Registration form URL (Google Forms)

For detailed configuration instructions, see [WORKSHOPS.md](WORKSHOPS.md).

### Updating Event Details

Edit `src/main.ts` to update event date, location, and other details.

## CI/CD

GitHub Actions workflow is configured to:
- Build the project on every push
- Create Docker image on main branch
- Upload build artifacts

## License

MIT
