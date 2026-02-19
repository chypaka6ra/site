/**
 * Wedding Text Replacer
 * Dynamically finds and replaces wedding-related text throughout the page
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    groomName: 'Василий',
    brideName: 'Мария',
    weddingDate: '10 июня 2026',
    weddingDateShort: '10.06.2026',
    schedule: [
      { time: '13:00', event: 'Встреча гостей' },
      { time: '14:00', event: 'Торжественная церемония' },
      { time: '15:30', event: 'Фуршет и танцы' },
      { time: '18:00', event: 'Банкет' },
      { time: '23:00', event: 'Окончание' }
    ]
  };

  /**
   * Load local SVG files and cache them
   */
  async function cacheLocalSVGs() {
    const svgFiles = [
      'files/svg/names-vasily-maria.svg',
      'files/svg/wedding-date.svg',
      'files/svg/wedding-schedule.svg'
    ];

    for (const file of svgFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const content = await response.text();
          console.log(`Wedding Replacer: Cached SVG - ${file}`);
        }
      } catch (error) {
        console.error(`Wedding Replacer: Error loading SVG ${file}:`, error);
      }
    }
  }

  /**
   * Replace text in SVG images by creating overlays
   * Now searches for local SVG files instead of tildacdn
   */
  function replaceTextInImages() {
    // Find all images with local SVG files
    const images = document.querySelectorAll('img[src*="files/svg"]');

    images.forEach((img) => {
      const parent = img.closest('.tn-atom');
      if (!parent) return;

      // Create overlay div if needed
      if (!parent.querySelector('.custom-text-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-text-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.95);
          border-radius: 8px;
          z-index: 10;
        `;

        // Try to determine which overlay to show based on image size/position or src
        const width = parent.offsetWidth;
        const height = parent.offsetHeight;
        const src = img.src.toLowerCase();

        // Names section
        if (src.includes('names-vasily-maria') || (width > 200 && height > 200)) {
          overlay.innerHTML = `
            <div style="font-family: 'Montserrat Alternates', Arial, sans-serif; text-align: center;">
              <div style="font-size: 48px; font-weight: 400; color: #820000; margin-bottom: 20px;">${config.groomName}</div>
              <div style="font-size: 48px; font-weight: 400; color: #820000;">${config.brideName}</div>
            </div>
          `;
        }
        // Date section
        else if (src.includes('wedding-date') || (width > 100 && width < 300 && height < 150)) {
          overlay.innerHTML = `
            <div style="font-family: 'Montserrat Alternates', Arial, sans-serif; text-align: center;">
              <div style="font-size: 36px; font-weight: 400; color: #820000;">${config.weddingDate}</div>
            </div>
          `;
        }

        if (overlay.innerHTML) {
          parent.style.position = 'relative';
          parent.appendChild(overlay);
        }
      }
    });
  }

  /**
   * Replace date in page text
   */
  function replaceDateInText() {
    const bodyText = document.body.innerHTML;

    // Replace various date formats
    const datePatterns = [
      { pattern: /08\s+август/gi, replacement: '10 июня' },
      { pattern: /август/gi, replacement: 'июня' },
      { pattern: /\d{1,2}\s+августа/gi, replacement: '10 июня' }
    ];

    datePatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(bodyText)) {
        document.body.innerHTML = bodyText.replace(pattern, replacement);
      }
    });
  }

  /**
   * Replace schedule information
   */
  function replaceSchedule() {
    // Find elements that might contain schedule info
    const elements = document.querySelectorAll('[class*="schedule"], [data-schedule], .t-text');

    elements.forEach((el) => {
      const text = el.textContent.toLowerCase();

      // Look for schedule-related content
      if (text.includes('13:00') || text.includes('14:00') || text.includes('welcome')) {
        // Create schedule overlay
        if (!el.querySelector('.schedule-overlay')) {
          const scheduleHTML = `
            <div class="schedule-overlay" style="font-family: 'Montserrat Alternates', Arial, sans-serif;">
              ${config.schedule.map(item => `
                <div style="display: flex; gap: 20px; margin: 15px 0;">
                  <div style="font-size: 18px; font-weight: 600; color: #820000; min-width: 60px;">${item.time}</div>
                  <div style="font-size: 16px; color: #333;">${item.event}</div>
                </div>
              `).join('')}
            </div>
          `;
          el.innerHTML = scheduleHTML;
        }
      }
    });
  }

  /**
   * Initialize replacements when DOM is ready
   */
  function init() {
    // Cache local SVG files first
    cacheLocalSVGs();

    // Wait for images to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          replaceTextInImages();
          replaceDateInText();
          replaceSchedule();
        }, 500);
      });
    } else {
      setTimeout(() => {
        replaceTextInImages();
        replaceDateInText();
        replaceSchedule();
      }, 500);
    }

    // Also run on page load in case images load later
    window.addEventListener('load', () => {
      setTimeout(() => {
        replaceTextInImages();
        replaceDateInText();
        replaceSchedule();
      }, 1000);
    });
  }

  // Start initialization
  init();

  // Expose config for external modifications
  window.weddingConfig = config;

})();
