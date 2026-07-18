/**
 * DESKTOP FOLDERS MODULE
 * Manages video portfolio folders on the desktop
 * Creates folder icons and handles folder interactions
 */
const desktopFoldersManager = {
  folders: [
        {
      id: 'brand-commercials',
      name: 'Brand Reels',
      icon: '🎬',
      color: '#9b0000',
      description: 'Commercial advertisement videos'
    },
      {
      id: 'wedding-reel',
      name: 'wedding-reel',
      icon: '🎬',
      color: '#45B7D1',
      description: 'Commercial advertisement videos'
    },
    {
      id: 'wedding-teaser',
      name: 'wedding-teaser',
      icon: '💍',
      color: '#FF69B4',
      description: 'Cinematic wedding cinematography'
    },
    {
      id: 'wedding-Highlight',
      name: 'wedding-Highlight',
      icon: '💍',
      color: '#4ECDC4',
      description: 'Short-form vertical content'
    },
    {
      id: 'case-studies-soon',
      name: 'case-studies-soon',
      icon: '📊',
      color: '#279ecd',
      description: 'Project portfolio case studies'
    }
  ],

  // Initialize desktop folders
  init() {
    const desktopArea = document.querySelector('body');
    const foldersContainer = document.createElement('div');
    foldersContainer.className = 'desktop-folders-container';
    foldersContainer.id = 'desktopFoldersContainer';
    
    // Insert before the spotlight search
    const spotlightSearch = document.querySelector('.spotlight_serach');
    desktopArea.insertBefore(foldersContainer, spotlightSearch);

    // Create each folder
    this.folders.forEach(folder => {
      this.createFolderIcon(folder);
    });

    // Add event listeners for folder interactions
    this.setupFolderListeners();
  },

  // Create folder icon element
  createFolderIcon(folder) {
    const container = document.getElementById('desktopFoldersContainer');
    const folderElement = document.createElement('div');
    folderElement.className = 'desktop-folder';
    folderElement.id = `folder-${folder.id}`;
    folderElement.setAttribute('data-folder-id', folder.id);
    folderElement.style.setProperty('--folder-color', folder.color);

    folderElement.innerHTML = `
      <div class="desktop-folder__icon">
        <div class="folder-visual">
          <div class="folder-tab"></div>
          <div class="folder-body"></div>
        </div>
      </div>
      <div class="desktop-folder__label">
        <span>${folder.name}</span>
      </div>
    `;

    container.appendChild(folderElement);
  },

  // Setup event listeners for folders
  setupFolderListeners() {
    const folders = document.querySelectorAll('.desktop-folder');
    
    folders.forEach(folderEl => {
      let lastClickTime = 0;
      const doubleclickDelay = 300;

      folderEl.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;

        if (timeDiff < doubleclickDelay) {
          // Double click - open folder
          const folderId = folderEl.getAttribute('data-folder-id');
          folderWindowManager.openFolder(folderId);
          e.preventDefault();
        } else {
          // Single click - select folder
          this.selectFolder(folderEl);
        }

        lastClickTime = currentTime;
      });

      // Right-click context menu (optional)
      folderEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Could add context menu here
      });
    });
  },

  // Select folder (visual feedback)
  selectFolder(folderEl) {
    document.querySelectorAll('.desktop-folder').forEach(f => {
      f.classList.remove('selected');
    });
    folderEl.classList.add('selected');
  },

  // Get folder data by ID
  getFolderData(folderId) {
    return this.folders.find(f => f.id === folderId);
  }
};

// Initialize desktop folders immediately since DOM is ready
// (This script loads after DOM parsing is complete, so DOMContentLoaded has already fired)
desktopFoldersManager.init();