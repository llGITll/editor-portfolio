/**
 * DESKTOP FOLDERS MODULE
 * Manages video portfolio folders on the desktop
 * Creates folder icons with standard macOS blue style
 */
const desktopFoldersManager = {
  folders: [
    {
      id: 'brand-commercials',
      name: 'Brand Commercials',
      icon: '💼',
      color: '#007ff7',
      description: 'Commercial advertisement videos'
    },
    {
      id: 'wedding-teaser',
      name: 'Wedding Teasers',
      icon: '🎥',
      color: '#ff5f57',
      description: 'Cinematic wedding cinematography'
    },
    {
      id: 'wedding-Highlight',
      name: 'Wedding Highlights',
      icon: '⚡',
      color: '#ffbd2e',
      description: 'Short-form vertical content'
    },
    {
      id: 'wedding-reel',
      name: 'Wedding Reels',
      icon: '🎞️',
      color: '#28c940',
      description: 'Wedding Reels and Stories'
    },
    {
      id: 'case-studies-soon',
      name: 'Case Studies',
      icon: '📂',
      color: '#9c5ffd',
      description: 'Project portfolio case studies'
    },
    {
      id: 'contact-me',
      name: 'Contact & Booking',
      icon: '✉️',
      color: '#007ff7',
      description: 'Contact and Booking Details'
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

  // Create folder icon element with macOS style
  createFolderIcon(folder) {
    const container = document.getElementById('desktopFoldersContainer');
    const folderElement = document.createElement('div');
    folderElement.className = 'desktop-folder';
    folderElement.id = `folder-${folder.id}`;
    folderElement.setAttribute('data-folder-id', folder.id);

    folderElement.innerHTML = `
      <div class="desktop-folder__icon">
        <div class="macos-folder">
          <div class="folder-tab"></div>
          <div class="folder-body"></div>
          <div class="folder-shine"></div>
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
      folderEl.addEventListener('click', (e) => {
        const folderId = folderEl.getAttribute('data-folder-id');
        this.selectFolder(folderEl);
        
        if (folderId === 'contact-me') {
          if (typeof contactFormApp !== 'undefined') {
            contactFormApp.openInquiryWindow();
          } else {
            folderWindowManager.openFolder(folderId);
          }
        } else {
          folderWindowManager.openFolder(folderId);
        }
        e.preventDefault();
      });

      // Right-click context menu (optional)
      folderEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
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
desktopFoldersManager.init();
