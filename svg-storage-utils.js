/**
 * SVG Storage Utilities
 * Provides helper functions and interceptors for SVG storage
 */

(function() {
  'use strict';

  /**
   * Wait for SVGStorage to be available
   */
  function waitForSVGStorage(callback, maxAttempts = 50) {
    let attempts = 0;

    const check = () => {
      if (window.SVGStorage) {
        callback();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 100);
      }
    };

    check();
  }

  /**
   * Console utilities for SVG Storage
   */
  class SVGStorageConsole {
    static showStats() {
      if (!window.SVGStorage) {
        console.log('SVG Storage: Not yet loaded');
        return;
      }

      const stats = window.SVGStorage.getStats();
      console.group('SVG Storage Statistics');
      console.log(`Total cached SVGs: ${stats.totalEntries}`);
      console.log(`Total size: ${this.formatBytes(stats.totalSize)}`);
      console.table(stats.entries.map(entry => ({
        'URL': entry.url,
        'Size': this.formatBytes(entry.size),
        'Age (hours)': (entry.age / (1000 * 60 * 60)).toFixed(2)
      })));
      console.groupEnd();
    }

    static clearCache() {
      if (!window.SVGStorage) {
        console.log('SVG Storage: Not yet loaded');
        return;
      }

      window.SVGStorage.clearCache();
      console.log('SVG Storage: Cache cleared');
    }

    static reloadSVGs() {
      if (!window.SVGStorage) {
        console.log('SVG Storage: Not yet loaded');
        return;
      }

      console.log('SVG Storage: Starting SVG reload...');
      window.SVGStorage.cachePageSVGs().then(() => {
        this.showStats();
      });
    }

    static formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
  }

  /**
   * Fetch interceptor for SVG files
   */
  class SVGFetchInterceptor {
    static install() {
      waitForSVGStorage(() => {
        // Store original fetch
        const originalFetch = window.fetch;

        // Override fetch
        window.fetch = function(...args) {
          const url = args[0];

          // Check if it's an SVG request
          if (typeof url === 'string' && url.endsWith('.svg')) {
            // Try to get from cache
            const cached = window.SVGStorage.getSVG(url);
            if (cached) {
              console.log(`SVG Fetch: Serving from cache - ${url}`);
              return Promise.resolve(
                new Response(cached, {
                  status: 200,
                  statusText: 'OK',
                  headers: new Headers({
                    'Content-Type': 'image/svg+xml'
                  })
                })
              );
            }
          }

          // Fall back to original fetch
          return originalFetch.apply(this, args);
        };

        console.log('SVG Storage: Fetch interceptor installed');
      });
    }
  }

  /**
   * Image element interceptor for lazy loading from cache
   */
  class SVGImageInterceptor {
    static install() {
      waitForSVGStorage(() => {
        // Intercept all img elements with SVG src
        const checkAndLoadSVGs = () => {
          document.querySelectorAll('img[src$=".svg"]').forEach(img => {
            if (img.dataset.svgCached !== 'true') {
              const cached = window.SVGStorage.getSVG(img.src);
              if (cached) {
                // Create data URL for cached SVG
                const blob = new Blob([cached], { type: 'image/svg+xml' });
                const dataUrl = URL.createObjectURL(blob);
                img.src = dataUrl;
                img.dataset.svgCached = 'true';
                console.log(`SVG Image: Loaded from cache - ${img.src}`);
              }
            }
          });
        };

        // Check immediately and on DOM changes
        checkAndLoadSVGs();

        // Watch for new images
        const observer = new MutationObserver(checkAndLoadSVGs);
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
  }

  /**
   * Service Worker registration for offline SVG support
   */
  class SVGServiceWorkerHelper {
    static async installServiceWorker() {
      if (!('serviceWorker' in navigator)) {
        console.log('SVG Storage: Service Worker not supported');
        return;
      }

      try {
        // Check if we should install
        const response = await fetch('/svg-storage-sw.js', { method: 'HEAD' });
        if (response.ok) {
          const registration = await navigator.serviceWorker.register('/svg-storage-sw.js');
          console.log('SVG Storage: Service Worker registered', registration);
        }
      } catch (error) {
        console.log('SVG Storage: Service Worker registration skipped', error.message);
      }
    }
  }

  /**
   * Initialize all utilities
   */
  function init() {
    // Install fetch interceptor
    SVGFetchInterceptor.install();

    // Install image interceptor
    SVGImageInterceptor.install();

    // Expose console utilities
    window.SVGStorageConsole = SVGStorageConsole;

    console.log('SVG Storage Utilities: Loaded');
    console.log('Available commands:');
    console.log('  SVGStorageConsole.showStats() - Show cache statistics');
    console.log('  SVGStorageConsole.clearCache() - Clear all cached SVGs');
    console.log('  SVGStorageConsole.reloadSVGs() - Reload and cache all SVGs on page');
  }

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
