/* ============================================
   TROMOM Font Selector
   The Return of My Old Machine
   Simple dropdown for font testing
   ============================================ */

(function() {
  'use strict';

  const FONT_KEY = 'old-machine-font';
  const DEFAULT_FONT = 'roboto';
  const FONTS = {
    roboto: { name: 'Roboto Mono', desc: 'Current' },
    ibm: { name: 'IBM Plex Mono', desc: 'Mainframe' },
    jetbrains: { name: 'JetBrains Mono', desc: 'Modern' }
  };

  /**
   * Get the current font from localStorage or default
   */
  function getCurrentFont() {
    const stored = localStorage.getItem(FONT_KEY);
    return stored && FONTS[stored] ? stored : DEFAULT_FONT;
  }

  /**
   * Apply font to the document
   */
  function applyFont(font) {
    document.documentElement.setAttribute('data-font', font);
    localStorage.setItem(FONT_KEY, font);
  }

  /**
   * Select a font
   */
  function selectFont(font) {
    applyFont(font);
    updateFontSelector(font);
    closeFontDropdown();
  }

  /**
   * Update font selector display
   */
  function updateFontSelector(font) {
    const currentFontSpan = document.getElementById('currentFont');
    if (currentFontSpan) {
      currentFontSpan.textContent = FONTS[font].name.toUpperCase();
    }

    // Update active state in dropdown
    const options = document.querySelectorAll('.font-option');
    options.forEach(function(option) {
      const optionFont = option.getAttribute('data-font');
      if (optionFont === font) {
        option.classList.add('active');
        const dot = option.querySelector('.font-dot');
        if (dot) dot.textContent = '●';
      } else {
        option.classList.remove('active');
        const dot = option.querySelector('.font-dot');
        if (dot) dot.textContent = '○';
      }
    });
  }

  /**
   * Toggle font dropdown visibility
   */
  function toggleFontDropdown() {
    const dropdown = document.getElementById('fontDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  /**
   * Close font dropdown
   */
  function closeFontDropdown() {
    const dropdown = document.getElementById('fontDropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  /**
   * Create and inject the font selector
   */
  function createFontSelector() {
    // Wait for header to be available
    const checkHeader = setInterval(function() {
      const header = document.querySelector('.md-header__inner');
      
      if (header) {
        clearInterval(checkHeader);
        
        // Check if selector already exists
        if (document.querySelector('.font-selector')) {
          return;
        }

        const currentFont = getCurrentFont();

        // Create selector container
        const selector = document.createElement('div');
        selector.className = 'font-selector';

        // Create dropdown button
        const button = document.createElement('button');
        button.className = 'font-dropdown-btn';
        button.id = 'fontDropdownBtn';
        button.setAttribute('aria-label', 'Select font family');
        button.setAttribute('title', 'Choose monospace font');
        
        button.innerHTML = `
          <span class="font-icon">Aa</span>
          <span class="font-label">FONT: <span id="currentFont">${FONTS[currentFont].name.toUpperCase()}</span></span>
          <span class="dropdown-arrow">▼</span>
        `;

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'font-dropdown';
        dropdown.id = 'fontDropdown';

        // Create font options
        Object.keys(FONTS).forEach(function(fontKey) {
          const option = document.createElement('button');
          option.className = 'font-option' + (fontKey === currentFont ? ' active' : '');
          option.setAttribute('data-font', fontKey);
          
          option.innerHTML = `
            <span class="font-dot">${fontKey === currentFont ? '●' : '○'}</span>
            <span class="font-name">${FONTS[fontKey].name.toUpperCase()}</span>
            <span class="font-desc">${FONTS[fontKey].desc}</span>
          `;

          option.addEventListener('click', function() {
            selectFont(fontKey);
          });

          dropdown.appendChild(option);
        });

        // Add click handler to button
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleFontDropdown();
        });

        // Assemble selector
        selector.appendChild(button);
        selector.appendChild(dropdown);
        
        // Insert selector into header (before theme selector)
        const themeSelector = header.querySelector('.theme-selector');
        if (themeSelector) {
          header.insertBefore(selector, themeSelector);
        } else {
          header.appendChild(selector);
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
          const selector = document.querySelector('.font-selector');
          if (selector && !selector.contains(e.target)) {
            closeFontDropdown();
          }
        });
      }
    }, 100);

    // Safety timeout to stop checking after 5 seconds
    setTimeout(function() {
      clearInterval(checkHeader);
    }, 5000);
  }

  /**
   * Initialize font system
   */
  function init() {
    // Apply saved font immediately (before page renders)
    const font = getCurrentFont();
    applyFont(font);

    // Create font selector when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createFontSelector();
      });
    } else {
      createFontSelector();
    }

    // Re-create selector on navigation (for SPA-like behavior in Material)
    document.addEventListener('DOMContentLoaded', function() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
            const header = document.querySelector('.md-header__inner');
            const selector = document.querySelector('.font-selector');
            if (header && !selector) {
              createFontSelector();
            }
          }
        });
      });

      const container = document.querySelector('.md-container');
      if (container) {
        observer.observe(container, {
          childList: true,
          subtree: true
        });
      }
    });
  }

  // Initialize immediately
  init();
})();

