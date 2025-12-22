/**
 * Photo Gallery Module
 * 
 * Implements a dependency-free photo carousel that fetches images from Google Photos
 * via a proxy endpoint (GOOGLE_PHOTOS_FEED_URL). Supports autoplay, keyboard navigation,
 * swipe gestures, lazy loading, and maintains 16:9 aspect ratio.
 * 
 * Expected JSON schema from GOOGLE_PHOTOS_FEED_URL:
 * {
 *   items: [{ id: string, src: string, width: number, height: number, alt?: string, caption?: string }],
 *   nextPageToken?: string
 * }
 */

export interface PhotoItem {
  id: string
  src: string
  width: number
  height: number
  alt?: string
  caption?: string
}

export interface PhotoFeedResponse {
  items: PhotoItem[]
  nextPageToken?: string
}

export class PhotoGallery {
  private container: HTMLElement
  private photos: PhotoItem[] = []
  private currentIndex = 0
  private autoplayInterval: number | null = null
  private autoplayDelay = 5000 // 5 seconds
  private touchStartX = 0
  private touchEndX = 0
  private isTransitioning = false

  constructor(containerId: string, private albumUrl: string) {
    const element = document.getElementById(containerId)
    if (!element) {
      throw new Error(`Container element with id "${containerId}" not found`)
    }
    this.container = element
  }

  /**
   * Fetch photos from the Google Photos feed URL
   */
  async fetchPhotos(feedUrl: string): Promise<PhotoItem[]> {
    try {
      // Add cache busting parameter
      const url = new URL(feedUrl)
      url.searchParams.set('v', Date.now().toString())
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`)
      }

      const data: PhotoFeedResponse = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Error fetching photos:', error)
      throw error
    }
  }

  /**
   * Initialize the gallery with photos from the feed URL
   */
  async initialize(feedUrl?: string): Promise<void> {
    if (feedUrl) {
      try {
        this.photos = await this.fetchPhotos(feedUrl)
        if (this.photos.length === 0) {
          this.renderFallback()
          return
        }
      } catch (error) {
        this.renderFallback()
        return
      }
    } else {
      this.renderFallback()
      return
    }

    this.render()
    this.attachEventListeners()
    this.startAutoplay()
  }

  /**
   * Render the fallback iframe embed
   */
  private renderFallback(): void {
    this.container.innerHTML = `
      <div class="w-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div class="aspect-video w-full">
          <iframe 
            src="${this.albumUrl}"
            class="w-full h-full border-0"
            allowfullscreen
            loading="lazy"
            title="DevFest Armenia 2025 Photo Album"
          ></iframe>
        </div>
        <div class="p-4 text-center">
          <a 
            href="${this.albumUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-google-blue hover:text-blue-600 font-semibold transition-colors"
            aria-label="View full album on Google Photos"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            View Full Album
          </a>
        </div>
      </div>
    `
  }

  /**
   * Render the gallery UI
   */
  private render(): void {
    this.container.innerHTML = `
      <div class="relative w-full bg-gray-900 rounded-lg overflow-hidden">
        <!-- Main Image Container (16:9 aspect ratio) -->
        <div class="aspect-video w-full relative overflow-hidden">
          <div class="gallery-track flex transition-transform duration-500 ease-in-out h-full">
            ${this.photos.map((photo, index) => `
              <div class="gallery-slide flex-shrink-0 w-full h-full flex items-center justify-center" data-index="${index}">
                <img 
                  src="${photo.src}" 
                  alt="${photo.alt || `Photo ${index + 1}`}"
                  class="w-full h-full object-contain"
                  loading="${index === 0 ? 'eager' : 'lazy'}"
                  decoding="async"
                />
              </div>
            `).join('')}
          </div>

          <!-- Navigation Arrows -->
          <button 
            class="gallery-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous photo"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            class="gallery-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next photo"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Photo Counter -->
          <div class="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            <span class="gallery-counter">${this.currentIndex + 1}</span> / ${this.photos.length}
          </div>
        </div>

        <!-- Dots Navigation -->
        <div class="flex justify-center gap-2 py-4 bg-gray-800">
          ${this.photos.map((_, index) => `
            <button 
              class="gallery-dot w-2 h-2 rounded-full transition-all ${index === 0 ? 'bg-white w-6' : 'bg-gray-400'}"
              data-index="${index}"
              aria-label="Go to photo ${index + 1}"
            ></button>
          `).join('')}
        </div>

        <!-- Caption (if available) -->
        ${this.photos[0]?.caption ? `
          <div class="gallery-caption px-4 py-2 bg-gray-800 text-white text-sm text-center">
            ${this.photos[0].caption}
          </div>
        ` : ''}

        <!-- View Full Album CTA -->
        <div class="p-4 bg-gray-800 text-center">
          <a 
            href="${this.albumUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-google-blue hover:text-blue-400 font-semibold transition-colors"
            aria-label="View full album on Google Photos"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            View Full Album
          </a>
        </div>
      </div>
    `
  }

  /**
   * Update the gallery view to show the photo at currentIndex
   */
  private updateGallery(): void {
    if (this.isTransitioning) return

    const track = this.container.querySelector('.gallery-track') as HTMLElement
    if (!track) return

    this.isTransitioning = true
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`

    // Update counter
    const counter = this.container.querySelector('.gallery-counter')
    if (counter) {
      counter.textContent = (this.currentIndex + 1).toString()
    }

    // Update dots
    this.container.querySelectorAll('.gallery-dot').forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.remove('bg-gray-400', 'w-2')
        dot.classList.add('bg-white', 'w-6')
      } else {
        dot.classList.remove('bg-white', 'w-6')
        dot.classList.add('bg-gray-400', 'w-2')
      }
    })

    // Update caption
    const captionEl = this.container.querySelector('.gallery-caption')
    if (captionEl && this.photos[this.currentIndex]?.caption) {
      captionEl.textContent = this.photos[this.currentIndex].caption || ''
    }

    setTimeout(() => {
      this.isTransitioning = false
    }, 500)
  }

  /**
   * Navigate to the next photo
   */
  private next(): void {
    if (this.isTransitioning) return
    this.currentIndex = (this.currentIndex + 1) % this.photos.length
    this.updateGallery()
    this.resetAutoplay()
  }

  /**
   * Navigate to the previous photo
   */
  private prev(): void {
    if (this.isTransitioning) return
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length
    this.updateGallery()
    this.resetAutoplay()
  }

  /**
   * Navigate to a specific photo by index
   */
  private goToSlide(index: number): void {
    if (this.isTransitioning || index === this.currentIndex) return
    this.currentIndex = index
    this.updateGallery()
    this.resetAutoplay()
  }

  /**
   * Start autoplay
   */
  private startAutoplay(): void {
    this.stopAutoplay()
    this.autoplayInterval = window.setInterval(() => {
      this.next()
    }, this.autoplayDelay)
  }

  /**
   * Stop autoplay
   */
  private stopAutoplay(): void {
    if (this.autoplayInterval !== null) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }
  }

  /**
   * Reset autoplay (restart the timer)
   */
  private resetAutoplay(): void {
    this.startAutoplay()
  }

  /**
   * Attach event listeners for navigation
   */
  private attachEventListeners(): void {
    // Previous button
    const prevBtn = this.container.querySelector('.gallery-prev')
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev())
    }

    // Next button
    const nextBtn = this.container.querySelector('.gallery-next')
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next())
    }

    // Dot navigation
    this.container.querySelectorAll('.gallery-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index') || '0')
        this.goToSlide(index)
      })
    })

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev()
      } else if (e.key === 'ArrowRight') {
        this.next()
      }
    })

    // Touch/swipe support
    const track = this.container.querySelector('.gallery-track') as HTMLElement
    if (track) {
      track.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX
      })

      track.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX
        this.handleSwipe()
      })
    }

    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => {
      this.stopAutoplay()
    })

    this.container.addEventListener('mouseleave', () => {
      this.startAutoplay()
    })
  }

  /**
   * Handle swipe gesture
   */
  private handleSwipe(): void {
    const swipeThreshold = 50
    const diff = this.touchStartX - this.touchEndX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        this.next()
      } else {
        // Swipe right - previous
        this.prev()
      }
    }
  }

  /**
   * Destroy the gallery and clean up
   */
  destroy(): void {
    this.stopAutoplay()
    this.container.innerHTML = ''
  }
}
