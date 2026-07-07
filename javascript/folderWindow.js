/**
 * FOLDER WINDOW MANAGER
 * Handles folder window creation, management, dragging, and project display
 * Implements macOS Finder-style windows with glassmorphism
 */

const folderWindowManager = {
  windows: new Map(),
  zIndexCounter: 30,

  // Open a folder window
  openFolder(folderId) {
    // If window already open, bring to front
    if (this.windows.has(folderId)) {
      const existingWindow = this.windows.get(folderId);
      this.bringToFront(existingWindow);
      return;
    }

    const folderData = desktopFoldersManager.getFolderData(folderId);
    const projects = getProjectsByFolder(folderId);

    const windowElement = this.createWindowElement(folderData, projects);
    this.windows.set(folderId, windowElement);
    
    this.setupWindowControls(windowElement, folderId);
    this.setupWindowDragging(windowElement);
    this.animateWindowOpen(windowElement);
  },

  // Create the window DOM element
  createWindowElement(folderData, projects) {
    const container = document.querySelector('.container__Window');
    const window = document.createElement('div');
    window.className = 'folder-window';
    window.setAttribute('data-folder-id', folderData.id);
    window.style.zIndex = this.zIndexCounter++;

    window.innerHTML = `
      <div class="folder-window__header" style="--folder-color: ${folderData.color}">
        <div class="folder-window__controls">
          <button class="window-btn close-btn" title="Close"></button>
          <button class="window-btn minimize-btn" title="Minimize"></button>
          <button class="window-btn maximize-btn" title="Maximize"></button>
        </div>
        <div class="folder-window__title">
          <span class="folder-icon">${folderData.icon}</span>
          <h2>${folderData.name}</h2>
        </div>
        <div class="folder-window__spacer"></div>
      </div>

      <div class="folder-window__content">
        <div class="projects-grid">
          ${projects.map(project => this.createProjectCard(project)).join('')}
        </div>
      </div>

      <div class="folder-window__footer">
        <span class="projects-count">${projects.length} items</span>
      </div>
    `;

    container.appendChild(window);
    return window;
  },

  // Create a project card
  createProjectCard(project) {
    return `
      <div class="project-card">
        <div class="project-card__image-container">
          <img src="${project.thumbnail}" alt="${project.title}" class="project-card__image">
          <button class="project-card__play-btn">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
        <div class="project-card__info">
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__description">${project.description}</p>
          <button class="project-card__view-btn" data-video="${project.video}" data-type="${project.type}">
            Play Video
          </button>
        </div>
      </div>
    `;
  },

  // Setup window control buttons
  setupWindowControls(windowElement, folderId) {
    const closeBtn = windowElement.querySelector('.close-btn');
    const minimizeBtn = windowElement.querySelector('.minimize-btn');
    const maximizeBtn = windowElement.querySelector('.maximize-btn');

    closeBtn.addEventListener('click', () => {
      this.closeWindow(windowElement, folderId);
    });

    minimizeBtn.addEventListener('click', () => {
      this.minimizeWindow(windowElement);
    });

    maximizeBtn.addEventListener('click', () => {
      this.maximizeWindow(windowElement);
    });

    // Setup project card play buttons
    const playButtons = windowElement.querySelectorAll('.project-card__play-btn, .project-card__view-btn');
    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.project-card');
        const viewBtn = card.querySelector('.project-card__view-btn');
        const videoUrl = viewBtn.getAttribute('data-video');
        const videoType = viewBtn.getAttribute('data-type');
        this.playVideo(videoUrl, videoType);
      });
    });
  },

  // Setup window dragging
  setupWindowDragging(windowElement) {
    if (typeof makeDraggable === 'function') {
      makeDraggable(windowElement, '.folder-window__header');
    }
  },

  // Bring window to front
  bringToFront(windowElement) {
    windowElement.style.zIndex = this.zIndexCounter++;
  },

  // Close window
  closeWindow(windowElement, folderId) {
    windowElement.classList.add('closing');
    setTimeout(() => {
      windowElement.remove();
      this.windows.delete(folderId);
    }, 300);
  },

  // Minimize window
  minimizeWindow(windowElement) {
    if (windowElement.classList.contains('minimized')) {
      windowElement.classList.remove('minimized');
    } else {
      windowElement.classList.add('minimized');
    }
  },

  // Maximize window
  maximizeWindow(windowElement) {
    if (windowElement.classList.contains('maximized')) {
      windowElement.classList.remove('maximized');
    } else {
      windowElement.classList.add('maximized');
    }
  },

  // Play video
  playVideo(videoUrl, videoType) {
    const modal = document.createElement('div');
    modal.className = 'video-player-modal';
    modal.innerHTML = `
      <div class="video-player-modal__backdrop"></div>
      <div class="video-player-modal__container">
        <button class="video-player-modal__close">&times;</button>
        <div class="video-player-modal__player">
          ${videoType === 'youtube' 
            ? `<iframe width="100%" height="100%" src="${videoUrl}?autoplay=1" 
                      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
            : `<video width="100%" height="100%" controls autoplay>
                <source src="${videoUrl}" type="video/mp4">
              </video>`
          }
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.video-player-modal__close');
    const backdrop = modal.querySelector('.video-player-modal__backdrop');

    const closeModal = () => {
      modal.classList.add('closing');
      setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    // Animate modal in
    setTimeout(() => modal.classList.add('active'), 10);
  },

  // Animate window opening
  animateWindowOpen(windowElement) {
    // Random starting position (centered)
    const startX = window.innerWidth / 2 - 250;
    const startY = Math.max(30, window.innerHeight / 2 - 200);

    windowElement.style.left = startX + 'px';
    windowElement.style.top = startY + 'px';

    // Add a slight offset for each new window
    const offset = (this.zIndexCounter % 3) * 30;
    windowElement.style.left = (startX + offset) + 'px';
    windowElement.style.top = (startY + offset) + 'px';

    // Trigger animation
    setTimeout(() => {
      windowElement.classList.add('opening');
    }, 10);
  }
};
