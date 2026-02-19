/**
 * SVG Storage Manager
 * Handles caching and retrieval of SVG files from local storage
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    storageKey: 'svg_cache',
    maxStorageSize: 5 * 1024 * 1024, // 5MB
    version: 1,
    ttl: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  };

  /**
   * SVG Storage Manager Class
   */
  class SVGStorageManager {
    constructor() {
      this.cache = null;
      this.initialized = false;
      this.init();
    }

    /**
     * Initialize the storage manager
     */
    init() {
      try {
        // Check if localStorage is available
        if (!this.isLocalStorageAvailable()) {
          console.warn('SVG Storage: localStorage is not available');
          return;
        }

        this.loadCache();
        this.cleanExpiredEntries();
        this.initialized = true;
      } catch (error) {
        console.error('SVG Storage: Initialization error', error);
      }
    }

    /**
     * Check if localStorage is available
     */
    isLocalStorageAvailable() {
      try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * Load cache from localStorage
     */
    loadCache() {
      try {
        const data = localStorage.getItem(config.storageKey);
        if (data) {
          this.cache = JSON.parse(data);
          if (!this.cache.version || this.cache.version !== config.version) {
            this.cache = this.createEmptyCache();
          }
        } else {
          this.cache = this.createEmptyCache();
        }
      } catch (error) {
        console.warn('SVG Storage: Error loading cache', error);
        this.cache = this.createEmptyCache();
      }
    }

    /**
     * Create an empty cache structure
     */
    createEmptyCache() {
      return {
        version: config.version,
        entries: {},
        createdAt: Date.now()
      };
    }

    /**
     * Save cache to localStorage
     */
    saveCache() {
      try {
        if (!this.initialized) return;

        const data = JSON.stringify(this.cache);
        const size = new Blob([data]).size;

        if (size > config.maxStorageSize) {
          console.warn('SVG Storage: Cache size exceeds limit, removing old entries');
          this.removeOldestEntries();
          return this.saveCache();
        }

        localStorage.setItem(config.storageKey, data);
      } catch (error) {
        console.error('SVG Storage: Error saving cache', error);
        if (error.name === 'QuotaExceededError') {
          this.removeOldestEntries();
          this.saveCache();
        }
      }
    }

    /**
     * Clean expired entries from cache
     */
    cleanExpiredEntries() {
      const now = Date.now();
      const entries = this.cache.entries;
      let removed = 0;

      for (const key in entries) {
        if (entries.hasOwnProperty(key)) {
          const entry = entries[key];
          if (now - entry.timestamp > config.ttl) {
            delete entries[key];
            removed++;
          }
        }
      }

      if (removed > 0) {
        this.saveCache();
        console.log(`SVG Storage: Removed ${removed} expired entries`);
      }
    }

    /**
     * Remove oldest entries when storage limit is exceeded
     */
    removeOldestEntries() {
      const entries = this.cache.entries;
      const sortedEntries = Object.entries(entries)
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      // Remove oldest 25% of entries
      const removeCount = Math.ceil(sortedEntries.length * 0.25);
      for (let i = 0; i < removeCount; i++) {
        delete entries[sortedEntries[i][0]];
      }
    }

    /**
     * Store SVG content
     */
    async storeSVG(url, content) {
      if (!this.initialized) return false;

      try {
        const key = this.generateKey(url);
        this.cache.entries[key] = {
          url: url,
          content: content,
          timestamp: Date.now(),
          size: new Blob([content]).size
        };

        this.saveCache();
        return true;
      } catch (error) {
        console.error('SVG Storage: Error storing SVG', error);
        return false;
      }
    }

    /**
     * Retrieve SVG content from cache
     */
    getSVG(url) {
      if (!this.initialized) return null;

      try {
        const key = this.generateKey(url);
        const entry = this.cache.entries[key];

        if (entry) {
          entry.timestamp = Date.now(); // Update access time
          this.saveCache();
          return entry.content;
        }

        return null;
      } catch (error) {
        console.error('SVG Storage: Error retrieving SVG', error);
        return null;
      }
    }

    /**
     * Check if SVG is cached
     */
    hasSVG(url) {
      if (!this.initialized) return false;
      const key = this.generateKey(url);
      return key in this.cache.entries;
    }

    /**
     * Generate cache key from URL
     */
    generateKey(url) {
      return `svg_${url}`;
    }

    /**
     * Clear all cached SVGs
     */
    clearCache() {
      try {
        this.cache = this.createEmptyCache();
        localStorage.removeItem(config.storageKey);
        return true;
      } catch (error) {
        console.error('SVG Storage: Error clearing cache', error);
        return false;
      }
    }

    /**
     * Get cache statistics
     */
    getStats() {
      const entries = this.cache.entries;
      const stats = {
        totalEntries: Object.keys(entries).length,
        totalSize: 0,
        entries: []
      };

      for (const key in entries) {
        if (entries.hasOwnProperty(key)) {
          const entry = entries[key];
          stats.totalSize += entry.size;
          stats.entries.push({
            url: entry.url,
            size: entry.size,
            age: Date.now() - entry.timestamp
          });
        }
      }

      return stats;
    }
  }

  /**
   * SVG Loader - handles fetching and caching SVGs
   */
  class SVGLoader {
    constructor(storageManager) {
      this.storage = storageManager;
      this.loadedSVGs = new Set();
    }

    /**
     * Load SVG with caching support
     */
    async loadSVG(url) {
      // Check if already cached
      const cached = this.storage.getSVG(url);
      if (cached) {
        console.log(`SVG Storage: Loaded from cache - ${url}`);
        return cached;
      }

      try {
        // Fetch from server
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch SVG: ${response.statusText}`);
        }

        const content = await response.text();

        // Store in cache
        await this.storage.storeSVG(url, content);
        console.log(`SVG Storage: Cached - ${url}`);

        return content;
      } catch (error) {
        console.error(`SVG Storage: Error loading SVG ${url}:`, error);
        return null;
      }
    }

    /**
     * Find and cache all SVG files on the page
     */
    async cachePageSVGs() {
      const svgUrls = this.findAllSVGUrls();

      for (const url of svgUrls) {
        if (!this.loadedSVGs.has(url)) {
          await this.loadSVG(url);
          this.loadedSVGs.add(url);
        }
      }

      console.log(`SVG Storage: Cached ${svgUrls.length} SVG files`);
    }

    /**
     * Find all SVG URLs on the page
     */
    findAllSVGUrls() {
      const urls = new Set();

      // Find SVG elements with src attributes
      document.querySelectorAll('img[src$=".svg"]').forEach(img => {
        urls.add(img.src);
      });

      // Find SVG files in link tags
      document.querySelectorAll('link[href$=".svg"]').forEach(link => {
        urls.add(link.href);
      });

      // Find SVG background images in CSS
      document.querySelectorAll('[style*="svg"]').forEach(el => {
        const match = el.style.backgroundImage?.match(/url\(['"]?([^'"()]+\.svg)['"()]?\)/);
        if (match) {
          urls.add(match[1]);
        }
      });

      // Find inline SVG data
      document.querySelectorAll('svg[data-src]').forEach(svg => {
        urls.add(svg.getAttribute('data-src'));
      });

      // Auto-discover SVG files from files/svg/ directory
      const svgFiles = [
        'files/svg/names-vasily-maria.svg',
        'files/svg/wedding-date.svg',
        'files/svg/wedding-schedule.svg'
      ];

      // Convert relative paths to absolute URLs
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
      svgFiles.forEach(file => {
        const fullUrl = new URL(file, baseUrl).href;
        urls.add(fullUrl);
      });

      return Array.from(urls);
    }
  }

  // Initialize storage manager and loader
  const storageManager = new SVGStorageManager();
  const svgLoader = new SVGLoader(storageManager);

  /**
   * Initialize SVG caching when DOM is ready
   */
  function initSVGStorage() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          svgLoader.cachePageSVGs();
        }, 500);
      });
    } else {
      setTimeout(() => {
        svgLoader.cachePageSVGs();
      }, 500);
    }

    // Also cache on page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        svgLoader.cachePageSVGs();
      }, 1000);
    });
  }

  // Start initialization
  initSVGStorage();

  // Expose API to window for external access
  window.SVGStorage = {
    loadSVG: (url) => svgLoader.loadSVG(url),
    getSVG: (url) => storageManager.getSVG(url),
    hasSVG: (url) => storageManager.hasSVG(url),
    clearCache: () => storageManager.clearCache(),
    getStats: () => storageManager.getStats(),
    cachePageSVGs: () => svgLoader.cachePageSVGs()
  };

  console.log('SVG Storage: Module loaded');

})();
