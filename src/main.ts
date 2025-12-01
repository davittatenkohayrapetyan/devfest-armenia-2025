import './style.css'
import { registerSW } from './registerSW'
import { parseExcelData, SessionData, SpeakerData, WorkshopData, loadWorkshops, ScheduleData, ScheduleSession, loadSchedule } from './data-parser'

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
          <img src="${import.meta.env.BASE_URL}devfest-armenia.png" alt="DevFest Armenia 2025" class="h-8 sm:h-9 md:h-10 w-auto" loading="eager" decoding="async">
        </div>
        <div class="hidden md:flex items-center space-x-6">
          <a href="#about" class="hover:text-google-blue transition-colors">About</a>
          <a href="#agenda" class="hover:text-google-blue transition-colors">Agenda</a>
          <a href="#sessions" class="hover:text-google-blue transition-colors">Sessions</a>
          <a href="#workshops" class="hover:text-google-blue transition-colors">Workshops</a>
          <a href="#speakers" class="hover:text-google-blue transition-colors">Speakers</a>
          <a href="#call-for-speakers" class="hover:text-google-blue transition-colors">Call for Speakers</a>
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
      <div id="schedule-container" class="max-w-7xl mx-auto">
        <div class="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-2xl font-semibold text-gray-600 dark:text-gray-400">Loading schedule...</p>
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

  <!-- Call for Speakers Section -->
  <section id="call-for-speakers" class="bg-gradient-to-br from-google-blue to-blue-600 text-white">
    <div class="section-container">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="section-title text-white">Call for Speakers</h2>
        <div class="mb-8">
          <p class="text-xl md:text-2xl mb-6 leading-relaxed">
            Are you passionate about Google technologies? Do you have knowledge and experience to share with the developer community?
          </p>
          <p class="text-lg md:text-xl mb-8 leading-relaxed">
            We're looking for speakers to present talks and workshops at DevFest Armenia 2025. Whether you're an expert in Android, Web Development, Cloud, AI/ML, or any other Google technology, we'd love to hear from you!
          </p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h3 class="text-2xl font-bold mb-4">What We're Looking For</h3>
          <div class="grid md:grid-cols-2 gap-6 text-left">
            <div class="flex items-start gap-3">
              <div class="text-3xl">🎯</div>
              <div>
                <h4 class="font-bold mb-2">Technical Topics</h4>
                <p class="text-sm">Sessions on Firebase, Android, Web, Cloud, AI/ML, and other Google technologies</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-3xl">🛠️</div>
              <div>
                <h4 class="font-bold mb-2">Hands-on Workshops</h4>
                <p class="text-sm">Interactive workshops where attendees can learn by doing</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-3xl">💡</div>
              <div>
                <h4 class="font-bold mb-2">Real-world Experience</h4>
                <p class="text-sm">Case studies and practical applications from your projects</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-3xl">🌟</div>
              <div>
                <h4 class="font-bold mb-2">Community Insights</h4>
                <p class="text-sm">Best practices and lessons learned from the field</p>
              </div>
            </div>
          </div>
        </div>

        <a href="https://sessionize.com/devfest-armenia-2025" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 bg-white text-google-blue hover:bg-gray-100 font-bold py-4 px-10 rounded-lg transition-colors duration-200 shadow-2xl text-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
          Submit Your Proposal on Sessionize
        </a>
        
        <p class="mt-6 text-sm opacity-90">
          Deadline for submissions will be announced soon. Don't miss this opportunity to share your knowledge!
        </p>
      </div>
    </div>
  </section>

  <!-- Become a Partner Section -->
  <section id="become-partner" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <div class="max-w-4xl mx-auto">
        <h2 class="section-title text-center">Become a Partner</h2>
        <div class="text-center mb-8">
          <p class="text-lg md:text-xl mb-6 leading-relaxed">
            DevFest Armenia brings together hundreds of developers, tech enthusiasts, and industry professionals. 
            Partner with us to connect with the vibrant Armenian tech community!
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <div class="card text-center">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold mb-3">Brand Visibility</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Showcase your brand to a targeted audience of developers and tech professionals
            </p>
          </div>
          <div class="card text-center">
            <div class="text-4xl mb-4">🤝</div>
            <h3 class="text-xl font-bold mb-3">Community Engagement</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Connect directly with talented developers and potential hires in Armenia
            </p>
          </div>
          <div class="card text-center">
            <div class="text-4xl mb-4">📢</div>
            <h3 class="text-xl font-bold mb-3">Thought Leadership</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Position your company as a leader in technology and innovation
            </p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl text-center">
          <h3 class="text-2xl font-bold mb-4">Interested in Partnering?</h3>
          <p class="text-lg mb-6">
            Contact us to learn more about partnership opportunities and sponsorship packages.
          </p>
          <a href="mailto:gdgyerevan@gmail.com" class="inline-flex items-center gap-3 bg-google-blue hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg transition-colors duration-200 shadow-lg text-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Contact Us at gdgyerevan@gmail.com
          </a>
        </div>
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
        <p class="text-center text-lg mb-8">
          Thank you to our amazing partners who make DevFest Armenia possible!
        </p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          <a href="https://developers.google.com/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/google-for-developers.svg" alt="Woods Center" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
          <a href="https://woodscenter.am/en" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/woods.svg" alt="Woods Center" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
          <a href="https://ardy.am/en" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/ardy.svg" alt="Ardy" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
          <a href="https://ameriabank.am/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/ameriabank.png" alt="Ameriabank" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
          <a href="https://www.epam.com/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/EPAM.png" alt="EPAM" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
          <a href="https://griddynamics.com/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <img src="partners/grid-dynamics.png" alt="Grid Dynamics" class="h-12 md:h-16 w-auto object-contain" loading="lazy"/>
          </a>
        </div>
        <div class="text-center mt-12">
          <p class="text-lg mb-4 text-gray-600 dark:text-gray-400">
            Want to become a partner?
          </p>
          <a href="#become-partner" class="inline-flex items-center gap-2 text-google-blue hover:text-blue-600 font-semibold text-lg transition-colors">
            Learn more about partnership opportunities
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
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
          
          <!-- Rohan Singh -->
          <a href="https://www.linkedin.com/in/rohankalhans/" target="_blank" rel="noopener noreferrer" class="card text-center hover:shadow-xl transition-shadow">
            <img src="organizers/Rohan.jpg" alt="Portrait of Rohan Singh" loading="lazy" width="128" height="128" class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md ring-4 ring-white dark:ring-gray-900" />
            <h3 class="font-bold text-lg">Roland Egiazaryan</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Co-Organizer, GDE Cloud</p>
            <div class="flex items-center justify-center text-google-blue">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span class="text-sm">LinkedIn Profile</span>
            </div>
          </a>
          
          <!-- Armen Vardanyan -->
          <a href="https://www.linkedin.com/in/armen-vardanyan-am/" target="_blank" rel="noopener noreferrer" class="card text-center hover:shadow-xl transition-shadow">
            <img src="organizers/Armen.jpg" alt="Portrait of Armen Vardanyan" loading="lazy" width="128" height="128" class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md ring-4 ring-white dark:ring-gray-900" />
            <h3 class="font-bold text-lg">Armen Vardanyan</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Co-Organizer, GDE Angular</p>
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
let scheduleData: ScheduleData | null = null

// Function to get session color based on room
function getSessionColor(room: string): string {
  if (room === 'hall-a') {
    return 'bg-google-blue/10 dark:bg-google-blue/20 border-google-blue'
  } else if (room === 'hall-b') {
    return 'bg-google-green/10 dark:bg-google-green/20 border-google-green'
  } else if (room === 'hall-c') {
    return 'bg-google-yellow/10 dark:bg-google-yellow/20 border-google-yellow'
  }
  return 'bg-gray-100 dark:bg-gray-700 border-gray-400'
}

// Function to render schedule
function renderSchedule(schedule: ScheduleData): void {
  const container = document.getElementById('schedule-container')
  if (!container) return

  // Calculate time range
  const allMinutes = schedule.sessions.map(s => [s.startMinutes, s.endMinutes]).flat()
  const minTime = Math.min(...allMinutes)
  const maxTime = Math.max(...allMinutes)
  const totalMinutes = maxTime - minTime
  const pixelsPerMinute = 2.5 // Each minute = 2.5 pixels

  // Generate time labels (every 30 minutes)
  const timeLabels: { time: string; position: number }[] = []
  for (let m = minTime; m <= maxTime; m += 30) {
    const hours = Math.floor(m / 60)
    const mins = m % 60
    const period = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours)
    timeLabels.push({
      time: `${String(displayHours).padStart(2, '0')}:${String(mins).padStart(2, '0')}${period}`,
      position: (m - minTime) * pixelsPerMinute
    })
  }

  const scheduleHeight = totalMinutes * pixelsPerMinute

  // Create schedule URL for sharing
  const basePath = window.location.pathname.replace(/\/$/, '')
  const scheduleUrl = `${window.location.origin}${basePath}/#agenda`
  const shareDescription = 'Check out the DevFest Armenia 2025 schedule!'
  const encodedUrl = encodeURIComponent(scheduleUrl)
  const encodedTitle = encodeURIComponent('DevFest Armenia 2025 Schedule')

  // Group sessions by room
  const sessionsByRoom: Record<string, ScheduleSession[]> = {}
  schedule.rooms.forEach(room => {
    sessionsByRoom[room.id] = schedule.sessions.filter(s => s.room === room.id)
  })

  container.innerHTML = `
    <!-- Disclaimer Banner -->
    <div class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <p class="text-yellow-800 dark:text-yellow-200 font-medium">${schedule.disclaimer}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3 mb-6 justify-center sm:justify-start print:hidden">
      <button 
        id="print-schedule-btn"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
        Print Schedule
      </button>
      <button 
        class="share-button inline-flex items-center gap-2 px-4 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
        data-share-title="DevFest Armenia 2025 Schedule"
        data-share-text="${shareDescription}"
        data-share-url="${scheduleUrl}"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Share Schedule
      </button>
      <a 
        href="https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 font-medium"
        aria-label="Share on X"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </a>
    </div>

    <!-- Room Legend -->
    <div class="flex flex-wrap gap-4 mb-6 justify-center print:mb-4">
      ${schedule.rooms.map(room => `
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded ${room.id === 'hall-a' ? 'bg-google-blue' : room.id === 'hall-b' ? 'bg-google-green' : 'bg-google-yellow'}"></div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${room.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- Schedule Grid -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 overflow-x-auto print:bg-white print:p-0">
      <div class="flex min-w-[700px]">
        <!-- Time Column -->
        <div class="w-20 flex-shrink-0 relative print:w-16" style="height: ${scheduleHeight + 40}px;">
          ${timeLabels.map(label => `
            <div class="absolute left-0 right-0 flex items-center" style="top: ${label.position}px;">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">${label.time}</span>
              <div class="flex-1 h-px bg-gray-200 dark:bg-gray-600 ml-2 print:bg-gray-300"></div>
            </div>
          `).join('')}
        </div>

        <!-- Rooms Columns -->
        <div class="flex-1 flex gap-3 print:gap-2">
          ${schedule.rooms.map(room => `
            <div class="flex-1 relative" style="height: ${scheduleHeight + 40}px;">
              <!-- Room Header -->
              <div class="sticky top-0 bg-gray-50 dark:bg-gray-800 pb-2 z-10 print:bg-white">
                <h3 class="text-center font-bold text-gray-800 dark:text-gray-200 text-sm mb-2 print:text-gray-900">${room.name}</h3>
              </div>
              
              <!-- Time Grid Lines -->
              ${timeLabels.map(label => `
                <div class="absolute left-0 right-0 h-px bg-gray-200 dark:bg-gray-600 print:bg-gray-300" style="top: ${label.position + 24}px;"></div>
              `).join('')}

              <!-- Sessions -->
              ${sessionsByRoom[room.id].map(session => {
                const top = (session.startMinutes - minTime) * pixelsPerMinute + 24
                const height = session.duration * pixelsPerMinute
                const colorClass = getSessionColor(session.room)
                return `
                  <div 
                    class="absolute left-1 right-1 ${colorClass} border-l-4 rounded-r-lg p-2 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow print:left-0 print:right-0 print:shadow-none session-card"
                    style="top: ${top}px; height: ${height}px; min-height: 40px;"
                    data-session-id="${session.id}"
                    title="${session.title}${session.speaker ? ' - ' + session.speaker : ''}"
                  >
                    <div class="h-full flex flex-col overflow-hidden">
                      <p class="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 print:text-gray-900">${session.title}</p>
                      ${session.speaker ? `<p class="text-xs text-gray-600 dark:text-gray-300 mt-0.5 truncate print:text-gray-700">${session.speaker}</p>` : ''}
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-auto print:text-gray-600">${session.startTime} - ${session.endTime}</p>
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Mobile List View (shown on small screens) -->
    <div class="md:hidden mt-8 print:hidden">
      <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Session List</h3>
      <div class="space-y-3">
        ${schedule.sessions
          .sort((a, b) => a.startMinutes - b.startMinutes)
          .map(session => {
            const colorClass = getSessionColor(session.room)
            return `
              <div class="${colorClass} border-l-4 rounded-r-lg p-4">
                <div class="flex justify-between items-start gap-2 mb-1">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">${session.startTime} - ${session.endTime}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full ${session.room === 'hall-a' ? 'bg-google-blue/20 text-google-blue' : session.room === 'hall-b' ? 'bg-google-green/20 text-google-green' : 'bg-google-yellow/20 text-google-yellow'}">${session.roomDisplay}</span>
                </div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100">${session.title}</h4>
                ${session.speaker ? `<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${session.speaker}</p>` : ''}
              </div>
            `
          }).join('')}
      </div>
    </div>
  `

  // Add print button event listener
  const printBtn = document.getElementById('print-schedule-btn')
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print()
    })
  }

  // Add session card click handlers for showing details
  document.querySelectorAll('.session-card').forEach(card => {
    card.addEventListener('click', () => {
      const sessionId = card.getAttribute('data-session-id')
      const session = schedule.sessions.find(s => s.id === sessionId)
      if (session) {
        const sessionShareUrl = `${window.location.origin}${basePath}/#agenda`
        const sessionShareDescription = `${session.title}${session.speaker ? ' by ' + session.speaker : ''} at DevFest Armenia 2025`
        const shareButtons = createShareButtons(session.title, sessionShareDescription, sessionShareUrl)
        
        createDialog(session.title, `
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded ${session.room === 'hall-a' ? 'bg-google-blue' : session.room === 'hall-b' ? 'bg-google-green' : 'bg-google-yellow'}"></div>
              <span class="font-medium text-gray-600 dark:text-gray-300">${session.roomDisplay}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>${session.startTime} - ${session.endTime}</span>
            </div>
            ${session.speaker ? `
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="font-medium">${session.speaker}</span>
              </div>
            ` : ''}
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4">Share this session</h3>
              ${shareButtons}
            </div>
          </div>
        `)
      }
    })
  })
}

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
    
    // Load schedule
    try {
      scheduleData = await loadSchedule('schedule.json')
      renderSchedule(scheduleData)
    } catch (err) {
      console.log('Schedule not available yet:', err)
    }
    
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
    }, true)

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
