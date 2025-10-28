import './style.css'
import { registerSW } from './registerSW'
import { parseExcelData, SessionData, SpeakerData, WorkshopData, loadWorkshops } from './data-parser'

// Register service worker
registerSW()

const app = document.querySelector<HTMLDivElement>('#app')!

// Social sharing functionality
interface ShareData {
  title: string
  text: string
  url: string
}

function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

async function shareContent(data: ShareData): Promise<void> {
  if (canUseWebShare()) {
    try {
      await navigator.share(data)
    } catch (err) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed:', err)
    }
  } else {
    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(data.url)
      showToast('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy link:', err)
      showToast('Failed to copy link')
    }
  }
}

function showToast(message: string): void {
  const existingToast = document.getElementById('share-toast')
  if (existingToast) {
    existingToast.remove()
  }

  const toast = document.createElement('div')
  toast.id = 'share-toast'
  toast.className = 'fixed bottom-4 right-4 bg-google-blue text-white px-6 py-3 rounded-lg shadow-lg z-[200] animate-fade-in'
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('animate-fade-out')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

function createShareButtons(title: string, description: string, url: string): string {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return `
    <div class="flex flex-wrap gap-3 items-center">
      <button 
        class="share-button inline-flex items-center gap-2 px-4 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        data-share-title="${title.replace(/"/g, '&quot;')}"
        data-share-text="${description.replace(/"/g, '&quot;')}"
        data-share-url="${url}"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Share
      </button>
      <a 
        href="https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        aria-label="Share on X"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </a>
      <a 
        href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        aria-label="Share on Facebook"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </a>
      <a 
        href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        aria-label="Share on LinkedIn"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </a>
    </div>
  `
}

// Dialog/Modal functionality
function createDialog(title: string, content: string): void {
  // Remove existing dialog if any
  const existingDialog = document.getElementById('modal-dialog')
  if (existingDialog) {
    existingDialog.remove()
  }

  // Create dialog element
  const dialog = document.createElement('div')
  dialog.id = 'modal-dialog'
  dialog.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4'
  dialog.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-google-blue">${title}</h2>
        <button id="close-dialog" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
      </div>
      <div class="px-6 py-6">
        ${content}
      </div>
    </div>
  `

  document.body.appendChild(dialog)

  // Close dialog on background click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.remove()
    }
  })

  // Close dialog on close button click
  const closeBtn = dialog.querySelector('#close-dialog')
  closeBtn?.addEventListener('click', () => {
    dialog.remove()
  })

  // Close dialog on escape key
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      dialog.remove()
      document.removeEventListener('keydown', escapeHandler)
    }
  }
  document.addEventListener('keydown', escapeHandler)
}

// Helper: extract speaker name from a combined "Name - Position" string
function extractSpeakerName(s: string): string {
  if (!s) return ''
  const [name] = s.split(' - ')
  return name || s
}

// Helper: map status to chip styles
function statusChip(status?: string): string {
  if (!status) return ''
  const normalized = status.toLowerCase()
  let cls = 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
  if (normalized.includes('accept')) cls = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  else if (normalized.includes('reject') || normalized.includes('declin')) cls = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  else if (normalized.includes('wait')) cls = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  return `<span class="px-3 py-1 ${cls} rounded-full text-sm font-medium">${status}</span>`
}

// Helper: truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Render Sessions from data.json into #sessions-container
function renderSessions(sessions: Record<string, SessionData>): void {
  const container = document.getElementById('sessions-container')
  if (!container) return

  const list = Object.values(sessions)
  if (list.length === 0) {
    container.innerHTML = `
      <div class="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p class="text-2xl font-semibold text-gray-600 dark:text-gray-400">TBA</p>
        <p class="text-lg text-gray-500 dark:text-gray-500 mt-4">The sessions will be announced soon. Stay tuned!</p>
      </div>
    `
    return
  }

  container.innerHTML = list
    .map((s) => {
      const cats = (s.categories || []).filter(Boolean)
      const catsHtml = cats
        .map(
          (c) =>
            `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">${c}</span>`
        )
        .join('')
      const statusHtml = statusChip((s as any).status)
      const speakerName = extractSpeakerName(s.speaker)
      const photo = s.photo || ''
      const alt = speakerName ? `${speakerName}` : `${s.title} speaker`
      const basePath = window.location.pathname.replace(/\/$/, '')
      const sessionUrl = `${window.location.origin}${basePath}/share/session-${s.sessionId}.html`
      const shareDescription = `Check out this session at DevFest Armenia 2025: ${s.title} by ${speakerName}`

      return `
        <div class="card" data-session="${s.sessionId}">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-shrink-0">
              <img src="${photo}" alt="${alt}" class="w-32 h-32 rounded-full object-cover" loading="lazy">
            </div>
            <div class="flex-1">
              <div class="cursor-pointer" data-session-click="${s.sessionId}">
                <h3 class="text-2xl font-bold mb-2 text-google-blue">${s.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span class="font-semibold">Speaker:</span> ${speakerName}
                </p>
                <div class="flex flex-wrap gap-2 mb-4">${statusHtml}${catsHtml}</div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  class="share-button inline-flex items-center gap-2 px-4 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  data-share-title="${s.title.replace(/"/g, '&quot;')}"
                  data-share-text="${shareDescription.replace(/"/g, '&quot;')}"
                  data-share-url="${sessionUrl}"
                  onclick="event.stopPropagation()"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  Share Session
                </button>
              </div>
            </div>
          </div>
        </div>
      `
    })
    .join('')
}

// Render Speakers from data.json into #speakers-grid
function renderSpeakers(speakers: Record<string, SpeakerData>): void {
  const grid = document.getElementById('speakers-grid')
  if (!grid) return

  const list = Object.values(speakers)
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg col-span-full">
        <p class="text-lg text-gray-600 dark:text-gray-400">Speakers will be announced soon.</p>
      </div>
    `
    return
  }

  grid.innerHTML = list
    .map((sp) => {
      const alt = sp.name || 'Speaker photo'
      const photo = sp.photo || ''
      const basePath = window.location.pathname.replace(/\/$/, '')
      const speakerUrl = `${window.location.origin}${basePath}/share/speaker-${sp.speakerId}.html`
      const shareDescription = `Meet ${sp.name}, ${sp.position} at DevFest Armenia 2025`

      return `
        <div class="card" data-speaker="${sp.speakerId}">
          <div class="flex flex-col items-center text-center">
            <div class="cursor-pointer w-full" data-speaker-click="${sp.speakerId}">
              <img src="${photo}" alt="${alt}" class="w-48 h-48 rounded-full object-cover mb-4 mx-auto" loading="lazy">
              <h3 class="text-xl font-bold mb-1">${sp.name}</h3>
              <p class="text-google-blue font-medium mb-3">${sp.position}</p>
            </div>
            <div class="mt-2 w-full flex justify-center">
              <button 
                class="share-button inline-flex items-center gap-2 px-4 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                data-share-title="${sp.name.replace(/"/g, '&quot;')}"
                data-share-text="${shareDescription.replace(/"/g, '&quot;')}"
                data-share-url="${speakerUrl}"
                onclick="event.stopPropagation()"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      `
    })
    .join('')
}

app.innerHTML = `
  <!-- Navigation -->
  <nav class="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <span class="text-2xl font-bold">
            <span class="text-google-blue">Dev</span><span class="text-google-red">Fest</span>
            <span class="text-google-yellow"> Armenia</span>
            <span class="text-google-green"> 2025</span>
          </span>
        </div>
        <div class="hidden md:flex items-center space-x-6">
          <a href="#about" class="hover:text-google-blue transition-colors">About</a>
          <a href="#agenda" class="hover:text-google-blue transition-colors">Agenda</a>
          <a href="#sessions" class="hover:text-google-blue transition-colors">Sessions</a>
          <a href="#workshops" class="hover:text-google-blue transition-colors">Workshops</a>
          <a href="#speakers" class="hover:text-google-blue transition-colors">Speakers</a>
          <a href="#location" class="hover:text-google-blue transition-colors">Location</a>
          <a href="#partners" class="hover:text-google-blue transition-colors">Partners</a>
          <a href="#organizers" class="hover:text-google-blue transition-colors">Organizers</a>
          <div class="flex items-center space-x-3">
            <a href="https://www.instagram.com/gdg_yerevan" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="hover:text-google-blue transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/72083329/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="hover:text-google-blue transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/gdgyerevan" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="hover:text-google-blue transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          <a href="https://www.meetup.com/gdgyerevan/events/311547893/?eventOrigin=group_upcoming_events" target="_blank" rel="noopener noreferrer" class="bg-google-blue hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 whitespace-nowrap">
            Register on Meetup
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-google-blue to-blue-600 text-white pt-16">
    <div class="section-container text-center">
      <h1 class="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 whitespace-nowrap">
        DevFest Armenia 2025
      </h1>
      <p class="text-2xl md:text-3xl mb-8">
        December 20, 2025 • Woods Center
      </p>
      <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
        Join us for a day of learning, networking, and celebrating technology with the Google Developer Group community.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://www.meetup.com/gdgyerevan/events/311547893/?eventOrigin=group_upcoming_events" target="_blank" rel="noopener noreferrer" class="bg-white text-google-blue hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg text-lg whitespace-nowrap">
          Register on Meetup
        </a>
        <a href="#agenda" class="border-2 border-white hover:bg-white hover:text-google-blue font-medium py-3 px-8 rounded-lg transition-colors duration-200">
          View Agenda
        </a>
        <a href="#speakers" class="border-2 border-white hover:bg-white hover:text-google-blue font-medium py-3 px-8 rounded-lg transition-colors duration-200">
          Meet Speakers
        </a>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">About DevFest Armenia</h2>
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-lg md:text-xl mb-6 leading-relaxed">
          DevFests are community-led developer events hosted by Google Developer Groups around the globe. 
          DevFest Armenia 2025 brings together developers, designers, and technology enthusiasts for a day 
          of learning about Google's latest technologies.
        </p>
        <p class="text-lg md:text-xl mb-8 leading-relaxed">
          Join us on December 20, 2025, at Woods Center for sessions covering Android, Web, Cloud, AI/ML, 
          and more. Network with fellow developers, learn from industry experts, and discover new opportunities 
          in technology.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="card">
            <div class="text-4xl mb-4">📅</div>
            <h3 class="text-xl font-bold mb-2">When</h3>
            <p>December 20, 2025</p>
          </div>
          <div class="card">
            <div class="text-4xl mb-4">📍</div>
            <h3 class="text-xl font-bold mb-2">Where</h3>
            <p>Woods Center</p>
          </div>
          <div class="card">
            <div class="text-4xl mb-4">👥</div>
            <h3 class="text-xl font-bold mb-2">Who</h3>
            <p>Developers & Tech Enthusiasts</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Agenda Section -->
  <section id="agenda" class="bg-white dark:bg-gray-900">
    <div class="section-container">
      <h2 class="section-title">Agenda</h2>
      <div class="max-w-6xl mx-auto">
        <div class="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-2xl font-semibold text-gray-600 dark:text-gray-400">TBA</p>
          <p class="text-lg text-gray-500 dark:text-gray-500 mt-4">The agenda will be announced soon. Stay tuned!</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Sessions Section -->
  <section id="sessions" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">Sessions</h2>
      <div class="max-w-6xl mx-auto">
        <div id="sessions-container" class="grid gap-8"></div>
      </div>
    </div>
  </section>

  <!-- Workshops Section -->
  <section id="workshops" class="bg-white dark:bg-gray-900">
    <div class="section-container">
      <h2 class="section-title">Workshops</h2>
      <div class="max-w-6xl mx-auto">
        <!-- Workshop Info Banner -->
        <div class="bg-gradient-to-r from-google-blue to-blue-600 text-white rounded-lg p-8 mb-12 shadow-xl">
          <h3 class="text-2xl font-bold mb-4">🎓 What to Expect from Our Workshops</h3>
          <div class="space-y-3 text-lg">
            <p>✨ <strong>Duration:</strong> All workshops will be 1 to 1.5 hours long</p>
            <p>🛠️ <strong>Hands-on Learning:</strong> Participants will receive practical, hands-on skills they can apply immediately</p>
            <p>☁️ <strong>Google Cloud Credits:</strong> Google will provide free Google Cloud credits to all workshop participants</p>
            <p>📋 <strong>What to Bring:</strong> Just your laptop and enthusiasm! Fill in the registration form by pressing "Enroll" button so the speaker can prepare the perfect session for you</p>
          </div>
        </div>
        
        <!-- Workshops Grid - will be populated dynamically -->
        <div id="workshops-grid" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Workshop cards will be inserted here -->
        </div>
      </div>
    </div>
  </section>

  <!-- Speakers Section -->
  <section id="speakers" class="bg-white dark:bg-gray-900">
    <div class="section-container">
      <h2 class="section-title">Speakers</h2>
      <div class="max-w-6xl mx-auto">
        <div id="speakers-grid" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </div>
  </section>

  <!-- Location Section -->
  <section id="location" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">Location</h2>
      <div class="max-w-6xl mx-auto">
        <div class="aspect-video md:aspect-auto md:h-[450px] w-full rounded-lg overflow-hidden shadow-lg">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.1462005956696!2d44.629329399999996!3d40.183559699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406aa5fb2d2aeb97%3A0x7a90e13129b8e750!2z1Y7VuNaC1aTVvSDUv9Wl1bbVv9aA1bjVtg!5e0!3m2!1shy!2sam!4v1760885439683!5m2!1shy!2sam" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Woods Center Location"></iframe>
        </div>
      </div>
    </div>
  </section>

  <!-- Partners Section -->
  <section id="partners" class="bg-white dark:bg-gray-900">
    <div class="section-container">
      <h2 class="section-title">Partners</h2>
      <div class="max-w-5xl mx-auto">
        <p class="text-center text-lg mb-12">
          Thank you to our amazing partners who make DevFest Armenia possible!
        </p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <a href="https://woodscenter.am/en" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/woods.svg" alt="Woods Center" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
          <a href="https://ardy.am/en" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/ardy.svg" alt="Ardy" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Organizers Section -->
  <section id="organizers" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">Organizers</h2>
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg mb-6">
            <img src="gdg-yerevan.avif" alt="GDG Yerevan logo" class="h-32 w-auto object-contain" loading="lazy"/>
          </div>
          <h3 class="text-2xl font-bold mb-4">GDG Yerevan</h3>
          <p class="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Google Developer Group Yerevan is a community of developers interested in Google technologies and open-source development. 
            We organize events, workshops, and meetups to share knowledge and connect developers in Armenia.
          </p>
        </div>
        
        <h3 class="text-xl font-bold text-center mb-8">Core Team</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <!-- Davit Hayrapetyan -->
          <a href="https://www.linkedin.com/in/davit-hayrapetyan-04377561/" target="_blank" rel="noopener noreferrer" class="card text-center hover:shadow-xl transition-shadow">
            <img src="organizers/Davit.jpeg" alt="Portrait of Davit Hayrapetyan" loading="lazy" width="128" height="128" class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md ring-4 ring-white dark:ring-gray-900" />
            <h3 class="font-bold text-lg">Davit Hayrapetyan</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Organizer</p>
            <div class="flex items-center justify-center text-google-blue">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span class="text-sm">LinkedIn Profile</span>
            </div>
          </a>
          
          <!-- Vardan Papikyan -->
          <a href="https://www.linkedin.com/in/vardanpapikyan/" target="_blank" rel="noopener noreferrer" class="card text-center hover:shadow-xl transition-shadow">
            <img src="organizers/Vardan.jpeg" alt="Portrait of Vardan Papikyan" loading="lazy" width="128" height="128" class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md ring-4 ring-white dark:ring-gray-900" />
            <h3 class="font-bold text-lg">Vardan Papikyan</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Founder</p>
            <div class="flex items-center justify-center text-google-blue">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span class="text-sm">LinkedIn Profile</span>
            </div>
          </a>
          
          <!-- Roland Egiazaryan -->
          <a href="https://www.linkedin.com/in/roland-egiazaryan/" target="_blank" rel="noopener noreferrer" class="card text-center hover:shadow-xl transition-shadow">
            <img src="organizers/Roland.jpeg" alt="Portrait of Roland Egiazaryan" loading="lazy" width="128" height="128" class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md ring-4 ring-white dark:ring-gray-900" />
            <h3 class="font-bold text-lg">Roland Egiazaryan</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Co-Organizer</p>
            <div class="flex items-center justify-center text-google-blue">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span class="text-sm">LinkedIn Profile</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-lg font-bold">DevFest Armenia 2025</p>
          <p class="text-sm text-gray-400">Organized by GDG Yerevan</p>
        </div>
        <div class="flex items-center space-x-6">
          <a href="https://www.instagram.com/gdg_yerevan" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="hover:text-google-blue transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/72083329/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="hover:text-google-blue transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/gdgyerevan" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="hover:text-google-blue transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="mt-8 text-center text-sm text-gray-400">
        <p>&copy; 2025 GDG Yerevan. All rights reserved.</p>
      </div>
    </div>
  </footer>
`

// Load session and speaker data from Excel file
let sessionData: Record<string, SessionData> = {}
let speakerData: Record<string, SpeakerData> = {}
let workshopsData: WorkshopData[] = []

// Function to render workshops
function renderWorkshops() {
  const workshopsGrid = document.getElementById('workshops-grid')
  if (!workshopsGrid) return

  workshopsGrid.innerHTML = workshopsData.map(workshop => {
    const basePath = window.location.pathname.replace(/\/$/, '')
    const workshopUrl = `${window.location.origin}${basePath}/share/workshop-${workshop.id}.html`
    const shareDescription = `Join this workshop at DevFest Armenia 2025: ${workshop.title} by ${workshop.speakerName}`
    const truncatedDescription = truncateText(workshop.description, 150)

    return `
    <div class="card">
      <div class="flex flex-col h-full">
        <div class="cursor-pointer" data-workshop-click="${workshop.id}">
          <div class="flex-shrink-0 mb-4">
            <img src="${workshop.speakerImage}" alt="${workshop.speakerName}" class="w-full h-48 object-cover rounded-lg">
          </div>
          <h3 class="text-xl font-bold mb-2 text-google-blue">${workshop.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span class="font-semibold">Speaker:</span> ${workshop.speakerName}
          </p>
          <p class="text-gray-700 dark:text-gray-300 mb-4 flex-1">${truncatedDescription}</p>
        </div>
        <div class="flex-1 flex flex-col">
          <div class="space-y-3">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Max ${workshop.maxParticipants} participants
            </div>
            <div class="flex gap-2">
              <a href="${workshop.registrationUrl}" target="_blank" rel="noopener noreferrer" 
                 class="flex-1 text-center bg-google-blue hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Enroll
              </a>
              <button 
                class="share-button inline-flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 font-medium"
                data-share-title="${workshop.title.replace(/"/g, '&quot;')}"
                data-share-text="${shareDescription.replace(/"/g, '&quot;')}"
                data-share-url="${workshopUrl}"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  }).join('')
}

// Initialize data and event listeners
async function initializeData() {
  try {
    const data = await parseExcelData('data.json')
    sessionData = data.sessions
    speakerData = data.speakers
    
    // Load workshops
    workshopsData = await loadWorkshops('workshops.json')
    renderWorkshops()
    renderSessions(sessionData)
    renderSpeakers(speakerData)

    // Add event listeners for share buttons
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const shareButton = target.closest('.share-button') as HTMLButtonElement

      if (shareButton) {
        e.preventDefault()
        e.stopPropagation()

        const title = shareButton.dataset.shareTitle || ''
        const text = shareButton.dataset.shareText || ''
        const url = shareButton.dataset.shareUrl || window.location.href

        shareContent({ title, text, url })
      }
    })

    // Add event listeners for sessions
    document.querySelectorAll('[data-session-click]').forEach(sessionClickable => {
      sessionClickable.addEventListener('click', () => {
        const sessionId = sessionClickable.getAttribute('data-session-click')
        if (sessionId && sessionData[sessionId]) {
          const session = sessionData[sessionId]
          const basePath = window.location.pathname.replace(/\/$/, '')
          const sessionUrl = `${window.location.origin}${basePath}/share/session-${sessionId}.html`
          const speakerName = extractSpeakerName(session.speaker)
          const shareDescription = `Check out this session at DevFest Armenia 2025: ${session.title} by ${speakerName}`
          const shareButtons = createShareButtons(session.title, shareDescription, sessionUrl)

          createDialog(session.title, `
            ${session.content}
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4">Share this session</h3>
              ${shareButtons}
            </div>
          `)
        }
      })
    })

    // Add event listeners for speakers
    document.querySelectorAll('[data-speaker-click]').forEach(speakerClickable => {
      speakerClickable.addEventListener('click', () => {
        const speakerId = speakerClickable.getAttribute('data-speaker-click')
        if (speakerId && speakerData[speakerId]) {
          const speaker = speakerData[speakerId]
          const basePath = window.location.pathname.replace(/\/$/, '')
          const speakerUrl = `${window.location.origin}${basePath}/share/speaker-${speakerId}.html`
          const shareDescription = `Meet ${speaker.name}, ${speaker.position} at DevFest Armenia 2025`
          const shareButtons = createShareButtons(speaker.name, shareDescription, speakerUrl)

          createDialog(speaker.name, `
            ${speaker.content}
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4">Share this speaker</h3>
              ${shareButtons}
            </div>
          `)
        }
      })
    })

    // Add event listeners for workshops
    document.querySelectorAll('[data-workshop-click]').forEach(workshopClickable => {
      workshopClickable.addEventListener('click', () => {
        const workshopId = workshopClickable.getAttribute('data-workshop-click')
        const workshop = workshopsData.find(w => w.id === workshopId)
        if (workshop) {
          const basePath = window.location.pathname.replace(/\/$/, '')
          const workshopUrl = `${window.location.origin}${basePath}/share/workshop-${workshop.id}.html`
          const shareDescription = `Join this workshop at DevFest Armenia 2025: ${workshop.title} by ${workshop.speakerName}`
          const shareButtons = createShareButtons(workshop.title, shareDescription, workshopUrl)

          createDialog(workshop.title, `
            <div class="flex flex-col md:flex-row gap-6 mb-6">
              <div class="flex-shrink-0">
                <img src="${workshop.speakerImage}" alt="${workshop.speakerName}" class="w-full md:w-48 h-48 rounded-lg object-cover">
              </div>
              <div>
                <p class="text-lg font-semibold mb-2">Speaker: ${workshop.speakerName}</p>
                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <svg class="w-5 h-5 mr-2 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Max ${workshop.maxParticipants} participants
                </div>
                <a href="${workshop.registrationUrl}" target="_blank" rel="noopener noreferrer" 
                   class="inline-block bg-google-blue hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                  Enroll Now
                </a>
              </div>
            </div>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300">${workshop.description}</p>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4">Share this workshop</h3>
              ${shareButtons}
            </div>
          `)
        }
      })
    })

    // Handle deep linking from hash anchors (for social share pages)
    const handleHashNavigation = () => {
      const hash = window.location.hash.substring(1) // Remove the #
      if (!hash) return

      // Handle session links like #session-ordering-coffee-with-firebase-ai
      if (hash.startsWith('session-')) {
        const sessionId = hash.substring(8) // Remove 'session-' prefix
        if (sessionData[sessionId]) {
          const session = sessionData[sessionId]
          const basePath = window.location.pathname.replace(/\/$/, '')
          const sessionUrl = `${window.location.origin}${basePath}/share/session-${sessionId}.html`
          const speakerName = extractSpeakerName(session.speaker)
          const shareDescription = `Check out this session at DevFest Armenia 2025: ${session.title} by ${speakerName}`
          const shareButtons = createShareButtons(session.title, shareDescription, sessionUrl)

          createDialog(session.title, `
            ${session.content}
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4">Share this session</h3>
              ${shareButtons}
            </div>
          `)
        }
      }
      // Handle speaker links like #speaker-ankur-roy
      else if (hash.startsWith('speaker-')) {
        const speakerId = hash.substring(8) // Remove 'speaker-' prefix
        if (speakerData[speakerId]) {
          const speaker = speakerData[speakerId]
          const basePath = window.location.pathname.replace(/\/$/, '')
          const speakerUrl = `${window.location.origin}${basePath}/share/speaker-${speakerId}.html`
          const shareDescription = `Meet ${speaker.name}, ${speaker.position} at DevFest Armenia 2025`
          const shareButtons = createShareButtons(speaker.name, shareDescription, speakerUrl)

          createDialog(speaker.name, `
            ${speaker.content}
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4">Share this speaker</h3>
              ${shareButtons}
            </div>
          `)
        }
      }
      // Handle workshop links like #workshop-android-jetpack-compose
      else if (hash.startsWith('workshop-')) {
        const workshopId = hash.substring(9) // Remove 'workshop-' prefix
        const workshop = workshopsData.find(w => w.id === workshopId)
        if (workshop) {
          const basePath = window.location.pathname.replace(/\/$/, '')
          const workshopUrl = `${window.location.origin}${basePath}/share/workshop-${workshop.id}.html`
          const shareDescription = `Join this workshop at DevFest Armenia 2025: ${workshop.title} by ${workshop.speakerName}`
          const shareButtons = createShareButtons(workshop.title, shareDescription, workshopUrl)

          createDialog(workshop.title, `
            <div class="flex flex-col md:flex-row gap-6 mb-6">
              <div class="flex-shrink-0">
                <img src="${workshop.speakerImage}" alt="${workshop.speakerName}" class="w-full md:w-48 h-48 rounded-lg object-cover">
              </div>
              <div>
                <p class="text-lg font-semibold mb-2">Speaker: ${workshop.speakerName}</p>
                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <svg class="w-5 h-5 mr-2 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Max ${workshop.maxParticipants} participants
                </div>
                <a href="${workshop.registrationUrl}" target="_blank" rel="noopener noreferrer" 
                   class="inline-block bg-google-blue hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                  Enroll Now
                </a>
              </div>
            </div>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300">${workshop.description}</p>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4">Share this workshop</h3>
              ${shareButtons}
            </div>
          `)
        }
      }
    }

    // Handle hash on initial page load
    handleHashNavigation()

    // Handle hash changes (for browser back/forward)
    window.addEventListener('hashchange', handleHashNavigation)
  } catch (error) {
    console.error('Failed to load session data:', error)
  }
}

// Initialize when DOM is ready
initializeData()
