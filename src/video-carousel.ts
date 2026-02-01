/**
 * Video Carousel Module
 * 
 * Implements a YouTube video carousel that displays embedded videos
 * Supports navigation, keyboard controls, and autoplay
 */

export interface VideoItem {
  id: string
  videoId: string  // YouTube video ID
  title?: string
  description?: string
}

export class VideoCarousel {
  private container: HTMLElement
  private videos: VideoItem[] = []
  private currentIndex = 0
  private isTransitioning = false
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null

  constructor(containerId: string, videos: VideoItem[]) {
    const element = document.getElementById(containerId)
    if (!element) {
      throw new Error(`Container element with id "${containerId}" not found`)
    }
    this.container = element
    this.videos = videos
  }

  /**
   * Initialize the video carousel
   */
  initialize(): void {
    if (this.videos.length === 0) {
      this.renderEmpty()
      return
    }

    this.render()
    this.attachEventListeners()
  }

  /**
   * Render empty state
   */
  private renderEmpty(): void {
    this.container.innerHTML = `
      <div class="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
        <div class="text-4xl mb-4">🎥</div>
        <p class="text-lg text-gray-600 dark:text-gray-400">No videos available at the moment</p>
      </div>
    `
  }

  /**
   * Render the video carousel UI
   */
  private render(): void {
    this.container.innerHTML = `
      <div class="relative w-full bg-gray-900 rounded-lg overflow-hidden">
        <!-- Main Video Container (16:9 aspect ratio) -->
        <div class="aspect-video w-full relative overflow-hidden">
          <div class="video-track flex transition-transform duration-500 ease-in-out h-full">
            ${this.videos.map((video, index) => `
              <div class="video-slide flex-shrink-0 w-full h-full flex items-center justify-center" data-index="${index}">
                <iframe 
                  src="https://www.youtube.com/embed/${video.videoId}${index === 0 ? '?autoplay=0' : ''}"
                  class="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="${index === 0 ? 'eager' : 'lazy'}"
                  title="${video.title || `Video ${index + 1}`}"
                ></iframe>
              </div>
            `).join('')}
          </div>

          <!-- Navigation Arrows -->
          ${this.videos.length > 1 ? `
            <button 
              class="video-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous video"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              class="video-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next video"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          ` : ''}

          <!-- Video Counter -->
          ${this.videos.length > 1 ? `
            <div class="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              <span class="video-counter">${this.currentIndex + 1}</span> / ${this.videos.length}
            </div>
          ` : ''}
        </div>

        <!-- Video Title and Description -->
        ${this.videos[0]?.title || this.videos[0]?.description ? `
          <div class="video-info px-6 py-4 bg-gray-800 text-white">
            ${this.videos[0]?.title ? `<h4 class="video-title font-bold text-lg mb-2">${this.videos[0].title}</h4>` : ''}
            ${this.videos[0]?.description ? `<p class="video-description text-sm text-gray-300">${this.videos[0].description}</p>` : ''}
          </div>
        ` : ''}

        <!-- Dots Navigation -->
        ${this.videos.length > 1 ? `
          <div class="flex justify-center gap-2 py-4 bg-gray-800">
            ${this.videos.map((_, index) => `
              <button 
                class="video-dot w-2 h-2 rounded-full transition-all ${index === 0 ? 'bg-white w-6' : 'bg-gray-400'}"
                data-index="${index}"
                aria-label="Go to video ${index + 1}"
              ></button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `
  }

  /**
   * Update the carousel view to show the video at currentIndex
   */
  private updateCarousel(): void {
    if (this.isTransitioning) return

    const track = this.container.querySelector('.video-track') as HTMLElement
    if (!track) return

    this.isTransitioning = true
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`

    // Update counter
    const counter = this.container.querySelector('.video-counter')
    if (counter) {
      counter.textContent = (this.currentIndex + 1).toString()
    }

    // Update dots
    this.container.querySelectorAll('.video-dot').forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.remove('bg-gray-400', 'w-2')
        dot.classList.add('bg-white', 'w-6')
      } else {
        dot.classList.remove('bg-white', 'w-6')
        dot.classList.add('bg-gray-400', 'w-2')
      }
    })

    // Update video info
    const titleEl = this.container.querySelector('.video-title')
    const descEl = this.container.querySelector('.video-description')
    
    if (titleEl && this.videos[this.currentIndex]?.title) {
      titleEl.textContent = this.videos[this.currentIndex].title || ''
    }
    
    if (descEl && this.videos[this.currentIndex]?.description) {
      descEl.textContent = this.videos[this.currentIndex].description || ''
    }

    setTimeout(() => {
      this.isTransitioning = false
    }, 500)
  }

  /**
   * Navigate to the next video
   */
  private next(): void {
    if (this.isTransitioning || this.videos.length <= 1) return
    this.currentIndex = (this.currentIndex + 1) % this.videos.length
    this.updateCarousel()
  }

  /**
   * Navigate to the previous video
   */
  private prev(): void {
    if (this.isTransitioning || this.videos.length <= 1) return
    this.currentIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length
    this.updateCarousel()
  }

  /**
   * Navigate to a specific video by index
   */
  private goToSlide(index: number): void {
    if (this.isTransitioning || index === this.currentIndex) return
    this.currentIndex = index
    this.updateCarousel()
  }

  /**
   * Attach event listeners for navigation
   */
  private attachEventListeners(): void {
    if (this.videos.length <= 1) return

    // Previous button
    const prevBtn = this.container.querySelector('.video-prev')
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev())
    }

    // Next button
    const nextBtn = this.container.querySelector('.video-next')
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next())
    }

    // Dot navigation
    this.container.querySelectorAll('.video-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index') || '0')
        this.goToSlide(index)
      })
    })

    // Keyboard navigation (when carousel is in view)
    this.keyboardHandler = (e: KeyboardEvent) => {
      // Only handle keyboard if the carousel is visible in viewport
      const rect = this.container.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      
      if (!isVisible) return

      if (e.key === 'ArrowLeft') {
        this.prev()
      } else if (e.key === 'ArrowRight') {
        this.next()
      }
    }

    document.addEventListener('keydown', this.keyboardHandler)
  }

  /**
   * Destroy the carousel and clean up
   */
  destroy(): void {
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler)
      this.keyboardHandler = null
    }
    this.container.innerHTML = ''
  }
}
