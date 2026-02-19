/**
 * SVG URL Mappings Example
 *
 * This file demonstrates how to add URL mappings to replace external SVG URLs
 * with local files from /files/svg/ directory.
 *
 * Usage:
 * 1. Copy this file and rename to svg-url-mappings.js
 * 2. Add your external URLs and local file paths
 * 3. Include it in index.html before other SVG scripts:
 *    <script src="svg-url-mappings.js" defer></script>
 */

(function() {
  'use strict';

  /**
   * Wait for SVGStorage to load
   */
  function waitForSVGStorage(callback, maxAttempts = 50) {
    let attempts = 0;

    const check = () => {
      if (window.SVGStorage) {
        callback();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 100);
      } else {
        console.error('SVG Storage: Failed to load');
      }
    };

    check();
  }

  /**
   * Add all URL mappings
   */
  function setupMappings() {
    console.log('Setting up SVG URL mappings...');

    // Example 1: TildaCDN mappings
    // Replace these with actual URLs from your website
    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild-example-names.svg',
      'files/svg/names-vasily-maria.svg'
    );

    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild-example-date.svg',
      'files/svg/wedding-date.svg'
    );

    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild-example-schedule.svg',
      'files/svg/wedding-schedule.svg'
    );

    // Example 2: Custom CDN mappings
    // Uncomment and modify as needed
    /*
    SVGStorage.addUrlMapping(
      'https://cdn.example.com/assets/names.svg',
      'files/svg/names-vasily-maria.svg'
    );

    SVGStorage.addUrlMapping(
      'https://cdn.example.com/assets/date.svg',
      'files/svg/wedding-date.svg'
    );

    SVGStorage.addUrlMapping(
      'https://cdn.example.com/assets/schedule.svg',
      'files/svg/wedding-schedule.svg'
    );
    */

    // Example 3: Multiple source mappings
    // If you need to support multiple sources, add them all
    /*
    const mappings = [
      {
        external: 'https://example1.com/names.svg',
        local: 'files/svg/names-vasily-maria.svg'
      },
      {
        external: 'https://example2.com/date.svg',
        local: 'files/svg/wedding-date.svg'
      },
      {
        external: 'https://example3.com/schedule.svg',
        local: 'files/svg/wedding-schedule.svg'
      }
    ];

    mappings.forEach(mapping => {
      SVGStorage.addUrlMapping(mapping.external, mapping.local);
    });
    */

    // Display configured mappings
    const mappings = SVGStorage.getMappings();
    if (mappings.length > 0) {
      console.log('SVG URL Mappings configured:');
      console.table(mappings);
    }
  }

  /**
   * Initialize when SVGStorage is ready
   */
  waitForSVGStorage(() => {
    setupMappings();
    console.log('SVG URL Mappings: Ready');
  });

  // Expose function for manual mapping addition
  window.addSVGMapping = function(externalUrl, localPath) {
    if (window.SVGStorage) {
      SVGStorage.addUrlMapping(externalUrl, localPath);
      console.log(`SVG Mapping added: ${externalUrl} → ${localPath}`);
      return true;
    } else {
      console.error('SVGStorage not yet loaded');
      return false;
    }
  };

  /**
   * Helper function to find external SVG URLs on the page
   * Useful for discovering which URLs need to be mapped
   */
  window.discoverSVGUrls = function() {
    const urls = new Set();

    // Find in img src
    document.querySelectorAll('img[src]').forEach(img => {
      if (img.src.endsWith('.svg')) {
        urls.add(img.src);
      }
    });

    // Find in link href
    document.querySelectorAll('link[href]').forEach(link => {
      if (link.href.endsWith('.svg')) {
        urls.add(link.href);
      }
    });

    // Find in background-image styles
    document.querySelectorAll('[style*="background-image"]').forEach(el => {
      const match = el.style.backgroundImage?.match(/url\(['"]?([^'"()]+\.svg)['"()]?\)/);
      if (match) {
        urls.add(match[1]);
      }
    });

    // Find in data attributes
    document.querySelectorAll('[data-src*=".svg"]').forEach(el => {
      urls.add(el.getAttribute('data-src'));
    });

    return Array.from(urls);
  };

})();
