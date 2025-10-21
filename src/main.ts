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
        <div class="hidden md:flex items-center space-x-6">
          <a href="#about" class="hover:text-google-blue transition-colors">About</a>
          <a href="#agenda" class="hover:text-google-blue transition-colors">Agenda</a>
          <a href="#sessions" class="hover:text-google-blue transition-colors">Sessions</a>
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
        <div class="grid gap-8">
          <!-- Session: Ordering Coffee with Firebase AI -->
          <div class="card">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-shrink-0">
                <img src="https://sessionize.com/image/2b33-400o400o1-NAvjTdoBPX4kkGbQGnntqb.jpg" alt="Max Kachinkin" class="w-32 h-32 rounded-full object-cover">
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold mb-2 text-google-blue">Ordering Coffee with Firebase AI</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span class="font-semibold">Speaker:</span> Max Kachinkin - Android Tech Lead, Dodo Brands
                </p>
                <div class="prose dark:prose-invert max-w-none">
                  <p class="mb-4">
                    Check out my video submission: <a href="https://youtu.be/aW17mTF45yc" target="_blank" rel="noopener noreferrer" class="text-google-blue hover:underline">https://youtu.be/aW17mTF45yc</a>
                  </p>
                  <p class="mb-4">
                    The presentation is not THE final yet, but it shows all the core idea, structure, and mood.
                    <a href="https://docs.google.com/presentation/d/1WRWVDhyplhf2odAEqYfv6whKdNIRipwwK-gf3Hn4sOo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="text-google-blue hover:underline">View Presentation</a>
                  </p>
                  <p class="mb-4">
                    I'm an Android Tech Lead at Dodo Brands, the fastest-growing QSR franchise company, operating internationally with Dodo Pizza and Drinkit coffee shops, including in the UAE.
                  </p>
                  <p class="mb-4">
                    My talk is called "Ordering Coffee with Firebase AI", and it's about a real case of bootstrapping AI assistants with Firebase AI Logic.
                    I'm working on a coffee shop chain app called Drinkit. Our menu is huge: you can customize drinks with or without milk, change ice, add syrups, literally millions of combinations. Too big for a static UI. So we thought: why not let AI guide the user? What if you could just say: "It's hot today, give me something refreshing". And boom, the app recommends the perfect drink for you. That's exactly what we're building in Drinkit.
                  </p>
                  <p>
                    I believe this talk will be useful because it's a real production case of applying Firebase AI, not just sandbox examples. Attendees will see how we combined speech-to-text, Firebase AI models, and function calls to handle a huge menu (2M+ token context!) and deliver an interactive, personalized ordering experience. Developers will walk away with inspiration, code examples, and practical lessons on how to quickly bootstrap AI features in their own apps.
                  </p>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">Accepted</span>
                  <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">Android</span>
                  <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">Firebase AI</span>
                  <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">Production Case</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Speakers Section -->
  <section id="speakers" class="bg-white dark:bg-gray-900">
    <div class="section-container">
      <h2 class="section-title">Speakers</h2>
      <div class="max-w-6xl mx-auto">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Speaker: Max Kachinkin -->
          <div class="card">
            <div class="flex flex-col items-center text-center">
              <img src="https://sessionize.com/image/2b33-400o400o1-NAvjTdoBPX4kkGbQGnntqb.jpg" alt="Max Kachinkin" class="w-48 h-48 rounded-full object-cover mb-4">
              <h3 class="text-xl font-bold mb-1">Max Kachinkin</h3>
              <p class="text-google-blue font-medium mb-3">Android Tech Lead, Dodo Brands</p>
              <div class="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  Android Tech Lead at Dodo Brands with over 10 years of experience in Android development. I led the development of Dodo Pizza (with 9 million MAU across 20 countries) and am now working on another project, Drinkit, a new digital coffee shop network by Dodo Brands.
                </p>
                <ul class="list-disc list-inside space-y-1 mt-3">
                  <li>Runs Telegram channel "Mobile Fiction"</li>
                  <li>Speaker at Mobius and Codefest conferences</li>
                  <li>Writer on Habr, Medium, HackerNoon</li>
                  <li>Teaches Android at OTUS</li>
                  <li>Created Android Architecture course for GeekBrains</li>
                  <li>Program committee member for Android Podlodka Crew</li>
                  <li>DevZen podcast participant</li>
                </ul>
              </div>
            </div>
          </div>
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
