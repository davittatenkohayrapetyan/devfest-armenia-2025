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
3. **Agenda** - Schedule with Sessionize embed placeholder
4. **Speakers** - Speaker profiles with placeholder
5. **Partners** - Partner logos and information
6. **Organizers** - Team behind the event

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

For WordPress subfolder deployment:

```bash
VITE_BASE_PATH=/devfest/ npm run build
```

Or create a `.env` file:

```env
VITE_BASE_PATH=/devfest/
```

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

To integrate Sessionize for agenda and speakers:

1. Add your Sessionize embed script to `src/main.ts` in the `#sessionize-embed` div
2. Update the speakers section with Sessionize speakers widget

### Adding Partners/Organizers

Replace the placeholder content in the Partners and Organizers sections with actual logos and information.

### Updating Event Details

Edit `src/main.ts` to update event date, location, and other details.

## CI/CD

GitHub Actions workflow is configured to:
- Build the project on every push
- Create Docker image on main branch
- Upload build artifacts

## License

MIT
