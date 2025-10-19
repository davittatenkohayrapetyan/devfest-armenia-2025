import './style.css'
import { registerSW } from './registerSW'

// Register service worker
registerSW()

const app = document.querySelector<HTMLDivElement>('#app')!

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
        <div class="hidden md:flex space-x-8">
          <a href="#about" class="hover:text-google-blue transition-colors">About</a>
          <a href="#agenda" class="hover:text-google-blue transition-colors">Agenda</a>
          <a href="#sessions" class="hover:text-google-blue transition-colors">Sessions</a>
          <a href="#speakers" class="hover:text-google-blue transition-colors">Speakers</a>
          <a href="#wall" class="hover:text-google-blue transition-colors">Wall</a>
          <a href="#partners" class="hover:text-google-blue transition-colors">Partners</a>
          <a href="#organizers" class="hover:text-google-blue transition-colors">Organizers</a>
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
        <a href="#agenda" class="bg-white text-google-blue hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
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
        <!-- Sessionize GridSmart Embed -->
        <div id="sessionize-grid-smart" class="sessionize-embed"></div>
      </div>
    </div>
  </section>

  <!-- Sessions Section -->
  <section id="sessions" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">Sessions</h2>
      <div class="max-w-6xl mx-auto">
        <!-- Sessionize Sessions Embed -->
        <div id="sessionize-sessions" class="sessionize-embed"></div>
      </div>
    </div>
  </section>

  <!-- Speakers Section -->
  <section id="speakers" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">Speakers</h2>
      <div class="max-w-6xl mx-auto">
        <!-- Sessionize Speakers Embed -->
        <div id="sessionize-speakers" class="sessionize-embed"></div>
      </div>
    </div>
  </section>

  <!-- Speaker Wall Section -->
  <section id="wall" class="bg-white dark:bg-gray-900">
    <div class="section-container">
      <h2 class="section-title">Speaker Wall</h2>
      <div class="max-w-6xl mx-auto">
        <!-- Sessionize Speaker Wall Embed -->
        <div id="sessionize-speaker-wall" class="sessionize-embed"></div>
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
          <!-- Partner logo placeholders -->
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <svg class="w-full h-20" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#f3f4f6" class="dark:fill-gray-700"/>
              <text x="100" y="40" text-anchor="middle" dominant-baseline="middle" class="fill-gray-500 text-sm font-medium">Partner Logo</text>
            </svg>
          </div>
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
            <svg class="w-32 h-32" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="95" fill="#4285F4"/>
              <text x="100" y="110" text-anchor="middle" dominant-baseline="middle" class="fill-white font-bold text-4xl">GDG</text>
              <text x="100" y="145" text-anchor="middle" dominant-baseline="middle" class="fill-white text-sm">Yerevan</text>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">GDG Yerevan</h3>
          <p class="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Google Developer Group Yerevan is a community of developers interested in Google technologies and open-source development. 
            We organize events, workshops, and meetups to share knowledge and connect developers in Armenia.
          </p>
        </div>
        
        <h3 class="text-xl font-bold text-center mb-8">Core Team</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <!-- Organizer placeholders -->
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-google-blue to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Lead Organizer</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-google-red to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Tech Lead</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-google-yellow to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Community Manager</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-google-green to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Logistics</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Marketing</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Content</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Volunteer</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Volunteer</p>
          </div>
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
          <p class="text-sm text-gray-400">Organized by GDG Armenia</p>
        </div>
        <div class="flex space-x-6">
          <a href="#" class="hover:text-google-blue transition-colors">Twitter</a>
          <a href="#" class="hover:text-google-blue transition-colors">LinkedIn</a>
          <a href="#" class="hover:text-google-blue transition-colors">Facebook</a>
        </div>
      </div>
      <div class="mt-8 text-center text-sm text-gray-400">
        <p>&copy; 2025 GDG Armenia. All rights reserved.</p>
      </div>
    </div>
  </footer>
`
