import './style.css'
import { registerSW } from './registerSW'
import { parseExcelData, SessionData, SpeakerData, WorkshopData, loadWorkshops } from './data-parser'

// Register service worker
registerSW()

const app = document.querySelector<HTMLDivElement>('#app')!

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
      return `
        <div class="card cursor-pointer" data-session="${s.sessionId}">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-shrink-0">
              <img src="${photo}" alt="${alt}" class="w-32 h-32 rounded-full object-cover" loading="lazy">
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold mb-2 text-google-blue">${s.title}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span class="font-semibold">Speaker:</span> ${speakerName}
              </p>
              <div class="flex flex-wrap gap-2">${statusHtml}${catsHtml}</div>
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
      return `
        <div class="card cursor-pointer" data-speaker="${sp.speakerId}">
          <div class="flex flex-col items-center text-center">
            <img src="${photo}" alt="${alt}" class="w-48 h-48 rounded-full object-cover mb-4" loading="lazy">
            <h3 class="text-xl font-bold mb-1">${sp.name}</h3>
            <p class="text-google-blue font-medium mb-3">${sp.position}</p>
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
          <a href="https://www.meetup.com/gdgyerevan/events/311547893/?eventOrigin=group_upcoming_events" target="_blank" rel="noopener noreferrer" class="bg-google-blue hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
            Register on Meetup
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-google-blue to-blue-600 text-white pt-16">
    <div class="section-container text-center">
      <h1 class="text-5xl md:text-7xl font-bold mb-6">
        DevFest Armenia 2025
      </h1>
      <p class="text-2xl md:text-3xl mb-8">
        December 20, 2025 • Woods Center
      </p>
      <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
        Join us for a day of learning, networking, and celebrating technology with the Google Developer Group community.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://www.meetup.com/gdgyerevan/events/311547893/?eventOrigin=group_upcoming_events" target="_blank" rel="noopener noreferrer" class="bg-white text-google-blue hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg text-lg">
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
            <p>📋 <strong>What to Bring:</strong> Just your laptop and enthusiasm! Fill in the registration form so the speaker can prepare the perfect session for you</p>
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

  workshopsGrid.innerHTML = workshopsData.map(workshop => `
    <div class="card">
      <div class="flex flex-col h-full">
        <div class="flex-shrink-0 mb-4">
          <img src="${workshop.speakerImage}" alt="${workshop.speakerName}" class="w-full h-48 object-cover rounded-lg">
        </div>
        <div class="flex-1 flex flex-col">
          <h3 class="text-xl font-bold mb-2 text-google-blue">${workshop.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span class="font-semibold">Speaker:</span> ${workshop.speakerName}
          </p>
          <p class="text-gray-700 dark:text-gray-300 mb-4 flex-1">${workshop.description}</p>
          <div class="space-y-3">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Max ${workshop.maxParticipants} participants
            </div>
            <a href="${workshop.registrationUrl}" target="_blank" rel="noopener noreferrer" 
               class="block w-full text-center bg-google-blue hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('')
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
    // Add event listeners for sessions (after render)

    // Add event listeners for sessions
    document.querySelectorAll('[data-session]').forEach(sessionCard => {
      sessionCard.addEventListener('click', () => {
        const sessionId = sessionCard.getAttribute('data-session')
        if (sessionId && sessionData[sessionId]) {
          const session = sessionData[sessionId]
          createDialog(session.title, session.content)
        }
      })
    })

    // Add event listeners for speakers
    document.querySelectorAll('[data-speaker]').forEach(speakerCard => {
      speakerCard.addEventListener('click', () => {
        const speakerId = speakerCard.getAttribute('data-speaker')
        if (speakerId && speakerData[speakerId]) {
          const speaker = speakerData[speakerId]
          createDialog(speaker.name, speaker.content)
        }
      })
    })
  } catch (error) {
    console.error('Failed to load session data:', error)
  }
}

// Initialize when DOM is ready
initializeData()
