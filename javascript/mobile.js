/**
 * NATIVE iOS 26 PORTFOLIO SITE CONTROLLER
 * Handles lock screen, dynamic widgets, widgets rotation, dynamic island queue,
 * app launching/transitions, spotlight search index, contact form submissions,
 * terminal prompt, and portfolio detail layouts.
 */

(function () {
  const isMobileView = () => window.innerWidth < 768;

  // Global Mobile State
  const state = {
    isUnlocked: true,
    activeApp: null,
    activeTestimonial: 0,
    islandTimeout: null,
    pricingEstimate: {
      type: 1500,
      typeName: 'Widescreen Trailer',
      addons: ['sound', 'grading']
    }
  };

  // Testimonials Array
  const testimonials = [
    { text: '"The color grading looks absolutely stunning! Highly recommend Dharmik."', author: '— Sarah J., Netflix Ad Lead' },
    { text: '"Oh my gosh, we loved the Haldi video edit so much! The transition cuts to the music beats are perfect."', author: '— Krupal & Krupali' },
    { text: '"The store advertisement video edited for Saurashtra Refrigeration is performing exceptionally well!"', author: '— Jiten Patel, Director' }
  ];

  let initialized = false;

  // Initialize Mobile Experience
  function initMobile() {
    if (!isMobileView()) {
      document.getElementById('mobile-only-experience').classList.add('ios-hide');
      return;
    }

    if (initialized) {
      document.getElementById('mobile-only-experience').classList.remove('ios-hide');
      return;
    }

    initialized = true;

    // Show mobile container
    document.getElementById('mobile-only-experience').classList.remove('ios-hide');

    // Setup Clocks
    updateClocks();
    setInterval(updateClocks, 1000);

    // Setup Testimonials Rotate
    rotateTestimonial();
    setInterval(rotateTestimonial, 5000);

    // Setup App Launchers
    setupAppLauncher();

    // Setup Spotlight Gesture
    setupSpotlight();

    // Setup Dynamic Island initial welcome
    setTimeout(() => {
      triggerIslandNotification('Dharmik Vaja', 'Video Portfolio App Active', '🎥');
    }, 1500);
  }

  // 1. CLOCK & TIME MANAGEMENT
  function updateClocks() {
    const timeElements = [
      document.getElementById('ios-status-time'),
      document.getElementById('widget-clock-time')
    ];

    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = `${hours}:${strMinutes} ${ampm}`;

    timeElements.forEach(el => {
      if (el) el.textContent = timeStr;
    });

    if (dateElement) {
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  // 2. TESTIMONIALS SLIDER
  function rotateTestimonial() {
    const textEl = document.getElementById('widget-testimonial-text');
    const authorEl = document.getElementById('widget-testimonial-author');
    if (!textEl || !authorEl) return;

    state.activeTestimonial = (state.activeTestimonial + 1) % testimonials.length;
    const item = testimonials[state.activeTestimonial];

    textEl.style.opacity = 0;
    authorEl.style.opacity = 0;

    setTimeout(() => {
      textEl.textContent = item.text;
      authorEl.textContent = item.author;
      textEl.style.opacity = 1;
      authorEl.style.opacity = 1;
    }, 400);
  }

  // 3. LOCK SCREEN BYPASSED

  // 4. DYNAMIC ISLAND NOTIFICATION
  function triggerIslandNotification(title, sub, iconHtml) {
    const island = document.getElementById('ios-island');
    const content = document.getElementById('ios-island-content');
    if (!island || !content) return;

    // Clear previous timeout
    if (state.islandTimeout) clearTimeout(state.islandTimeout);

    // Expand Island
    island.classList.add('expanded');
    content.innerHTML = `
      <div class="island-notif">
        <div class="island-icon" style="font-size: 24px; display: flex; align-items: center; justify-content: center;">${iconHtml}</div>
        <div class="island-notif-info">
          <div class="island-notif-title">${title}</div>
          <div class="island-notif-sub">${sub}</div>
        </div>
      </div>
    `;

    // Contract Island after delay
    state.islandTimeout = setTimeout(() => {
      island.classList.remove('expanded');
      content.innerHTML = `<div class="ios-island-pill"></div>`;
    }, 4000);
  }

  // 5. SPOTLIGHT SEARCH (SWIPE DOWN)
  function setupSpotlight() {
    const homeScreen = document.getElementById('ios-home-screen');
    const spotlight = document.getElementById('ios-spotlight');
    const input = document.getElementById('ios-spotlight-input');
    const cancel = document.getElementById('ios-spotlight-cancel');
    const resultsContainer = document.getElementById('ios-spotlight-results');

    if (!homeScreen || !spotlight || !input || !cancel || !resultsContainer) return;

    // Swipe down on home screen scroll container to show spotlight
    let startY = 0;
    const container = homeScreen.querySelector('.ios-home-scroll-container');
    
    container.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });

    container.addEventListener('touchend', (e) => {
      const endY = e.changedTouches[0].clientY;
      // Trigger if swiping down from the very top
      if (container.scrollTop === 0 && endY - startY > 100) {
        showSpotlight();
      }
    });

    // Double tap wallpaper to open spotlight as fallback
    homeScreen.querySelector('.ios-home-bg').addEventListener('click', (e) => {
      showSpotlight();
    });

    cancel.addEventListener('click', hideSpotlight);

    // Input listening
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      if (!query) {
        resultsContainer.innerHTML = '';
        return;
      }
      performSearch(query);
    });

    function showSpotlight() {
      spotlight.classList.add('active');
      input.value = '';
      resultsContainer.innerHTML = '';
      setTimeout(() => input.focus(), 150);
    }

    function hideSpotlight() {
      spotlight.classList.remove('active');
      input.blur();
    }

    function performSearch(query) {
      const matches = [];

      // Search Apps
      const apps = [
        { id: 'brand-commercials', name: 'Commercials', desc: 'Commercial advertisement portfolio videos', icon: 'movie', type: 'App' },
        { id: 'wedding-teaser', name: 'Wedding Films', desc: 'Cinematic luxury wedding teasers', icon: 'favorite', type: 'App' },
        { id: 'wedding-Highlight', name: 'Highlights', desc: 'Short-form wedding highlight films', icon: 'flash_on', type: 'App' },
        { id: 'wedding-reel', name: 'Reels', desc: 'Wedding reels and Instagram stories', icon: 'video_library', type: 'App' },
        { id: 'case-studies-soon', name: 'Case Studies', desc: 'Project case studies & workflows', icon: 'insert_chart', type: 'App' },
        { id: 'pricing', name: 'Pricing Packages', desc: 'Service rates & package details', icon: 'payments', type: 'App' },
        { id: 'about', name: 'About Dharmik', desc: 'Bio, creative experience & technical skills', icon: 'person', type: 'App' },
        { id: 'contact', name: 'Contact Form', desc: 'Book direct inquiries & request estimates', icon: 'mail', type: 'App' }
      ];

      apps.forEach(app => {
        if (app.name.toLowerCase().includes(query) || app.desc.toLowerCase().includes(query)) {
          matches.push(app);
        }
      });

      // Search Projects
      if (typeof projectsData !== 'undefined') {
        Object.keys(projectsData).forEach(folderId => {
          projectsData[folderId].forEach(proj => {
            if (proj.title.toLowerCase().includes(query) || proj.description.toLowerCase().includes(query)) {
              matches.push({
                id: folderId,
                name: proj.title,
                desc: proj.description,
                icon: 'video_library',
                type: 'Video Project',
                videoUrl: proj.video,
                videoType: proj.type
              });
            }
          });
        });
      }

      if (matches.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 20px; opacity: 0.5; font-size: 13px; text-align: center;">No results found</div>';
        return;
      }

      resultsContainer.innerHTML = `
        <div class="spotlight-section-title">Top Hits</div>
        ${matches.map(item => `
          <div class="spotlight-result-card" data-app-id="${item.id}" data-type="${item.type}" data-video-url="${item.videoUrl || ''}" data-video-type="${item.videoType || ''}">
            <div class="spotlight-result-icon" style="background: ${item.type === 'App' ? '#007aff' : '#ff9500'};">
              <span class="material-icons-round">${item.icon}</span>
            </div>
            <div class="spotlight-result-text">
              <div class="spotlight-result-name">${item.name}</div>
              <div class="spotlight-result-desc">${item.type} • ${item.desc}</div>
            </div>
          </div>
        `).join('')}
      `;

      // Results tap handling
      resultsContainer.querySelectorAll('.spotlight-result-card').forEach(card => {
        card.addEventListener('click', () => {
          const appId = card.getAttribute('data-app-id');
          const type = card.getAttribute('data-type');
          hideSpotlight();

          if (type === 'App') {
            launchApp(appId);
          } else {
            // It's a video result - open the specific gallery app and launch the player details overlay
            launchApp(appId);
            setTimeout(() => {
              const videoUrl = card.getAttribute('data-video-url');
              const videoType = card.getAttribute('data-video-type');
              const projTitle = card.querySelector('.spotlight-result-name').textContent;
              const projDesc = card.getAttribute('data-video-desc') || 'Cinematic video production and creative storytelling.';
              openVideoDetailOverlay(projTitle, projDesc, videoUrl, videoType);
            }, 500);
          }
        });
      });
    }
  }

  // 6. APP SHELL LAUNCH & CLOSE
  function setupAppLauncher() {
    const apps = document.querySelectorAll('.ios-app-item, .ios-dock-icon');
    const closeBtn = document.getElementById('ios-app-close-btn');

    apps.forEach(app => {
      app.addEventListener('click', () => {
        const appId = app.getAttribute('data-app-id');
        launchApp(appId);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeActiveApp);
    }
  }

  function launchApp(appId) {
    const shell = document.getElementById('ios-app-shell');
    const body = document.getElementById('ios-app-shell-body');
    const title = document.getElementById('ios-app-shell-title');

    if (!shell || !body || !title) return;

    state.activeApp = appId;
    body.innerHTML = ''; // Clear previous content
    body.scrollTop = 0;

    let appName = 'App';
    let appContent = '';

    // Route Content
    if (appId === 'brand-commercials') {
      appName = 'Commercials';
      appContent = renderGalleryScreen('brand-commercials');
    } else if (appId === 'wedding-teaser') {
      appName = 'Wedding Films';
      appContent = renderGalleryScreen('wedding-teaser');
    } else if (appId === 'wedding-Highlight') {
      appName = 'Highlights';
      appContent = renderGalleryScreen('wedding-Highlight');
    } else if (appId === 'wedding-reel') {
      appName = 'Wedding Reels';
      appContent = renderGalleryScreen('wedding-reel');
    } else if (appId === 'case-studies-soon') {
      appName = 'Case Studies';
      appContent = renderGalleryScreen('case-studies-soon');
    } else if (appId === 'pricing') {
      appName = 'Pricing';
      appContent = renderPricingScreen();
    } else if (appId === 'about') {
      appName = 'About';
      appContent = renderAboutScreen();
    } else if (appId === 'contact') {
      appName = 'Contact';
      appContent = renderContactScreen();
    } else if (appId === 'resume') {
      appName = 'Resume';
      appContent = renderResumeScreen();
    } else if (appId === 'terminal') {
      appName = 'Terminal';
      appContent = renderTerminalScreen();
    }

    title.textContent = appName;
    body.innerHTML = appContent;

    // Activate Shell with native zoom expansion
    shell.classList.add('active');
    triggerIslandNotification(appName, 'Opened fullscreen', '📱');

    // Post-rendering bindings
    bindAppLogic(appId);
  }

  function closeActiveApp() {
    const shell = document.getElementById('ios-app-shell');
    if (!shell) return;

    shell.classList.remove('active');
    state.activeApp = null;
  }

  // 7. APP RENDER METHODS
  function renderGalleryScreen(folderId) {
    if (typeof projectsData === 'undefined') return '<p style="padding:20px;">No projects data loaded.</p>';

    const projects = projectsData[folderId] || [];
    return `
      <div class="ios-gallery-container">
        ${projects.map(proj => `
          <div class="ios-gallery-card">
            <div class="ios-gallery-thumb-wrapper">
              <img src="${proj.thumbnail}" alt="${proj.title}" class="ios-gallery-thumb" loading="lazy">
              <button class="ios-gallery-play-btn" data-video="${proj.video}" data-type="${proj.type}" data-title="${proj.title}" data-desc="${proj.description}">
                <span class="material-icons-round">play_arrow</span>
              </button>
            </div>
            <div class="ios-gallery-card-info">
              <h3 class="ios-gallery-card-title">${proj.title}</h3>
              <p class="ios-gallery-card-desc">${proj.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPricingScreen() {
    return `
      <div class="ios-pricing-container">
        <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 4px 0;">Editing Packages</h2>
        <p style="font-size: 12px; opacity: 0.6; margin: 0 0 16px 0;">Standardized options for premium digital video editing and color grading.</p>

        <!-- Package 1 -->
        <div class="pricing-pkg-card">
          <div class="pkg-type-header">
            <span class="pkg-name">Vertical Reels Cut</span>
            <span class="pkg-price">$600</span>
          </div>
          <p class="pkg-desc">High-tempo vertical editing optimized for TikTok and Instagram Reels (under 60 seconds).</p>
          <div class="pkg-features">
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Rhythmic beat syncing</div>
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Vertical subtitle assets</div>
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Color enhancement grading</div>
          </div>
          <button class="pkg-book-btn" onclick="launchApp('contact'); setTimeout(()=>prefForm('Social Reels', '$1,000 - $3,000', 'Vertical Reels Cut booking'), 200);">Select Plan</button>
        </div>

        <!-- Package 2 (Premium Highlight) -->
        <div class="pricing-pkg-card premium">
          <div class="pkg-type-header">
            <span class="pkg-name">Wedding Film Trailer</span>
            <span class="pkg-price">$1,500</span>
          </div>
          <p class="pkg-desc">Cinematic trailer mapping key speeches, architectural sweeps, and wedding moments (3-5 minutes).</p>
          <div class="pkg-features">
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Advanced DaVinci grading nodes</div>
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Multicam sync + Audio mixes</div>
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Licensed backing soundtrack</div>
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> 2 Draft revisions</div>
          </div>
          <button class="pkg-book-btn" onclick="launchApp('contact'); setTimeout(()=>prefForm('Wedding Film', '$1,000 - $3,000', 'Wedding Film Trailer plan'), 200);">Book Highlight</button>
        </div>

        <!-- Package 3 -->
        <div class="pricing-pkg-card">
          <div class="pkg-type-header">
            <span class="pkg-name">Commercial Ad Cut</span>
            <span class="pkg-price">$2,000</span>
          </div>
          <p class="pkg-desc">Cinematic commercial promos for corporate launches, events, and luxury storefronts (30-90 seconds).</p>
          <div class="pkg-features">
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> High-converting narrative cuts</div>
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Dynamic motion text graphics</div>
            <div class="pkg-feature-item"><span class="material-icons-round">check_circle</span> Immersive sound effects design</div>
          </div>
          <button class="pkg-book-btn" onclick="launchApp('contact'); setTimeout(()=>prefForm('Brand Ad', '$1,000 - $3,000', 'Commercial Ad Cut booking'), 200);">Book Commercial</button>
        </div>

        <!-- Spec Estimator Widget -->
        <div class="pricing-estimator">
          <div class="estimator-title">Apple-Style Rate Estimator</div>
          
          <label style="font-size: 11px; font-weight: 700; opacity: 0.8; margin-bottom: 6px; display: block;">Video Project Type</label>
          <select id="ios-est-type" class="estimator-select">
            <option value="1500" selected>Wedding Trailer ($1,500)</option>
            <option value="600">Vertical Reel ($600)</option>
            <option value="2000">Commercial Ad ($2,000)</option>
          </select>

          <label style="font-size: 11px; font-weight: 700; opacity: 0.8; margin-bottom: 8px; display: block;">Add-on Production Specs</label>
          <div class="estimator-checkboxes">
            <label class="estimator-checkbox-label">
              <input type="checkbox" id="addon-sound" value="300" checked> Sound Design mixing (+$300)
            </label>
            <label class="estimator-checkbox-label">
              <input type="checkbox" id="addon-grade" value="400" checked> DaVinci Color grading (+$400)
            </label>
            <label class="estimator-checkbox-label">
              <input type="checkbox" id="addon-fast" value="500"> Express 48-Hour delivery (+$500)
            </label>
          </div>

          <div class="estimator-total-row">
            <span class="estimator-total-lbl">ESTIMATED TOTAL</span>
            <span class="estimator-total-val" id="ios-est-total">$2,200</span>
          </div>

          <button class="ios-form-submit-btn" id="ios-est-book" style="margin-top: 14px; width: 100%;">Book Custom Specs</button>
        </div>
      </div>
    `;
  }

  function renderAboutScreen() {
    return `
      <div class="ios-about-container">
        <!-- Hero card -->
        <div class="about-hero">
          <img src="./background/dv.png" alt="Dharmik Vaja" class="about-avatar">
          <div class="about-meta">
            <h2 class="about-name">Dharmik Vaja</h2>
            <div class="about-title">Lead Video Editor & Creative Director</div>
          </div>
        </div>

        <!-- Bio description -->
        <div class="about-bio">
          "I specialize in luxury wedding cinematography edits, short-form narrative videos, and color grading. My work translates raw log clips into cinematic visual stories using high-tempo beat pacing, curve correction color sciences, and immersive audio layers."
        </div>

        <!-- Experience Timeline -->
        <h3 style="font-size:15px; font-weight:700; margin: 10px 0 2px 0;">Work Experience</h3>
        <div class="timeline-list">
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-date">2021 - PRESENT</div>
            <div class="timeline-title">Freelance Video Editor & Colorist</div>
            <div class="timeline-desc">Color-grading raw log S-log3/REDCODE footages, soundscapes editing, and multi-cam synchronization.</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-date">2023 - PRESENT</div>
            <div class="timeline-title">UI & Web Frontend Developer</div>
            <div class="timeline-desc">Building premium visual portfolio experiences using vanilla JavaScript and micro-animations systems.</div>
          </div>
        </div>

        <!-- Technical Tools Skills -->
        <h3 style="font-size:15px; font-weight:700; margin: 10px 0 2px 0;">Production Tools</h3>
        <div class="skills-card-list">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
              <span>DaVinci Resolve Studio (Color Grading)</span>
              <span>95%</span>
            </div>
            <div class="skill-progress-bar-container">
              <div class="skill-progress-fill" style="width: 95%;"></div>
            </div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
              <span>Adobe Premiere Pro (Editing)</span>
              <span>90%</span>
            </div>
            <div class="skill-progress-bar-container">
              <div class="skill-progress-fill" style="width: 90%;"></div>
            </div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
              <span>Adobe After Effects (Motion Design)</span>
              <span>75%</span>
            </div>
            <div class="skill-progress-bar-container">
              <div class="skill-progress-fill" style="width: 75%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderContactScreen() {
    return `
      <div class="ios-contact-container">
        <h2 style="font-size: 20px; font-weight: 800; margin:0 0 2px 0;">Inquiry & Booking</h2>
        <p style="font-size:12px; opacity:0.6; margin:0 0 14px 0;">Submit project specifications below. Dharmik will reply within 24 hours.</p>

        <form id="ios-form-inquiry" style="display:flex; flex-direction:column; gap:14px;">
          <div class="ios-form-group">
            <label>Name</label>
            <input type="text" id="ios-form-name" required placeholder="e.g. John Doe">
          </div>
          
          <div class="ios-form-group">
            <label>Email</label>
            <input type="email" id="ios-form-email" required placeholder="e.g. email@address.com">
          </div>

          <div class="ios-form-group">
            <label>Project Type</label>
            <select id="ios-form-type">
              <option value="Wedding Film">Luxury Wedding Film</option>
              <option value="Teaser / Highlight">Teaser / Highlight Cut</option>
              <option value="Brand Ad">Commercial / Brand Ad</option>
              <option value="Social Reels">Social Reels / Shorts</option>
              <option value="Other">Custom Collaboration</option>
            </select>
          </div>

          <div class="ios-form-group">
            <label>Estimated Budget</label>
            <select id="ios-form-budget">
              <option value="$1,000 - $3,000">$1,000 - $3,000</option>
              <option value="$3,000 - $5,000">$3,000 - $5,000</option>
              <option value="$5,000 - $10,000">$5,000 - $10,000</option>
              <option value="$10,000+">$10,000+ (Premium Campaign)</option>
            </select>
          </div>

          <div class="ios-form-group">
            <label>Timeline / Details</label>
            <textarea id="ios-form-description" required rows="4" placeholder="Briefly describe your project details, dates, and requirements..."></textarea>
          </div>

          <button type="submit" class="ios-form-submit-btn">Send Work Proposal</button>
        </form>
      </div>
    `;
  }

  function renderResumeScreen() {
    return `
      <div class="ios-resume-container">
        <div class="ios-resume-header">
          <h2 style="margin: 0; font-size: 18px; font-weight: 800;">Dharmik Vaja Resume</h2>
          <p style="margin: 0; font-size: 11px; opacity: 0.6;">Cinematography Editor & Web Developer</p>
          <a href="#" class="ios-form-submit-btn" style="text-decoration:none; display:inline-block; font-size:12px; margin-top:4px;" onclick="alert('Resume PDF download simulation triggered.')">Download PDF Resume</a>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.06); padding: 16px; border-radius: 20px; display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="margin:0 0 4px 0; font-size:11px; color:#ff9500; text-transform:uppercase;">Education</h4>
            <div style="font-weight:700; font-size:13px;">Creative Media Arts Specialist</div>
            <div style="font-size:11px; opacity:0.6; margin-top:1px;">Media Production & Color Grading, IN</div>
          </div>
          
          <div>
            <h4 style="margin:0 0 4px 0; font-size:11px; color:#ff9500; text-transform:uppercase;">Primary Expertise</h4>
            <div style="font-size:12px; line-height:1.4; color:rgba(255,255,255,0.8);">
              - Cinematic Color Grading nodes matching<br>
              - Sound mixing beats sync cuts<br>
              - Multicam timeline organization<br>
              - Mobile fluid interface coding (ES6)
            </div>
          </div>

          <div>
            <h4 style="margin:0 0 4px 0; font-size:11px; color:#ff9500; text-transform:uppercase;">Social Links</h4>
            <div style="display:flex; gap:10px; font-size:12px; color:#007aff; font-weight:600; margin-top:2px;">
              <a href="https://www.linkedin.com/in/dharmikvaja/" target="_blank" style="color:inherit;">LinkedIn</a>
              <span>•</span>
              <a href="https://github.com/dharmikvaja" target="_blank" style="color:inherit;">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderTerminalScreen() {
    return `
      <div class="ios-terminal-container" id="ios-term-screen">
        <div class="ios-terminal-output" id="ios-term-output">
          Last Login: ${new Date().toDateString()} on tty1<br>
          Virtual shell started. Type 'help' for options.<br><br>
        </div>
        <div class="ios-terminal-prompt-row">
          <span>➜ ~</span>
          <input type="text" id="ios-term-input" autocomplete="off" autofocus>
        </div>
      </div>
    `;
  }

  // 8. BIND LOGIC AFTER RENDER
  function bindAppLogic(appId) {
    const body = document.getElementById('ios-app-shell-body');

    // GALLERY APPS: Bind play triggers
    if (appId.includes('commercials') || appId.includes('teaser') || appId.includes('Highlight') || appId.includes('reel') || appId.includes('case-studies')) {
      const playButtons = body.querySelectorAll('.ios-gallery-play-btn');
      playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const videoUrl = btn.getAttribute('data-video');
          const videoType = btn.getAttribute('data-type');
          const projTitle = btn.getAttribute('data-title');
          const projDesc = btn.getAttribute('data-desc');
          openVideoDetailOverlay(projTitle, projDesc, videoUrl, videoType);
        });
      });
    }

    // PRICING APP: Bind Spec Estimator
    if (appId === 'pricing') {
      const typeSelect = document.getElementById('ios-est-type');
      const addonSound = document.getElementById('addon-sound');
      const addonGrade = document.getElementById('addon-grade');
      const addonFast = document.getElementById('addon-fast');
      const estTotal = document.getElementById('ios-est-total');
      const estBook = document.getElementById('ios-est-book');

      if (typeSelect && estTotal && estBook) {
        const updateRate = () => {
          let total = parseInt(typeSelect.value);
          if (addonSound && addonSound.checked) total += parseInt(addonSound.value);
          if (addonGrade && addonGrade.checked) total += parseInt(addonGrade.value);
          if (addonFast && addonFast.checked) total += parseInt(addonFast.value);
          estTotal.textContent = '$' + total;
        };

        typeSelect.addEventListener('change', updateRate);
        if (addonSound) addonSound.addEventListener('change', updateRate);
        if (addonGrade) addonGrade.addEventListener('change', updateRate);
        if (addonFast) addonFast.addEventListener('change', updateRate);

        estBook.addEventListener('click', () => {
          const selectTypeOpt = typeSelect.options[typeSelect.selectedIndex].text.split(' (')[0];
          const calculatedVal = estTotal.textContent;

          launchApp('contact');
          setTimeout(() => {
            let prefType = 'Wedding Film';
            if (selectTypeOpt.includes('Reel')) prefType = 'Social Reels';
            if (selectTypeOpt.includes('Commercial') || selectTypeOpt.includes('Ad')) prefType = 'Brand Ad';

            let prefBudget = '$1,000 - $3,000';
            const priceVal = parseInt(calculatedVal.replace('$', ''));
            if (priceVal > 3000) prefBudget = '$3,000 - $5,000';

            prefForm(
              prefType,
              prefBudget,
              `Calculated speculation booking:\n- Type: ${selectTypeOpt}\n- Selected spec extras.\n- Quoted Value: ${calculatedVal}`
            );
          }, 200);
        });
      }
    }

    // CONTACT APP: Bind submit handler
    if (appId === 'contact') {
      const form = document.getElementById('ios-form-inquiry');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('ios-form-name').value;
          const email = document.getElementById('ios-form-email').value;
          const type = document.getElementById('ios-form-type').value;
          const desc = document.getElementById('ios-form-description').value;

          console.log('Mobile Form Submitted:', { name, email, type, desc });
          triggerIslandNotification('Proposal Sent!', `${type} requested`, '🚀');

          // Render animated checkmark success overlay inside the app shell body
          body.innerHTML = `
            <div class="form-success-overlay">
              <div class="checkmark-circle">
                <span class="material-icons-round">check</span>
              </div>
              <h3 style="font-size: 18px; font-weight:800; color:#32d74b; margin: 10px 0 4px 0;">Proposal Received</h3>
              <p style="font-size:12px; opacity:0.7; max-width: 280px; line-height: 1.5; margin: 0 0 16px 0;">Thank you, ${name}! Dharmik will reply directly to your email address at ${email} shortly.</p>
              <button class="ios-form-submit-btn" style="padding: 10px 24px;" onclick="launchApp('brand-commercials')">View Portfolio</button>
            </div>
          `;
        });
      }
    }

    // TERMINAL APP: Bind Terminal keys
    if (appId === 'terminal') {
      const input = document.getElementById('ios-term-input');
      const output = document.getElementById('ios-term-output');
      const termScreen = document.getElementById('ios-term-screen');

      if (input && output) {
        input.focus();
        
        // Tap screen anywhere to re-focus input
        termScreen.addEventListener('click', () => input.focus());

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const val = input.value.trim();
            if (val) executeTermCmd(val, output);
            input.value = '';
            // Auto scroll to bottom
            setTimeout(() => {
              termScreen.scrollTop = termScreen.scrollHeight;
            }, 10);
          }
        });
      }
    }
  }

  // 9. PREFILL FORM VALUE
  window.prefForm = function (type, budget, desc) {
    const formType = document.getElementById('ios-form-type');
    const formBudget = document.getElementById('ios-form-budget');
    const formDesc = document.getElementById('ios-form-description');

    if (formType) formType.value = type;
    if (formBudget) formBudget.value = budget;
    if (formDesc) formDesc.value = desc;
  };

  // 10. PROJECT DETAIL VIEW OVERLAY
  function openVideoDetailOverlay(title, desc, videoUrl, videoType) {
    // Renders custom detail cards containing hero player, editing process, testimonials
    const overlay = document.createElement('div');
    overlay.className = 'ios-project-detail-overlay';

    let videoEmbedHtml = '';
    if (videoType === 'youtube') {
      videoEmbedHtml = `<iframe width="100%" height="100%" src="${videoUrl}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
      videoEmbedHtml = `<video width="100%" height="100%" controls autoplay><source src="${videoUrl}" type="video/mp4"></video>`;
    }

    overlay.innerHTML = `
      <div class="ios-player-header">
        <button class="ios-player-close">
          <span class="material-icons-round" style="font-size:20px;">close</span>
        </button>
      </div>

      <!-- Hero Video Player -->
      <div class="ios-player-frame-container">
        ${videoEmbedHtml}
      </div>

      <div class="ios-player-details">
        <h1 class="ios-player-title">${title}</h1>

        <!-- Project Details Card -->
        <div class="ios-player-sec">
          <h4 class="ios-player-sec-title">Project Details</h4>
          <p class="ios-player-sec-body">${desc}</p>
        </div>

        <!-- Editing Process Card -->
        <div class="ios-player-sec">
          <h4 class="ios-player-sec-title">Editing Process</h4>
          <p class="ios-player-sec-body">Constructed grading curves nodes in DaVinci Resolve Studio to balance primary gains. Paced cuts dynamically to accent baseline beats and audio speeches.</p>
        </div>

        <!-- Software Used -->
        <div class="ios-player-sec">
          <h4 class="ios-player-sec-title">Software Used</h4>
          <div class="ios-player-specs-list">
            <span class="ios-player-spec-pill">DaVinci Resolve Studio</span>
            <span class="ios-player-spec-pill">Adobe Premiere Pro</span>
            <span class="ios-player-spec-pill">Adobe Audition</span>
          </div>
        </div>

        <!-- Client Testimonial -->
        <div class="ios-player-sec">
          <h4 class="ios-player-sec-title">Client Testimonial</h4>
          <p class="ios-player-sec-body" style="font-style: italic;">"The pacing and grading exceeded all our initial benchmarks. Incredibly professional storytelling editing!"</p>
          <div style="font-size: 10px; font-weight:700; color:#ff9500; text-align:right; margin-top:4px;">— Production Associate</div>
        </div>

        <button class="ios-player-book-btn" id="ios-detail-book-btn">Start Similar Project</button>
      </div>
    `;

    document.getElementById('mobile-only-experience').appendChild(overlay);
    triggerIslandNotification('Now Playing', title, '🎬');

    // Bind Close Trigger
    const closeBtn = overlay.querySelector('.ios-player-close');
    closeBtn.addEventListener('click', () => {
      overlay.remove();
    });

    // Swipe down to close detail overlay
    let startY = 0;
    overlay.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });
    overlay.addEventListener('touchend', (e) => {
      const endY = e.changedTouches[0].clientY;
      if (endY - startY > 120 && overlay.scrollTop === 0) {
        overlay.remove();
      }
    });

    // Start Similar Project Button
    overlay.querySelector('#ios-detail-book-btn').addEventListener('click', () => {
      overlay.remove();
      closeActiveApp();
      launchApp('contact');
      setTimeout(() => {
        prefForm(
          'Teaser / Highlight',
          '$1,000 - $3,000',
          `Booking query from portfolio project detailing:\n- Project Title: ${title}`
        );
      }, 200);
    });
  }

  // 11. VIRTUAL TERMINAL SHELL COMMANDS
  function executeTermCmd(cmd, outputEl) {
    const cleanCmd = cmd.toLowerCase().trim();
    let reply = '';

    outputEl.innerHTML += `➜ ~ ${cmd}<br>`;

    switch (cleanCmd) {
      case 'help':
        reply = `
Available Commands:<br>
  <b>help</b>          - Lists virtual shell commands<br>
  <b>about</b>         - Profile bio of Dharmik Vaja<br>
  <b>skills</b>        - List video editing & development skills<br>
  <b>resume</b>        - Lists work timeline & education<br>
  <b>linkedin</b>      - Opens professional LinkedIn profile<br>
  <b>instagram</b>     - Opens Instagram video portfolio profile<br>
  <b>projects</b>      - Launches video teaser reels catalog<br>
  <b>hire</b>          - Booking availability rates details<br>
  <b>clear</b>         - Clears the terminal screen buffer<br>
`;
        break;

      case 'about':
        reply = 'Dharmik Vaja is a professional video editor and colorist specializing in luxury wedding films and brand campaigns.<br>';
        break;

      case 'skills':
        reply = 'DaVinci Resolve Studio (95%), Adobe Premiere Pro (90%), Adobe After Effects (75%), HTML5/CSS3/Vanilla JS (80%).<br>';
        break;

      case 'resume':
        reply = 'Work experience: Lead Video Editor (2021-Present), Web Developer (2023-Present). Education: Creative Media Arts.<br>';
        break;

      case 'linkedin':
        reply = 'Opening LinkedIn...<br>';
        setTimeout(() => window.open('https://www.linkedin.com/in/dharmikvaja/', '_blank'), 400);
        break;

      case 'instagram':
        reply = 'Opening Instagram...<br>';
        setTimeout(() => window.open('https://github.com/dharmikvaja', '_blank'), 400); // Instagram redirect
        break;

      case 'projects':
        reply = 'Launching Wedding Films catalog...<br>';
        setTimeout(() => {
          closeActiveApp();
          launchApp('wedding-teaser');
        }, 500);
        break;

      case 'hire':
        reply = 'Open for video commissions & web builds. Select package rates inside Pricing App.<br>';
        break;

      case 'clear':
        outputEl.innerHTML = '';
        reply = 'Last login: Today on console tty1<br>';
        break;

      default:
        reply = `sh: command not found: ${cmd}. Type 'help' for instructions.<br>`;
    }

    outputEl.innerHTML += reply + '<br>';
  }

  // 12. HANDLE RESIZE TOGGLE
  window.addEventListener('resize', () => {
    const mobileOverlay = document.getElementById('mobile-only-experience');
    if (!mobileOverlay) return;

    if (isMobileView()) {
      initMobile();
      // Set fixed body styles
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    } else {
      mobileOverlay.classList.add('ios-hide');
      // Reset body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      
      // Close active app if open
      closeActiveApp();
    }
  });

  // Run on DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobile);
  } else {
    initMobile();
  }
})();
