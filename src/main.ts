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
          <a href="#speakers" class="hover:text-google-blue transition-colors">Speakers</a>
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
      <div class="max-w-4xl mx-auto">
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p class="text-lg mb-4">Detailed agenda coming soon!</p>
          <p class="text-gray-600 dark:text-gray-400">
            We're finalizing an exciting lineup of sessions covering the latest in Android, Web, Cloud, AI/ML, and more.
          </p>
          <!-- Sessionize Embed Placeholder -->
          <div id="sessionize-embed" class="mt-8">
            <!-- Sessionize agenda will be embedded here -->
            <script type="text/javascript">
              // Sessionize embed script will be added here
              // Example: sessionize.com/api/v2/{event-id}/view/GridSmart
            </script>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Speakers Section -->
  <section id="speakers" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">Speakers</h2>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
          <p class="text-lg mb-4">Amazing speakers lineup coming soon!</p>
          <p class="text-gray-600 dark:text-gray-400">
            We're bringing together industry experts and thought leaders to share their knowledge and experience.
          </p>
          <!-- Sessionize Speakers Placeholder -->
          <div id="sessionize-speakers" class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Placeholder speaker cards -->
            <div class="card">
              <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <h3 class="font-bold text-lg">Speaker Name</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Topic Area</p>
            </div>
            <div class="card">
              <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <h3 class="font-bold text-lg">Speaker Name</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Topic Area</p>
            </div>
            <div class="card">
              <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <h3 class="font-bold text-lg">Speaker Name</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Topic Area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Partners Section -->
  <section id="partners" class="bg-white dark:bg-gray-900">
    <div class="section-container">
      <h2 class="section-title">Partners</h2>
      <div class="max-w-4xl mx-auto">
        <p class="text-center text-lg mb-12">
          Thank you to our amazing partners who make DevFest Armenia possible!
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Partner placeholders -->
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="w-full h-20 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
              <span class="text-gray-600 dark:text-gray-400">Partner Logo</span>
            </div>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="w-full h-20 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
              <span class="text-gray-600 dark:text-gray-400">Partner Logo</span>
            </div>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="w-full h-20 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
              <span class="text-gray-600 dark:text-gray-400">Partner Logo</span>
            </div>
          </div>
          <div class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="w-full h-20 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
              <span class="text-gray-600 dark:text-gray-400">Partner Logo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Organizers Section -->
  <section id="organizers" class="bg-gray-50 dark:bg-gray-800">
    <div class="section-container">
      <h2 class="section-title">Organizers</h2>
      <div class="max-w-4xl mx-auto">
        <p class="text-center text-lg mb-12">
          Meet the team behind DevFest Armenia 2025
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <!-- Organizer placeholders -->
          <div class="card text-center">
            <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Role</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Role</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Role</p>
          </div>
          <div class="card text-center">
            <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <h3 class="font-bold">Organizer Name</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Role</p>
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
