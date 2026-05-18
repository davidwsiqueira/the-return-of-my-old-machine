/* ============================================
   TROMOM Theme Selector
   The Return of My Old Machine
   Dropdown selector for multiple retro themes
   ============================================ */

(function() {
  'use strict';

  const THEME_KEY = 'old-machine-theme';
  const DEFAULT_THEME = 'green';
  const THEMES = {
    green: { name: 'P1 Classic', desc: 'Green phosphor' },
    white: { name: 'VT100 Terminal', desc: 'White phosphor' },
    cyan: { name: 'IBM Mainframe', desc: 'Cyan terminal' }
  };
  const LOGOS = {
    green: '/the-return-of-my-old-machine/assets/logo-green.svg',
    cyan: '/the-return-of-my-old-machine/assets/logo-cyan.svg',
    white: '/the-return-of-my-old-machine/assets/logo-white.svg'
  };

  /**
   * Get the current theme from localStorage or default
   */
  function getCurrentTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    return stored && THEMES[stored] ? stored : DEFAULT_THEME;
  }

  /**
   * Apply theme to the document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateLogo(theme);
  }

  /**
   * Update logo based on theme
   */
  function updateLogo(theme) {
    // Update header logo
    const logoImg = document.querySelector('.md-header__button.md-logo img');
    if (logoImg) {
      logoImg.src = LOGOS[theme];
    }
    
    // Update favicon
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink) {
      faviconLink.href = LOGOS[theme];
    }
  }

  /**
   * Observe logo changes and update when navigation occurs
   */
  function observeLogoChanges() {
    const observer = new MutationObserver(function() {
      const theme = getCurrentTheme();
      updateLogo(theme);
    });

    const header = document.querySelector('.md-header');
    if (header) {
      observer.observe(header, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Select a theme
   */
  function selectTheme(theme) {
    applyTheme(theme);
    updateThemeSelector(theme);
    closeDropdown();
  }

  /**
   * Update theme selector display
   */
  function updateThemeSelector(theme) {
    const currentThemeSpan = document.getElementById('currentTheme');
    if (currentThemeSpan) {
      currentThemeSpan.textContent = THEMES[theme].name.toUpperCase();
    }

    // Update active state in dropdown
    const options = document.querySelectorAll('.theme-option');
    options.forEach(function(option) {
      const optionTheme = option.getAttribute('data-theme');
      if (optionTheme === theme) {
        option.classList.add('active');
        const dot = option.querySelector('.theme-dot');
        if (dot) dot.textContent = '●';
      } else {
        option.classList.remove('active');
        const dot = option.querySelector('.theme-dot');
        if (dot) dot.textContent = '○';
      }
    });
  }

  /**
   * Toggle dropdown visibility
   */
  function toggleDropdown() {
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  /**
   * Close dropdown
   */
  function closeDropdown() {
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  /**
   * Create and inject the theme selector
   */
  function createThemeSelector() {
    // Wait for header to be available
    const checkHeader = setInterval(function() {
      const header = document.querySelector('.md-header__inner');
      
      if (header) {
        clearInterval(checkHeader);
        
        // Check if selector already exists
        if (document.querySelector('.theme-selector')) {
          return;
        }

        const currentTheme = getCurrentTheme();

        // Create selector container
        const selector = document.createElement('div');
        selector.className = 'theme-selector';

        // Create dropdown button
        const button = document.createElement('button');
        button.className = 'theme-dropdown-btn';
        button.id = 'themeDropdownBtn';
        button.setAttribute('aria-label', 'Select color theme');
        button.setAttribute('title', 'Choose retro CRT theme');
        
        button.innerHTML = `
          <span class="theme-icon">⚙</span>
          <span class="theme-label">THEME: <span id="currentTheme">${THEMES[currentTheme].name.toUpperCase()}</span></span>
          <span class="dropdown-arrow">▼</span>
        `;

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'theme-dropdown';
        dropdown.id = 'themeDropdown';

        // Create theme options
        Object.keys(THEMES).forEach(function(themeKey) {
          const option = document.createElement('button');
          option.className = 'theme-option' + (themeKey === currentTheme ? ' active' : '');
          option.setAttribute('data-theme', themeKey);
          
          option.innerHTML = `
            <span class="theme-dot ${themeKey}">${themeKey === currentTheme ? '●' : '○'}</span>
            <span class="theme-name">${THEMES[themeKey].name.toUpperCase()}</span>
            <span class="theme-desc">${THEMES[themeKey].desc}</span>
          `;

          option.addEventListener('click', function() {
            selectTheme(themeKey);
          });

          dropdown.appendChild(option);
        });

        // Add click handler to button
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleDropdown();
        });

        // Assemble selector
        selector.appendChild(button);
        selector.appendChild(dropdown);
        
        // Insert selector into header
        header.appendChild(selector);

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
          const selector = document.querySelector('.theme-selector');
          if (selector && !selector.contains(e.target)) {
            closeDropdown();
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
   * Initialize theme system
   */
  function init() {
    // Apply saved theme immediately (before page renders)
    const theme = getCurrentTheme();
    applyTheme(theme);

    // Create theme selector when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createThemeSelector();
        observeLogoChanges();
      });
    } else {
      createThemeSelector();
      observeLogoChanges();
    }

    // Re-create selector on navigation (for SPA-like behavior in Material)
    document.addEventListener('DOMContentLoaded', function() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
            const header = document.querySelector('.md-header__inner');
            const selector = document.querySelector('.theme-selector');
            if (header && !selector) {
              createThemeSelector();
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