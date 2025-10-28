import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Read data sources
const dataJsonPath = path.join(projectRoot, 'public', 'data.json')
const workshopsJsonPath = path.join(projectRoot, 'public', 'workshops.json')
const shareDir = path.join(projectRoot, 'public', 'share')

// Extract plain text from HTML content
function extractPlainText(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200)
}

// Extract speaker name from "Name - Position" format
function extractSpeakerName(speakerStr) {
  if (!speakerStr) return ''
  const parts = speakerStr.split(' - ')
  return parts[0] || speakerStr
}

// Generate HTML page with meta tags for social sharing
function generateSharePage(title, description, image, canonicalUrl, redirectUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - DevFest Armenia 2025</title>
  <meta name="description" content="${escapeHtml(description)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(title)} - DevFest Armenia 2025">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  <meta name="twitter:title" content="${escapeHtml(title)} - DevFest Armenia 2025">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  
  <!-- Redirect to main app -->
  <meta http-equiv="refresh" content="0; url=${escapeHtml(redirectUrl)}">
  <link rel="canonical" href="${escapeHtml(redirectUrl)}">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #4285F4, #34A853);
      color: white;
      text-align: center;
    }
    .container {
      max-width: 600px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    a {
      color: white;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p>Redirecting to <a href="${escapeHtml(redirectUrl)}">DevFest Armenia 2025</a>...</p>
    <script>
      window.location.href = "${redirectUrl.replace(/"/g, '\\"')}";
    </script>
  </div>
</body>
</html>`
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

async function generateSharePages() {
  console.log('Generating static share pages...')

  // Ensure share directory exists
  if (!fs.existsSync(shareDir)) {
    fs.mkdirSync(shareDir, { recursive: true })
  }

  // Determine base URL (default for local/GitHub Pages)
  const basePath = process.env.VITE_BASE_PATH || '/2025/'
  const baseUrl = process.env.VITE_BASE_URL || 'https://gdg.am'
  const fullBaseUrl = `${baseUrl}${basePath}`.replace(/\/+$/, '')

  // Load data
  const data = JSON.parse(fs.readFileSync(dataJsonPath, 'utf-8'))
  const workshops = JSON.parse(fs.readFileSync(workshopsJsonPath, 'utf-8'))

  let sessionCount = 0
  let speakerCount = 0
  let workshopCount = 0

  // Generate session pages
  const sessions = data.sessions || {}
  for (const [sessionId, session] of Object.entries(sessions)) {
    const speakerName = extractSpeakerName(session.speaker)
    const description = extractPlainText(session.content) || `${session.title} by ${speakerName} at DevFest Armenia 2025`
    const image = session.photo || `${baseUrl}/og-image.png`
    const canonicalUrl = `${fullBaseUrl}/share/session-${sessionId}.html`
    const redirectUrl = `${fullBaseUrl}/#session-${sessionId}`

    const html = generateSharePage(
      session.title,
      description,
      image,
      canonicalUrl,
      redirectUrl
    )

    const filePath = path.join(shareDir, `session-${sessionId}.html`)
    fs.writeFileSync(filePath, html)
    sessionCount++
  }

  // Generate speaker pages
  const speakers = data.speakers || {}
  for (const [speakerId, speaker] of Object.entries(speakers)) {
    const description = extractPlainText(speaker.content) || `Meet ${speaker.name}, ${speaker.position} at DevFest Armenia 2025`
    const image = speaker.photo || `${baseUrl}/og-image.png`
    const canonicalUrl = `${fullBaseUrl}/share/speaker-${speakerId}.html`
    const redirectUrl = `${fullBaseUrl}/#speaker-${speakerId}`

    const html = generateSharePage(
      speaker.name,
      description,
      image,
      canonicalUrl,
      redirectUrl
    )

    const filePath = path.join(shareDir, `speaker-${speakerId}.html`)
    fs.writeFileSync(filePath, html)
    speakerCount++
  }

  // Generate workshop pages
  const workshopsList = workshops || []
  for (const workshop of workshopsList) {
    const description = workshop.description.substring(0, 200) || `Join ${workshop.title} by ${workshop.speakerName} at DevFest Armenia 2025`
    const image = workshop.speakerImage.startsWith('http') 
      ? workshop.speakerImage 
      : `${fullBaseUrl}/${workshop.speakerImage}`
    const canonicalUrl = `${fullBaseUrl}/share/workshop-${workshop.id}.html`
    const redirectUrl = `${fullBaseUrl}/#workshop-${workshop.id}`

    const html = generateSharePage(
      workshop.title,
      description,
      image,
      canonicalUrl,
      redirectUrl
    )

    const filePath = path.join(shareDir, `workshop-${workshop.id}.html`)
    fs.writeFileSync(filePath, html)
    workshopCount++
  }

  console.log(`✅ Generated ${sessionCount} session pages`)
  console.log(`✅ Generated ${speakerCount} speaker pages`)
  console.log(`✅ Generated ${workshopCount} workshop pages`)
  console.log(`📁 All share pages saved to ${shareDir}`)
}

generateSharePages().catch((err) => {
  console.error('Error generating share pages:', err)
  process.exit(1)
})
