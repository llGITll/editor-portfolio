/**
 * PREMIUM INTERACTIVE APPLICATIONS SYSTEM
 * Implements: Bootloader, Mobile responsive mode, Music Player, Photos color-grading, persistent Notes.
 * Extended in Phase 2: iMessage chats, Safari mock browser, App Store, System Settings, Siri, Mail, and Finder.
 */

// Global window creator to standardize headers, dragging, and reveal animations
function createSystemWindow(id, title, icon, width, height, contentHtml) {
  if (document.getElementById(id)) {
    if (typeof folderWindowManager !== 'undefined') {
      folderWindowManager.bringToFront(document.getElementById(id));
    }
    return document.getElementById(id);
  }

  const container = document.querySelector('.container__Window');
  if (!container) return null;

  const win = document.createElement('div');
  win.className = 'folder-window';
  win.id = id;
  
  // Center window with slight dynamic cascade offset
  const count = document.querySelectorAll('.folder-window').length;
  const offset = (count % 4) * 30;
  
  win.style.left = (window.innerWidth / 2 - width / 2 + offset) + 'px';
  win.style.top = (100 + offset) + 'px';
  win.style.width = width + 'px';
  win.style.height = height + 'px';
  win.style.zIndex = 40 + count;

  win.innerHTML = `
    <div class="folder-window__header">
      <div class="folder-window__controls">
        <button class="window-btn close-btn" title="Close"></button>
        <button class="window-btn minimize-btn" title="Minimize"></button>
        <button class="window-btn maximize-btn" title="Maximize"></button>
      </div>
      <div class="folder-window__title">
        <span class="folder-icon">${icon}</span>
        <h2>${title}</h2>
      </div>
      <div class="folder-window__spacer"></div>
    </div>
    <div class="folder-window__content" style="height: calc(100% - 38px); padding: 0; overflow: hidden;">
      ${contentHtml}
    </div>
  `;

  win.querySelector('.close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    win.classList.add('closing');
    setTimeout(() => win.remove(), 300);
  });

  win.querySelector('.minimize-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    win.classList.toggle('minimized');
  });

  win.querySelector('.maximize-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    win.classList.toggle('maximized');
  });

  container.appendChild(win);
  
  if (typeof makeDraggable === 'function') {
    makeDraggable(win, '.folder-window__header');
  }

  // CRITICAL: Trigger opening animation (removes opacity: 0)
  setTimeout(() => {
    win.classList.add('opening');
  }, 20);

  return win;
}

// 1. BOOTLOADER ANIMATION
document.addEventListener('DOMContentLoaded', () => {
  const bootLoader = document.getElementById('boot-loader');
  const progressBar = document.querySelector('.boot-progress-bar');
  
  // Clean up all old display:none / hidden states on dock icon images so they show up on desktop
  document.querySelectorAll('.dock img.hidden').forEach(img => {
    img.classList.remove('hidden');
  });

  if (bootLoader && progressBar) {
    setTimeout(() => {
      progressBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
      bootLoader.style.opacity = '0';
      if (typeof initDraggableApps === 'function') {
        initDraggableApps();
      }
    }, 2600);

    setTimeout(() => {
      bootLoader.style.display = 'none';
    }, 3100);
  }
});

// 2. MOBILE RESPONSIVE ENGINE
const mobileEngine = {
  isMobile: false,

  init() {
    this.checkResolution();
    window.addEventListener('resize', () => this.checkResolution());
  },

  checkResolution() {
    const width = window.innerWidth;
    if (width < 768) {
      if (!this.isMobile) {
        this.isMobile = true;
        this.enableMobileMode();
      }
    } else {
      if (this.isMobile) {
        this.isMobile = false;
        this.disableMobileMode();
      }
    }
  },

  enableMobileMode() {
    document.body.classList.add('mobile-mode');
    
    if (!document.querySelector('.mobile-status-bar')) {
      const statusBar = document.createElement('div');
      statusBar.className = 'mobile-status-bar';
      statusBar.innerHTML = `
        <div class="mobile-status-bar__left">
          <span>Antigravity Mobile</span>
          <span class="material-icons-round" style="font-size: 14px;">wifi</span>
        </div>
        <div class="mobile-status-bar__center" id="mobile-time">10:45 AM</div>
        <div class="mobile-status-bar__right">
          <span id="mobile-battery-percent">100%</span>
          <span class="material-icons-round" style="font-size: 14px;">battery_full</span>
        </div>
      `;
      document.body.appendChild(statusBar);
      this.startMobileClock();
    }

    if (!document.querySelector('.mobile-home-indicator')) {
      const homeIndicator = document.createElement('div');
      homeIndicator.className = 'mobile-home-indicator';
      document.body.appendChild(homeIndicator);
      
      homeIndicator.addEventListener('click', () => {
        this.closeAllFullscreenApps();
      });
    }

    const container = document.getElementById('desktopFoldersContainer');
    if (container) {
      container.className = 'mobile-folders-grid';
    }

    if (!document.querySelector('.mobile-dock')) {
      const mobileDock = document.createElement('div');
      mobileDock.className = 'mobile-dock';
      mobileDock.innerHTML = `
        <button class="mobile-dock__icon" onclick="launchpad.opening.click()"><img src="./icon/dock/launchpad.png" alt="Launchpad"></button>
        <button class="mobile-dock__icon" onclick="openSystemApp('note')"><img src="./icon/dock/notes.png" alt="Notes"></button>
        <button class="mobile-dock__icon" onclick="openSystemApp('calculator')"><img src="./icon/dock/calculator.png" alt="Calculator"></button>
        <button class="mobile-dock__icon" onclick="openSystemApp('maps')"><img src="./icon/dock/maps.png" alt="Maps"></button>
      `;
      document.body.appendChild(mobileDock);
    }
  },

  disableMobileMode() {
    document.body.classList.remove('mobile-mode');
    
    const statusBar = document.querySelector('.mobile-status-bar');
    if (statusBar) statusBar.remove();

    const homeIndicator = document.querySelector('.mobile-home-indicator');
    if (homeIndicator) homeIndicator.remove();

    const mobileDock = document.querySelector('.mobile-dock');
    if (mobileDock) mobileDock.remove();

    const container = document.getElementById('desktopFoldersContainer');
    if (container) {
      container.className = 'desktop-folders-container';
    }

    document.querySelectorAll('.active-app').forEach(app => {
      app.classList.remove('active-app');
      app.style.display = 'none';
    });
  },

  startMobileClock() {
    const updateTime = () => {
      const timeEl = document.getElementById('mobile-time');
      if (timeEl) {
        const d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        timeEl.textContent = `${hours}:${minutes} ${ampm}`;
      }
    };
    updateTime();
    setInterval(updateTime, 10000);
  },

  closeAllFullscreenApps() {
    document.querySelectorAll('.folder-window').forEach(win => {
      win.classList.add('closing');
      setTimeout(() => win.remove(), 300);
    });
    
    document.querySelectorAll('.window, .calculator, .note, .terminal, .maps').forEach(app => {
      app.classList.remove('active-app');
      app.style.display = 'none';
      
      const appId = app.classList[0];
      const point = document.querySelector(`#point-${appId}`);
      if (point) point.style.display = 'none';
      
      const appName = document.querySelector(`#${app.id}`);
      if (appName) appName.style.display = 'none';
    });
  }
};

function openSystemApp(type) {
  let appEl = null;
  let pointEl = null;
  let nameEl = null;

  if (type === 'note') {
    appEl = document.querySelector('.note');
    pointEl = document.querySelector('#point-note');
    nameEl = document.querySelector('#Notes');
  } else if (type === 'calculator') {
    appEl = document.querySelector('.calculator');
    pointEl = document.querySelector('#point-cal');
    nameEl = document.querySelector('#calculator');
  } else if (type === 'maps') {
    appEl = document.querySelector('.maps');
    pointEl = document.querySelector('#point-maps');
    nameEl = document.querySelector('#map');
  } else if (type === 'terminal') {
    appEl = document.querySelector('.terminal');
    pointEl = document.querySelector('#point-terminal');
    nameEl = document.querySelector('#Terminal');
  }

  if (appEl) {
    appEl.style.display = 'block';
    appEl.classList.add('active-app');
    if (pointEl) pointEl.style.display = 'block';
    if (nameEl) nameEl.style.display = 'block';
  }
}

// 3. PERSISTENT NOTES SYSTEM
const notesPersistence = {
  notesKey: 'macos_portfolio_notes',
  
  init() {
    const sidebar = document.querySelector('.content__sidebar--notes');
    const textarea = document.querySelector('.content__typing');
    
    if (!sidebar || !textarea) return;

    this.loadNotes();

    textarea.addEventListener('input', () => {
      const activeInput = sidebar.querySelector('input.active-note');
      if (activeInput) {
        this.saveNoteContent(activeInput.value, textarea.value);
      }
    });

    document.querySelector('.adding').addEventListener('click', () => {
      setTimeout(() => {
        const inputs = sidebar.querySelectorAll('input');
        const lastInput = inputs[inputs.length - 1];
        if (lastInput) {
          lastInput.value = `Note ${inputs.length}`;
          lastInput.addEventListener('click', (e) => this.selectNote(e.target));
          lastInput.addEventListener('input', (e) => this.renameNote(e.target));
          this.selectNote(lastInput);
        }
      }, 50);
    });

    document.querySelector('.deleting').addEventListener('click', () => {
      this.deleteActiveNote();
    });
  },

  loadNotes() {
    const data = localStorage.getItem(this.notesKey);
    const sidebar = document.querySelector('.content__sidebar--notes');
    const textarea = document.querySelector('.content__typing');
    
    sidebar.innerHTML = '';
    textarea.value = '';

    let notes = [];
    if (data) {
      try { notes = JSON.parse(data); } catch(e) { notes = []; }
    }

    if (notes.length === 0) {
      notes = [
        { title: 'Welcome Note', content: 'Welcome to my macOS simulator portfolio! You can write, save, or delete notes here. They will persist in your local storage.' },
        { title: 'Contact Details', content: 'Dharmik Vaja\nEmail: dharmikvaja1111@gmail.com\nLocation: Gujarat, India\nServices: Video Editing, Color Grading, Sound Design' }
      ];
      localStorage.setItem(this.notesKey, JSON.stringify(notes));
    }

    notes.forEach((note, index) => {
      const input = document.createElement('input');
      input.value = note.title;
      input.setAttribute('data-content', note.content);
      sidebar.appendChild(input);
      
      input.addEventListener('click', (e) => this.selectNote(e.target));
      input.addEventListener('input', (e) => this.renameNote(e.target));

      if (index === 0) {
        this.selectNote(input);
      }
    });
  },

  selectNote(inputEl) {
    const sidebar = document.querySelector('.content__sidebar--notes');
    const textarea = document.querySelector('.content__typing');
    
    sidebar.querySelectorAll('input').forEach(input => {
      input.classList.remove('active-note');
      input.style.background = 'transparent';
      input.style.fontWeight = 'normal';
    });

    inputEl.classList.add('active-note');
    inputEl.style.background = 'rgba(255,255,255,0.15)';
    inputEl.style.fontWeight = 'bold';

    textarea.style.display = 'block';
    textarea.value = inputEl.getAttribute('data-content') || '';
  },

  renameNote(inputEl) {
    this.syncToLocalStorage();
  },

  saveNoteContent(title, content) {
    const sidebar = document.querySelector('.content__sidebar--notes');
    const activeInput = sidebar.querySelector('input.active-note');
    if (activeInput) {
      activeInput.setAttribute('data-content', content);
      this.syncToLocalStorage();
    }
  },

  deleteActiveNote() {
    const sidebar = document.querySelector('.content__sidebar--notes');
    const textarea = document.querySelector('.content__typing');
    const active = sidebar.querySelector('input.active-note');
    
    if (active) {
      active.remove();
      this.syncToLocalStorage();
      
      const remaining = sidebar.querySelector('input');
      if (remaining) {
        this.selectNote(remaining);
      } else {
        textarea.value = '';
        textarea.style.display = 'none';
      }
    }
  },

  syncToLocalStorage() {
    const sidebar = document.querySelector('.content__sidebar--notes');
    const notes = [];
    sidebar.querySelectorAll('input').forEach(input => {
      notes.push({
        title: input.value,
        content: input.getAttribute('data-content') || ''
      });
    });
    localStorage.setItem(this.notesKey, JSON.stringify(notes));
  }
};

// 4. APPLE MUSIC CLONE SYSTEM (HTML5)
const musicPlayer = {
  audio: null,
  isPlaying: false,
  currentIndex: 0,
  playlist: [
    { title: 'Time (Inception)', artist: 'Hans Zimmer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300', bg: '#1c1c24' },
    { title: 'Cornfield Chase (Interstellar)', artist: 'Hans Zimmer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300', bg: '#0b1622' },
    { title: 'The Dark Knight Theme', artist: 'Hans Zimmer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cover: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300', bg: '#111' },
    { title: "He's a Pirate", artist: 'Hans Zimmer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cover: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=300', bg: '#1c2d3d' },
    { title: 'Gladiator Suite', artist: 'Hans Zimmer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300', bg: '#2b211a' }
  ],

  init() {
    this.audio = new Audio();
    this.audio.src = this.playlist[this.currentIndex].url;
    this.audio.volume = 0.5;

    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('timeupdate', () => this.trackTimeUpdate());
    
    this.setupControlCenterControls();
    this.setupStandaloneTrigger();
  },

  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
    }).catch(err => console.log("Audio playback failed: ", err));
  },

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  },

  toggle() {
    if (this.isPlaying) this.pause();
    else this.play();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.audio.src = this.playlist[this.currentIndex].url;
    if (this.isPlaying) this.play();
    else this.updateUI();
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.audio.src = this.playlist[this.currentIndex].url;
    if (this.isPlaying) this.play();
    else this.updateUI();
  },

  playTrackByIndex(index) {
    this.currentIndex = index;
    this.audio.src = this.playlist[this.currentIndex].url;
    this.play();
  },

  setupControlCenterControls() {
    const playBtn = document.querySelector('.musicPlayer--content span:nth-child(1)');
    const nextBtn = document.querySelector('.musicPlayer--content span:nth-child(2)');

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.toggle();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.next();
      });
    }
  },

  setupStandaloneTrigger() {
    const musicDockBtn = document.querySelector('.open-music');
    if (musicDockBtn) {
      musicDockBtn.addEventListener('click', () => {
        this.openMusicWindow();
      });
    }
  },

  openMusicWindow() {
    const contentHtml = `
      <div class="apple-music-container" style="display:flex; flex-direction:column; height:100%; color:#fff; font-family:-apple-system, sans-serif; background:#1e1e24; box-sizing:border-box;">
        <!-- Top Playback Header Bar -->
        <div class="am-header" style="height:55px; background:rgba(30, 30, 34, 0.95); border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; padding:0 16px; box-sizing:border-box; user-select:none;">
          <!-- Left: playback controls -->
          <div style="display:flex; gap:16px; align-items:center;">
            <span class="material-icons-round" id="am-prev-btn" style="font-size:24px; cursor:pointer; opacity:0.8; user-select:none;">skip_previous</span>
            <span class="material-icons-round" id="am-play-btn" style="font-size:32px; cursor:pointer; color:#fc3c44; user-select:none;">play_circle</span>
            <span class="material-icons-round" id="am-next-btn" style="font-size:24px; cursor:pointer; opacity:0.8; user-select:none;">skip_next</span>
          </div>
          <!-- Center: Playing display capsule -->
          <div style="flex:1; max-width:400px; height:36px; background:rgba(0,0,0,0.3); border-radius:18px; display:flex; align-items:center; padding:0 12px; box-sizing:border-box; gap:10px; border:1px solid rgba(255,255,255,0.05); margin:0 20px; position:relative; overflow:hidden;" id="am-progress-track">
            <div id="am-progress-bar-fill" style="position:absolute; left:0; top:0; bottom:0; width:0%; background:rgba(252,60,68,0.25); transition:width 0.1s linear; pointer-events:none;"></div>
            <div style="flex:1; min-width:0; text-align:center; z-index:2; pointer-events:none;">
              <span class="material-icons-round" id="am-logo-icon" style="font-size:16px; color:rgba(255,255,255,0.25); vertical-align:middle;">music_note</span>
              <div id="am-header-info" style="display:none; font-size:11px; line-height:1.2;">
                <div id="am-header-title" style="font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#fff;">Song Title</div>
                <div id="am-header-artist" style="opacity:0.6; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#aaa;">Artist</div>
              </div>
            </div>
            <!-- Time tracker -->
            <div id="am-header-time" style="font-size:10px; opacity:0.5; font-family:monospace; display:none; z-index:2; pointer-events:none;">0:00</div>
          </div>
          <!-- Right: volume and queue controls -->
          <div style="display:flex; align-items:center; gap:10px; width:120px;">
            <span class="material-icons-round" style="font-size:16px; opacity:0.5;">volume_mute</span>
            <input type="range" min="0" max="100" value="50" id="am-volume-slider" style="flex:1; height:3px; background:rgba(255,255,255,0.2); accent-color:#fc3c44; cursor:pointer;" />
            <span class="material-icons-round" style="font-size:16px; opacity:0.5;">volume_up</span>
          </div>
        </div>

        <!-- Main Body Content split -->
        <div style="display:flex; flex:1; overflow:hidden;">
          <!-- Left Sidebar -->
          <div style="width:180px; background:rgba(20, 20, 24, 0.4); border-right:1px solid rgba(255,255,255,0.08); padding:16px 8px; box-sizing:border-box; display:flex; flex-direction:column; gap:20px; user-select:none;">
            <!-- Apple Music -->
            <div>
              <h4 style="margin:0 0 8px 8px; font-size:10px; text-transform:uppercase; color:rgba(255,255,255,0.4); letter-spacing:0.5px;">Apple Music</h4>
              <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; background:rgba(252,60,68,0.15); color:#fc3c44; font-size:12px; font-weight:600; cursor:pointer;">
                <span class="material-icons-round" style="font-size:16px;">play_circle</span> Listen Now
              </div>
              <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; color:rgba(255,255,255,0.7); font-size:12px; cursor:pointer; margin-top:2px;" onclick="alert('Browse tab simulated.')">
                <span class="material-icons-round" style="font-size:16px;">grid_view</span> Browse
              </div>
              <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; color:rgba(255,255,255,0.7); font-size:12px; cursor:pointer; margin-top:2px;" onclick="alert('Radio stations simulated.')">
                <span class="material-icons-round" style="font-size:16px;">radio</span> Radio
              </div>
            </div>
            <!-- Library -->
            <div>
              <h4 style="margin:0 0 8px 8px; font-size:10px; text-transform:uppercase; color:rgba(255,255,255,0.4); letter-spacing:0.5px;">Library</h4>
              <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; color:rgba(255,255,255,0.7); font-size:12px; cursor:pointer;" onclick="alert('Library folders simulated.')">
                <span class="material-icons-round" style="font-size:16px;">schedule</span> Recently Added
              </div>
              <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; color:rgba(255,255,255,0.7); font-size:12px; cursor:pointer; margin-top:2px;" onclick="alert('Library Artists list.')">
                <span class="material-icons-round" style="font-size:16px;">person</span> Artists
              </div>
              <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; color:rgba(255,255,255,0.7); font-size:12px; cursor:pointer; margin-top:2px;" onclick="alert('Library Albums list.')">
                <span class="material-icons-round" style="font-size:16px;">album</span> Albums
              </div>
              <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; color:rgba(255,255,255,0.7); font-size:12px; cursor:pointer; margin-top:2px;" onclick="alert('Library Songs list.')">
                <span class="material-icons-round" style="font-size:16px;">audiotrack</span> Songs
              </div>
            </div>
          </div>

          <!-- Right Pane: Main Listen Now contents -->
          <div style="flex:1; overflow-y:auto; padding:24px 32px; box-sizing:border-box; background:#1b1b1f;" id="am-main-pane">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <h1 style="margin:0; font-size:26px; font-weight:700;">Listen Now</h1>
              <div style="width:36px; height:36px; border-radius:50%; background:#444; border:2px solid #fc3c44; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; cursor:pointer;" title="Dharmik Vaja Profile">DV</div>
            </div>

            <h3 style="margin:24px 0 12px 0; font-size:16px; font-weight:600; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px; text-align:left;">Top Picks: Hans Zimmer Collection</h3>
            
            <!-- Playlist Top Picks Cards -->
            <div style="display:flex; gap:20px; overflow-x:auto; padding-bottom:10px;">
              ${this.playlist.map((track, idx) => `
                <div class="am-card" data-index="${idx}" style="width:180px; flex-shrink:0; cursor:pointer;">
                  <div style="width:180px; height:180px; border-radius:12px; overflow:hidden; background:url('${track.cover}') center/cover; box-shadow:0 10px 20px rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); position:relative;">
                    <div class="am-card-play-hover" style="position:absolute; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s;">
                      <span class="material-icons-round" style="font-size:48px; color:#fff;">play_circle</span>
                    </div>
                  </div>
                  <h4 style="margin:8px 0 2px 0; font-size:13px; font-weight:600; text-align:left; color:#fff; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${track.title}</h4>
                  <p style="margin:0; font-size:11px; opacity:0.6; text-align:left; color:#aaa;">${track.artist}</p>
                </div>
              `).join('')}
            </div>

            <!-- Recently Played -->
            <h3 style="margin:30px 0 12px 0; font-size:16px; font-weight:600; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px; text-align:left;">Recently Played</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:8px; cursor:pointer;" onclick="musicPlayer.playTrackByIndex(0)">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:40px; height:40px; border-radius:6px; background:#fc3c44; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:10px;">HZ</div>
                  <div style="text-align:left;">
                    <h5 style="margin:0; font-size:13px; font-weight:600;">Time (Inception Theme)</h5>
                    <p style="margin:2px 0 0 0; font-size:11px; opacity:0.6;">Hans Zimmer</p>
                  </div>
                </div>
                <span class="material-icons-round" style="font-size:24px; color:#fc3c44;">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const win = createSystemWindow('music-app-window', 'Apple Music', '🎵', 740, 525, contentHtml);
    if (!win) return;

    const amPlay = win.querySelector('#am-play-btn');
    const amPrev = win.querySelector('#am-prev-btn');
    const amNext = win.querySelector('#am-next-btn');
    const amVolume = win.querySelector('#am-volume-slider');
    const amProgressTrack = win.querySelector('#am-progress-track');

    amPlay.addEventListener('click', () => this.toggle());
    amPrev.addEventListener('click', () => this.prev());
    amNext.addEventListener('click', () => this.next());
    
    amVolume.addEventListener('input', (e) => {
      this.audio.volume = e.target.value / 100;
    });

    amProgressTrack.addEventListener('click', (e) => {
      const rect = amProgressTrack.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      this.audio.currentTime = pct * this.audio.duration;
    });

    win.querySelectorAll('.am-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-index'));
        this.playTrackByIndex(index);
      });
    });

    this.updateUI();
  },

  trackTimeUpdate() {
    const fill = document.getElementById('am-progress-bar-fill');
    const timeEl = document.getElementById('am-header-time');
    if (this.audio.duration) {
      const pct = (this.audio.currentTime / this.audio.duration) * 100;
      if (fill) fill.style.width = `${pct}%`;
      
      if (timeEl) {
        let curMin = Math.floor(this.audio.currentTime / 60);
        let curSec = Math.floor(this.audio.currentTime % 60);
        curSec = curSec < 10 ? '0' + curSec : curSec;
        let durMin = Math.floor(this.audio.duration / 60);
        let durSec = Math.floor(this.audio.duration % 60);
        durSec = durSec < 10 ? '0' + durSec : durSec;
        timeEl.textContent = `${curMin}:${curSec} / ${durMin}:${durSec}`;
      }
    }
  },

  updateUI() {
    const track = this.playlist[this.currentIndex];
    
    const ccTitle = document.querySelector('.musicPlayer--image h2');
    const ccPlayIcon = document.querySelector('.musicPlayer--content span:nth-child(1)');
    if (ccTitle) ccTitle.textContent = track.title;
    if (ccPlayIcon) ccPlayIcon.textContent = this.isPlaying ? 'pause' : 'play_arrow';

    const amWin = document.getElementById('music-app-window');
    if (amWin) {
      const playBtn = amWin.querySelector('#am-play-btn');
      const headerInfo = amWin.querySelector('#am-header-info');
      const headerTitle = amWin.querySelector('#am-header-title');
      const headerArtist = amWin.querySelector('#am-header-artist');
      const timeTracker = amWin.querySelector('#am-header-time');
      const logoIcon = amWin.querySelector('#am-logo-icon');

      if (playBtn) playBtn.textContent = this.isPlaying ? 'pause_circle' : 'play_circle';
      
      if (this.isPlaying || this.audio.currentTime > 0) {
        if (headerInfo) headerInfo.style.display = 'block';
        if (timeTracker) timeTracker.style.display = 'block';
        if (logoIcon) logoIcon.style.display = 'none';

        if (headerTitle) headerTitle.textContent = track.title;
        if (headerArtist) headerArtist.textContent = track.artist;
      }
    }
  }
};

// 5. PHOTOS WINDOW & COLOR GRADING SLIDER
const photosApp = {
  init() {
    const photosDockBtn = document.querySelector('.open-photos');
    if (photosDockBtn) {
      photosDockBtn.addEventListener('click', () => {
        this.openPhotosWindow();
      });
    }
  },

  openPhotosWindow() {
    const contentHtml = `
      <div style="background: #111; color: #fff; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 16px; height: 100%; box-sizing: border-box;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 500; text-align: center;">Interactive Log vs Cinematic Color Grade (Slide to Compare)</h3>
        
        <div class="before-after-slider" style="position: relative; width: 100%; height: 320px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
          <div class="slider-image before-img" style="position: absolute; top:0; left:0; width: 100%; height: 100%; background: url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop') center/cover no-repeat; filter: saturate(0.35) contrast(0.8) brightness(1.1) sepia(0.05);">
            <div style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">RAW LOG Cam</div>
          </div>
          <div class="slider-image after-img" style="position: absolute; top:0; left:0; width: 100%; height: 100%; background: url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop') center/cover no-repeat; filter: saturate(1.3) contrast(1.15) brightness(0.95) sepia(0.1) hue-rotate(350deg); clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);">
            <div style="position: absolute; top: 12px; right: 12px; background: #007ff7; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Cinematic Grade</div>
          </div>
          <div class="slider-bar" style="position: absolute; top:0; bottom:0; left:50%; width: 2px; background: #fff; z-index: 5; pointer-events: none; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 28px; height: 28px; background: #007ff7; border: 3px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">
              <span class="material-icons-round" style="font-size: 18px; color: #fff;">unfold_more_double</span>
            </div>
          </div>
          <input type="range" class="slide-control" min="0" max="100" value="50" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; z-index: 10; margin: 0; padding: 0;">
        </div>

        <div style="width: 100%; padding: 4px 8px;">
          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.4; text-align: center;">
            Cinematic grading utilizes custom LUT profiles, chroma-noise reduction, and custom warmth balances tailored to wedding highlights.
          </p>
        </div>
      </div>
    `;

    const win = createSystemWindow('photos-app-window', 'Color Grading Showcase', '🖼️', 640, 520, contentHtml);
    if (!win) return;

    const sliderInput = win.querySelector('.slide-control');
    const afterImg = win.querySelector('.after-img');
    const sliderBar = win.querySelector('.slider-bar');

    sliderInput.addEventListener('input', (e) => {
      const val = e.target.value;
      afterImg.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
      sliderBar.style.left = `${val}%`;
    });
  }
};

// 6. TERMINAL SHELL OVERRIDES
// 6. TERMINAL SHELL OVERRIDES & PORTFOLIO COMMANDS
const terminalOverrides = {
  history: [],
  dirs: ["Desktop", "Portfolio", "Commercials", "Weddings"],
  currentPath: "~",

  init() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      this.rebindTerminalInput();
    }

    const terminalDock = document.querySelector('.open-terminal');
    if (terminalDock) {
      terminalDock.addEventListener('click', () => {
        setTimeout(() => this.rebindTerminalInput(), 100);
      });
    }
  },

  rebindTerminalInput() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    const newCursor = cursor.cloneNode(true);
    cursor.parentNode.replaceChild(newCursor, cursor);

    newCursor.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        const command = newCursor.textContent.trim();
        this.executeCommand(command, newCursor);
      }
    });

    const content = document.querySelector(".terminal .terminal_content");
    if (content) {
      content.addEventListener('click', () => {
        const c = document.querySelector(".cursor");
        if (c) c.focus();
      });
    }
  },

  executeCommand(command, cursorEl) {
    if (!command) return;

    let output = '';
    const cleanCommand = command.toLowerCase().split(' ');
    const cmd = cleanCommand[0];
    const arg = cleanCommand[1];

    switch(cmd) {
      case 'help':
        output = `
Available Commands:<br>
  <b>help</b>          - Lists all available terminal shell commands<br>
  <b>neofetch</b>      - Displays system information and ASCII logo<br>
  <b>resume</b>        - Displays Dharmik's education, experience & resume<br>
  <b>projects</b>      - Lists active portfolio video & code projects<br>
  <b>skills</b>        - Lists video editing software & developer tools<br>
  <b>contact</b>       - Displays developer contact info & email address<br>
  <b>social</b>        - Links to active social profiles<br>
  <b>hire</b>          - Display service rates and freelance booking pitch<br>
  <b>ls</b>            - Lists current desktop folders and project categories<br>
  <b>cat [folder]</b>   - Lists projects under folder, e.g. cat commercials<br>
  <b>clear</b>         - Clears the terminal screen buffer<br>
  <b>cd [dir]</b>      - Change directory path<br>
  <b>theme [light/dark]</b> - Switch desktop wallpaper theme<br>
`;
        break;
      
      case 'neofetch':
        output = `
<span class="color_green">                #####                </span>   <b>dharmik@macos-web-portfolio</b>
<span class="color_green">             #########*              </span>   ----------------------------
<span class="color_green">           #############             </span>   <b>OS:</b> Antigravity macOS Web Clone 2026.1
<span class="color_green">          ###############            </span>   <b>Host:</b> Dharmik Vaja Video Production Studio
<span class="color_blue">         .###############            </span>   <b>Kernel:</b> Javascript ES6 Engine
<span class="color_blue">         ################            </span>   <b>Uptime:</b> 42 mins
<span class="color_blue">          ###############            </span>   <b>Resolution:</b> ${window.innerWidth}x${window.innerHeight}
<span class="color_blue">           #############             </span>   <b>Shell:</b> Custom Zsh Virtual Emulator
<span class="color_blue">             #########               </span>   <b>CPU:</b> Apple M3 Max Deca-Core 3nm
<span class="color_green">               #####                 </span>   <b>Memory:</b> 64GB Unified RAM
`;
        break;

      case 'resume':
        output = `
<span class="color_blue">===================================================</span><br>
<b>DHARMIK VAJA - RESUME & EXPERIENCE</b><br>
<span class="color_blue">===================================================</span><br>
<b>Role:</b> Professional Video Editor & Web Developer<br>
<b>Location:</b> Gujarat, India<br>
<br>
<b>Professional Experience:</b><br>
- <b>Lead Cinematic Video Editor</b> | 2021 - Present<br>
  Specializing in wedding teasers, brand commercials, and reels.<br>
- <b>Web Frontend Developer</b> | 2023 - Present<br>
  Designing premium portfolio sites and interactive visual tools.<br>
<br>
<b>Education:</b><br>
- Creative Media Arts & Computer Applications Specialist<br>
`;
        break;

      case 'projects':
        output = `
<span class="color_blue">===================================================</span><br>
<b>ACTIVE PORTFOLIO PROJECTS</b><br>
<span class="color_blue">===================================================</span><br>
1. <b>Brand Reels</b>          - Ads for Saurashtra Refrigeration & Netflix (type: <i>cat commercials</i>)<br>
2. <b>Wedding Teasers</b>     - Cinematic wedding films & highlights (type: <i>cat weddings</i>)<br>
3. <b>Case Studies</b>        - Portfolio stories & design sheets (type: <i>cat case-studies</i>)<br>
`;
        break;

      case 'skills':
        output = `
<span class="color_blue">===================================================</span><br>
<b>TECHNICAL & CREATIVE SKILLS</b><br>
<span class="color_blue">===================================================</span><br>
<b>Video Production:</b><br>
- Adobe Premiere Pro | DaVinci Resolve | CapCut<br>
- Cinematic Color Grading (LUTs, Curve Correction)<br>
- Sound Editing, Audio Mixing & High-Tempo Beats Cuts<br>
<br>
<b>Frontend Coding:</b><br>
- HTML5 | CSS3 (Flexbox/Grid) | Vanilla JavaScript ES6<br>
- Responsive Web Architecture & Micro-Animations<br>
`;
        break;

      case 'contact':
        output = `
<span class="color_blue">===================================================</span><br>
<b>CONTACT INFORMATION</b><br>
<span class="color_blue">===================================================</span><br>
<b>Email:</b>     contact@dharmikvaja.com<br>
<b>Location:</b>  Gujarat, India<br>
<b>GitHub:</b>    https://github.com/dharmikvaja<br>
<br>
<i>* Run the 'hire' command to check booking availability!</i><br>
`;
        break;

      case 'social':
        output = `
<span class="color_blue">===================================================</span><br>
<b>SOCIAL MEDIA CHANNELS</b><br>
<span class="color_blue">===================================================</span><br>
- <b>GitHub:</b>    https://github.com/dharmikvaja<br>
- <b>Instagram:</b> @dharmik_vaja_edits<br>
`;
        break;

      case 'hire':
        output = `
<span class="color_blue">===================================================</span><br>
<b>BOOKING & FREELANCE INQUIRIES</b><br>
<span class="color_blue">===================================================</span><br>
Looking for a high-quality video editor or frontend developer?<br>
I am open to bookings for:<br>
- Commercial brand promo clips & advertisements<br>
- Full-length cinematic wedding teasers<br>
- Custom interactive web design builds<br>
<br>
<b>Email directly:</b> contact@dharmikvaja.com or launch the <b>Mail App</b> from the dock!<br>
`;
        break;

      case 'ls':
        output = this.dirs.join('\t\t') + '<br>';
        break;

      case 'cd':
        if (arg) {
          this.currentPath = arg;
          output = '';
        } else {
          this.currentPath = '~';
          output = '';
        }
        break;

      case 'cat':
        if (arg) {
          const lowerArg = arg.toLowerCase();
          if (lowerArg.includes('wedding') || lowerArg.includes('teaser')) {
            output = 'Opening wedding reel folder window...<br>';
            setTimeout(() => {
              if (typeof folderWindowManager !== 'undefined') {
                folderWindowManager.openFolder('wedding-reel');
              }
            }, 300);
          } else if (lowerArg.includes('commercial') || lowerArg.includes('brand') || lowerArg.includes('ad')) {
            output = 'Opening brand commercials window...<br>';
            setTimeout(() => {
              if (typeof folderWindowManager !== 'undefined') {
                folderWindowManager.openFolder('brand-commercials');
              }
            }, 300);
          } else if (lowerArg.includes('case')) {
            output = 'Opening case studies folder...<br>';
            setTimeout(() => {
              if (typeof folderWindowManager !== 'undefined') {
                folderWindowManager.openFolder('case-studies-soon');
              }
            }, 300);
          } else {
            output = `cat: file not found: ${arg}<br>`;
          }
        } else {
          output = 'cat: missing filename. Usage: cat [folder]<br>';
        }
        break;

      case 'clear':
        const terminalContent = document.querySelector(".terminal_content");
        if (terminalContent) {
          terminalContent.innerHTML = '';
        }
        output = 'Last Login: Today on console<br>';
        break;

      case 'theme':
        if (arg === 'light') {
          document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400')";
          output = 'Theme changed to light gradient.<br>';
        } else if (arg === 'dark') {
          document.body.style.backgroundImage = "url('./background/Porfolio-wallpaper.png')";
          output = 'Theme changed to default dark macOS.<br>';
        } else {
          output = 'Usage: theme [light/dark]<br>';
        }
        break;

      default:
        output = `zsh: command not found: ${cmd}. Type 'help' for instructions.<br>`;
    }

    cursorEl.removeAttribute('contenteditable');
    cursorEl.classList.remove('cursor');

    const content = document.querySelector(".terminal .terminal_content");
    content.innerHTML += output;
    
    const lineHtml = `<div class="terminal_line"><p><span class="color_green">➜</span>&nbsp;&nbsp;<span class="color_blue">${this.currentPath}</span>&nbsp;<span contenteditable="true" class="cursor"></span></p></div>`;
    content.innerHTML += lineHtml;

    setTimeout(() => {
      const activeCursor = document.querySelector('.cursor');
      if (activeCursor) {
        activeCursor.focus();
        this.rebindTerminalInput();
      }
    }, 20);
  }
};

// Spotlight Search System
const spotlightSearchSystem = {
  items: [
    { title: 'Apple Music', type: 'Application', icon: '🎵', action: () => musicPlayer.openMusicWindow() },
    { title: 'Messages', type: 'Application', icon: '💬', action: () => imessageApp.openMessagesWindow() },
    { title: 'VS Code', type: 'Application', icon: '💻', action: () => vscodeTrigger.openVSCodeWindow() },
    { title: 'Safari', type: 'Application', icon: '🧭', action: () => safariApp.openSafariWindow() },
    { title: 'Settings', type: 'Application', icon: '⚙️', action: () => settingsApp.openSettingsWindow() },
    { title: 'Mail', type: 'Application', icon: '✉️', action: () => mailApp.openMailWindow() },
    { title: 'Terminal', type: 'Application', icon: '📟', action: () => {
        const term = document.querySelector('.window.terminal');
        if (term) {
          term.style.display = 'block';
          term.classList.add('opening');
          const cursor = term.querySelector('.cursor');
          if (cursor) cursor.focus();
        }
      } 
    },
    { title: 'Photos', type: 'Application', icon: '🖼️', action: () => photosApp.openPhotosWindow() },
    { title: 'Brand Reels', type: 'Folder', icon: '📂', action: () => folderWindowManager.openFolder('brand-commercials') },
    { title: 'Wedding Teasers', type: 'Folder', icon: '📂', action: () => folderWindowManager.openFolder('wedding-teaser') },
    { title: 'Wedding Highlights', type: 'Folder', icon: '📂', action: () => folderWindowManager.openFolder('wedding-Highlight') },
    { title: 'Wedding Reels', type: 'Folder', icon: '📂', action: () => folderWindowManager.openFolder('wedding-reel') }
  ],
  
  selectedIndex: -1,
  filteredItems: [],

  init() {
    const searchIcon = document.querySelector('.open_Search');
    const spotlight = document.getElementById('spotlightSearch');
    const input = document.getElementById('spotlightInput');
    
    if (searchIcon) {
      searchIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    // Toggle on cmd+space or ctrl+space
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        this.toggle();
      }
    });

    if (input) {
      input.addEventListener('input', () => this.handleInput());
      input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (spotlight && !spotlight.contains(e.target) && spotlight.classList.contains('active')) {
        this.close();
      }
    });
  },

  toggle() {
    const spotlight = document.getElementById('spotlightSearch');
    const input = document.getElementById('spotlightInput');
    if (!spotlight) return;

    if (spotlight.classList.contains('active')) {
      this.close();
    } else {
      spotlight.classList.add('active');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 50);
      }
      this.handleInput();
    }
  },

  close() {
    const spotlight = document.getElementById('spotlightSearch');
    if (spotlight) {
      spotlight.classList.remove('active');
    }
  },

  handleInput() {
    const input = document.getElementById('spotlightInput');
    const resultsContainer = document.getElementById('spotlightResults');
    if (!input || !resultsContainer) return;

    const query = input.value.toLowerCase().trim();
    if (!query) {
      resultsContainer.classList.remove('active');
      resultsContainer.innerHTML = '';
      this.filteredItems = [];
      this.selectedIndex = -1;
      return;
    }

    this.filteredItems = this.items.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.type.toLowerCase().includes(query)
    );

    if (this.filteredItems.length === 0) {
      resultsContainer.innerHTML = `<div style="padding: 12px 16px; opacity: 0.5; font-size: 13px; text-align: left; color:#fff;">No results found</div>`;
      resultsContainer.classList.add('active');
      this.selectedIndex = -1;
      return;
    }

    this.selectedIndex = 0;
    this.renderResults();
  },

  renderResults() {
    const resultsContainer = document.getElementById('spotlightResults');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = this.filteredItems.map((item, idx) => `
      <div class="spotlight-result-item ${idx === this.selectedIndex ? 'selected' : ''}" data-index="${idx}">
        <span class="item-icon">${item.icon}</span>
        <span class="item-title">${item.title}</span>
        <span class="item-type">${item.type}</span>
      </div>
    `).join('');

    resultsContainer.classList.add('active');

    // Add click listeners to items
    resultsContainer.querySelectorAll('.spotlight-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'));
        this.executeItem(this.filteredItems[idx]);
      });
    });
  },

  handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.filteredItems.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredItems.length;
        this.renderResults();
        this.scrollActiveIntoView();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.filteredItems.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
        this.renderResults();
        this.scrollActiveIntoView();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredItems.length) {
        this.executeItem(this.filteredItems[this.selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  },

  executeItem(item) {
    if (item && item.action) {
      item.action();
      this.close();
    }
  },

  scrollActiveIntoView() {
    const activeEl = document.querySelector('.spotlight-result-item.selected');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }
};

// 7. MOCK VSCODE & WORKSPACE TRIGGERS
const vscodeTrigger = {
  init() {
    const vscodeBtn = document.querySelector('.open-vscode');
    if (vscodeBtn) {
      vscodeBtn.addEventListener('click', () => {
        this.openVSCodeWindow();
      });
    }
  },

  openVSCodeWindow() {
    const contentHtml = `
      <div style="background: #1e1e1e; padding: 0; overflow: hidden; display: flex; height: 100%;">
        <!-- Sidebar -->
        <div style="width: 180px; background: #252526; border-right: 1px solid #3c3c3c; padding: 12px; box-sizing: border-box; font-size: 12px; color: #abb2bf; user-select: none;">
          <h4 style="margin: 0 0 10px 0; color: #fff; font-size: 11px; text-transform: uppercase;">EXPLORER</h4>
          <div style="display: flex; align-items: center; gap: 6px; padding: 4px; background: #37373d; border-radius: 4px; cursor: pointer; color: #fff;">
            <span class="material-icons-round" style="font-size: 14px; color: #e06c75;">html</span> index.html
          </div>
          <div style="display: flex; align-items: center; gap: 6px; padding: 4px 6px; cursor: pointer;">
            <span class="material-icons-round" style="font-size: 14px; color: #61afef;">css</span> style.css
          </div>
          <div style="display: flex; align-items: center; gap: 6px; padding: 4px 6px; cursor: pointer;">
            <span class="material-icons-round" style="font-size: 14px; color: #d19a66;">javascript</span> script.js
          </div>
        </div>
        <!-- Editor Content -->
        <div style="flex: 1; display: flex; flex-direction: column;">
          <div style="height: 30px; background: #2d2d2d; display: flex; align-items: center; padding-left: 10px; border-bottom: 1px solid #3c3c3c;">
            <span style="font-size: 11px; background: #1e1e1e; color: #fff; padding: 6px 12px; border-top: 1px solid #007ff7; display: flex; align-items: center; gap: 6px;">
              index.html <span style="font-size: 10px; opacity: 0.6;">x</span>
            </span>
          </div>
          <textarea readonly style="flex: 1; width: 100%; border: none; background: #1e1e1e; color: #a9b7c6; font-family: monospace; font-size: 12px; padding: 16px; box-sizing: border-box; resize: none; outline: none; line-height: 1.5; height: 100%;">
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dharmik Vaja | Portfolio</title>
    <!-- Glassmorphic MacOS clone web build -->
    <link rel="stylesheet" href="./Css/style.css" />
  </head>
  <body onload="digi(), calculateBattery()">
    <div id="boot-loader">
      <img src="./icon/apple-white.png" alt="Apple logo" />
    </div>
    <!-- Visual content rendered inside desktop simulation -->
    <script src="./javascript/main.js"></script>
  </body>
</html>
          </textarea>
        </div>
      </div>
    `;

    createSystemWindow('vscode-app-window', 'VSCode - index.html', '💻', 720, 540, contentHtml);
  }
};

// 8. IMESSAGE CHAT SYSTEM
const imessageApp = {
  activeContact: 'dharmik',
  contacts: {
    'dharmik': {
      name: 'Dharmik Vaja',
      avatar: 'DV',
      preview: 'Hey there! Ready to edit some videos?',
      history: [
        { type: 'received', text: 'Hi! Welcome to my portfolio.' },
        { type: 'received', text: 'I am a professional video editor and colorist based in Gujarat, India. How can I help you today?' },
        { type: 'sent', text: 'Hey Dharmik! Love your portfolio design.' }
      ]
    },
    'assistant': {
      name: 'Antigravity AI',
      avatar: 'AI',
      preview: 'Beep boop! Ask me anything about this site.',
      history: [
        { type: 'received', text: 'Hello! I am your AI assistant.' },
        { type: 'received', text: 'You can ask me about Dharmik\'s services, skills, or even trigger terminal commands.' }
      ]
    },
    'client': {
      name: 'Client (Netflix Ad)',
      avatar: 'CL',
      preview: 'The color grading looks absolutely stunning!',
      history: [
        { type: 'received', text: 'Hey Dharmik, did you finish the teaser edit?' },
        { type: 'sent', text: 'Yes, just uploaded it to the Brand Reels folder!' },
        { type: 'received', text: 'Wow, the color grading looks absolutely stunning!' }
      ]
    }
  },

  init() {
    const imessageDockBtn = document.querySelector('.open-messages');
    if (imessageDockBtn) {
      imessageDockBtn.addEventListener('click', () => this.openIMessageWindow());
    }

    const messagesLaunchpad = document.querySelector('.child-launchpad[data-keywords*="Messages"]');
    if (messagesLaunchpad) {
      messagesLaunchpad.addEventListener('click', () => {
        this.openIMessageWindow();
        launchpad.opening.click(); // Close launchpad
      });
    }
  },

  openIMessageWindow() {
    const contentHtml = `
      <div class="imessage-container" style="height: 100%;">
        <!-- Sidebar -->
        <div class="imessage-sidebar">
          <div class="imessage-search-container">
            <input type="text" placeholder="Search" class="imessage-search" />
          </div>
          <div class="imessage-contacts" id="imessage-contacts-list">
            <!-- Rendered via JS -->
          </div>
        </div>
        <!-- Chat Area -->
        <div class="imessage-chat-area">
          <div class="imessage-chat-header">
            <h3 class="imessage-header-name" id="imessage-header-title">Dharmik Vaja</h3>
          </div>
          <div class="imessage-history" id="imessage-history-container">
            <!-- Rendered via JS -->
          </div>
          <div class="imessage-input-container">
            <div class="imessage-input-wrapper">
              <input type="text" placeholder="iMessage" class="imessage-input" id="imessage-text-field" />
              <button class="imessage-send-btn" id="imessage-submit-btn">
                <span class="material-icons-round">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const win = createSystemWindow('imessage-app-window', 'iMessage', '💬', 580, 460, contentHtml);
    if (!win) return;

    this.renderContacts();
    this.renderHistory();

    const input = win.querySelector('#imessage-text-field');
    const sendBtn = win.querySelector('#imessage-submit-btn');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    sendBtn.addEventListener('click', () => {
      this.sendMessage();
    });
  },

  renderContacts() {
    const list = document.getElementById('imessage-contacts-list');
    if (!list) return;

    list.innerHTML = '';
    Object.keys(this.contacts).forEach(key => {
      const contact = this.contacts[key];
      const card = document.createElement('div');
      card.className = `imessage-contact-card ${this.activeContact === key ? 'active' : ''}`;
      card.innerHTML = `
        <div class="imessage-avatar">${contact.avatar}</div>
        <div class="imessage-contact-info">
          <h4 class="imessage-contact-name">${contact.name}</h4>
          <p class="imessage-contact-preview">${contact.preview}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        this.activeContact = key;
        this.renderContacts();
        this.renderHistory();
      });

      list.appendChild(card);
    });
  },

  renderHistory() {
    const historyContainer = document.getElementById('imessage-history-container');
    const headerTitle = document.getElementById('imessage-header-title');
    if (!historyContainer || !headerTitle) return;

    const contact = this.contacts[this.activeContact];
    headerTitle.textContent = contact.name;
    historyContainer.innerHTML = '';

    contact.history.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `imessage-bubble ${msg.type}`;
      bubble.innerHTML = msg.text;
      historyContainer.appendChild(bubble);
    });

    setTimeout(() => {
      historyContainer.scrollTop = historyContainer.scrollHeight;
    }, 10);
  },

  sendMessage() {
    const input = document.getElementById('imessage-text-field');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    const contact = this.contacts[this.activeContact];
    
    contact.history.push({ type: 'sent', text: text });
    contact.preview = text;
    this.renderHistory();
    this.renderContacts();
    input.value = '';

    setTimeout(() => {
      this.showTypingIndicator();
    }, 800);

    setTimeout(() => {
      this.triggerAutoReply(text);
    }, 2200);
  },

  showTypingIndicator() {
    const historyContainer = document.getElementById('imessage-history-container');
    if (!historyContainer) return;

    const indicator = document.createElement('div');
    indicator.className = 'imessage-bubble received typing-indicator-bubble';
    indicator.id = 'imessage-typing';
    indicator.innerHTML = '<span class="typing-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#888; margin:0 2px; animation: bounce 1.2s infinite 0.1s;">.</span><span class="typing-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#888; margin:0 2px; animation: bounce 1.2s infinite 0.3s;">.</span><span class="typing-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#888; margin:0 2px; animation: bounce 1.2s infinite 0.5s;">.</span>';
    historyContainer.appendChild(indicator);
    historyContainer.scrollTop = historyContainer.scrollHeight;
  },

  triggerAutoReply(userText) {
    const typing = document.getElementById('imessage-typing');
    if (typing) typing.remove();

    const contact = this.contacts[this.activeContact];
    let replyText = '';
    const cleanText = userText.toLowerCase();

    if (this.activeContact === 'dharmik') {
      if (cleanText.includes('hire') || cleanText.includes('work') || cleanText.includes('freelance') || cleanText.includes('project')) {
        replyText = "I'm absolutely open for new video editing and grading commissions! Let's connect over mail at <b>dharmikvaja1111@gmail.com</b> to discuss timeline and project details.";
      } else if (cleanText.includes('rate') || cleanText.includes('cost') || cleanText.includes('price') || cleanText.includes('charge')) {
        replyText = "My editing rates depend heavily on the video project specs (reels vs commercial promos, sound design needs, etc.). Shoot me an email with your project brief and I'll drop a tailored estimate!";
      } else if (cleanText.includes('software') || cleanText.includes('tool') || cleanText.includes('adobe')) {
        replyText = "I edit primarily using <b>Adobe Premiere Pro</b> and <b>DaVinci Resolve Studio</b> (specifically color grading). Check out the App Store on this desktop to see my tool installations!";
      } else {
        replyText = "Thanks for your message! Feel free to ask about my video turnaround times, previous client reviews, or my editing process.";
      }
    } else if (this.activeContact === 'assistant') {
      replyText = "Beep boop! I am your AI desktop companion. You can configure wallpaper styles in System Preferences or trigger search queries in Safari!";
    } else {
      replyText = "That color grading node system really makes the footage pop. Let's lock this edit in for production!";
    }

    contact.history.push({ type: 'received', text: replyText });
    contact.preview = replyText.replace(/<[^>]*>/g, '');
    this.renderHistory();
    this.renderContacts();
  }
};

// 9. SAFARI WEB BROWSER
const safariApp = {
  currentUrl: 'google.com',

  init() {
    const safariDockBtn = document.querySelector('.open-map'); // fallback or launcher binding
    const safariLaunchpad = document.querySelector('.child-launchpad[data-keywords*="Safari"]');
    if (safariLaunchpad) {
      safariLaunchpad.addEventListener('click', () => {
        this.openSafariWindow();
        launchpad.opening.click();
      });
    }
  },

  openSafariWindow() {
    const contentHtml = `
      <div class="safari-container" style="height:100%;">
        <!-- Toolbar -->
        <div class="safari-toolbar">
          <div class="safari-nav-buttons">
            <span class="safari-nav-btn material-icons-round" id="safari-home-btn" style="font-size:18px;">home</span>
          </div>
          <div class="safari-address-bar-container">
            <span class="material-icons-round safari-address-icon" style="font-size:14px;">lock</span>
            <input type="text" class="safari-address-bar" id="safari-url-input" value="https://google.com" />
          </div>
        </div>
        <!-- Viewport -->
        <div class="safari-viewport" id="safari-view" style="height: calc(100% - 48px); overflow: auto;">
          <!-- Loaded page content -->
        </div>
      </div>
    `;

    const win = createSystemWindow('safari-app-window', 'Safari', '🧭', 640, 500, contentHtml);
    if (!win) return;

    const input = win.querySelector('#safari-url-input');
    const homeBtn = win.querySelector('#safari-home-btn');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.navigateTo(input.value);
      }
    });

    homeBtn.addEventListener('click', () => {
      this.navigateTo('google.com');
    });

    this.navigateTo('google.com');
  },

  navigateTo(url) {
    const viewport = document.getElementById('safari-view');
    const input = document.getElementById('safari-url-input');
    if (!viewport) return;

    let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').toLowerCase().trim();
    if (!cleanUrl) cleanUrl = 'google.com';

    input.value = `https://${cleanUrl}`;

    if (cleanUrl.includes('google.com')) {
      viewport.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px; font-family:sans-serif; text-align:center; color:#222; box-sizing:border-box;">
          <h1 style="font-size:42px; font-weight:bold; margin-bottom:20px; background:linear-gradient(45deg, #4285f4, #ea4335, #fbbc05, #34a853); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-top:0;">Google</h1>
          <div style="position:relative; width:80%; max-width:400px; margin-bottom:12px;">
            <input type="text" placeholder="Search Google or type a URL" id="safari-search-query" style="width:100%; padding:10px 16px; border:1px solid #dfe1e5; border-radius:24px; outline:none; box-sizing:border-box; box-shadow:0 1px 6px rgba(32,33,36,0.1);" />
          </div>
          <p style="font-size:12px; color:#666;">Try searching: <b>dharmik vaja</b> or type <b>instagram.com</b></p>
        </div>
      `;

      const searchInput = viewport.querySelector('#safari-search-query');
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.showSearchResults(searchInput.value);
        }
      });
    } else if (cleanUrl.includes('instagram.com')) {
      viewport.innerHTML = `
        <div class="mock-insta-container">
          <div class="mock-insta-header">
            <div class="mock-insta-avatar">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Avatar">
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:10px;">
                <h2 class="mock-insta-logo" style="margin:0;">dharmik_vaja_</h2>
                <button style="background:#0095f6; color:#fff; border:none; padding:5px 12px; font-weight:bold; border-radius:4px; font-size:12px; cursor:pointer;">Follow</button>
              </div>
              <div style="display:flex; gap:16px; margin-top:10px; font-size:13px; color:#262626;">
                <span><b>13</b> posts</span>
                <span><b>2.4k</b> followers</span>
                <span><b>410</b> following</span>
              </div>
              <p style="margin:10px 0 0 0; font-size:13px; font-weight:bold; color:#262626; text-align:left;">Dharmik Vaja</p>
              <p style="margin:2px 0 0 0; font-size:12px; color:#8e8e8e; text-align:left;">Video Editor & Colorist | Visual Storytelling</p>
            </div>
          </div>
          <div class="mock-insta-grid">
            <div class="mock-insta-item" onclick="openInstaVideo('https://www.youtube.com/embed/oeD95hF3cyg')">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=200">
              <div class="mock-insta-overlay"><span class="material-icons-round">play_arrow</span> Reels</div>
            </div>
            <div class="mock-insta-item" onclick="openInstaVideo('https://www.youtube.com/embed/zFNda09-dlQ')">
              <img src="https://res.cloudinary.com/drpu4slkk/image/upload/v1781181918/KRUPAL_KRUPALI_mm7x6v.png">
              <div class="mock-insta-overlay"><span class="material-icons-round">play_arrow</span> Reels</div>
            </div>
            <div class="mock-insta-item" onclick="openInstaVideo('https://www.youtube.com/embed/QEHcNkL01Mg')">
              <img src="https://res.cloudinary.com/drpu4slkk/image/upload/f_auto/q_auto/dpr_auto/malvikaba_im5p5d">
              <div class="mock-insta-overlay"><span class="material-icons-round">play_arrow</span> Reels</div>
            </div>
          </div>
        </div>
      `;
    } else {
      viewport.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:20px; color:#555; box-sizing:border-box;">
          <span class="material-icons-round" style="font-size:48px; color:#d1d1d1; margin-bottom:12px;">language</span>
          <h3>Safari cannot open page "${cleanUrl}"</h3>
          <p style="font-size:12px; max-width:320px; color:#888;">It looks like this simulated website domain is not configured yet. Return to <b>google.com</b> or search for <b>dharmik</b>!</p>
        </div>
      `;
    }
  },

  showSearchResults(query) {
    const viewport = document.getElementById('safari-view');
    if (!viewport) return;

    let resultsHtml = '';
    const cleanQuery = query.toLowerCase();

    if (cleanQuery.includes('dharmik') || cleanQuery.includes('vaja') || cleanQuery.includes('edit')) {
      resultsHtml = `
        <div style="padding:12px; border-bottom:1px solid #e8eaed; text-align:left;">
          <a href="#" onclick="safariApp.navigateTo('instagram.com')" style="color:#1a0dab; text-decoration:none; font-size:16px; font-weight:500;">Dharmik Vaja (@dharmik_vaja_) • Instagram Reels</a>
          <p style="font-size:12px; color:#006621; margin:2px 0 0 0;">https://instagram.com/dharmik_vaja_</p>
          <p style="font-size:13px; color:#545454; margin:4px 0 0 0;">See reels, highlights, and color grading videos from Dharmik Vaja. Video Editing and creative cinematography.</p>
        </div>
        <div style="padding:12px; border-bottom:1px solid #e8eaed; text-align:left;">
          <a href="#" onclick="folderWindowManager.openFolder('brand-commercials'); document.getElementById('safari-app-window').remove();" style="color:#1a0dab; text-decoration:none; font-size:16px; font-weight:500;">Dharmik Vaja - Video Portfolio (Brand Commercials)</a>
          <p style="font-size:12px; color:#006621; margin:2px 0 0 0;">dharmikvaja.in > portfolio > brand-reels</p>
          <p style="font-size:13px; color:#545454; margin:4px 0 0 0;">Launch the interactive folder directly inside this macOS simulation desktop to play premium advertising commercials.</p>
        </div>
      `;
    } else {
      resultsHtml = `
        <div style="padding:20px; color:#555; text-align:center;">
          <p>No results found for <b>"${query}"</b>.</p>
          <p style="font-size:12px; color:#888;">Try searching for <b>"Dharmik Vaja"</b> to find simulated portfolio profiles.</p>
        </div>
      `;
    }

    viewport.innerHTML = `
      <div style="padding:20px; font-family:sans-serif; height:100%; box-sizing:border-box; overflow:auto;">
        <h3 style="font-size:13px; color:#70757a; margin-top:0; text-align:left;">About 3 mock results (0.01 seconds) for "${query}"</h3>
        ${resultsHtml}
      </div>
    `;
  }
};

// Global helper to play video directly from instagram click
function openInstaVideo(url) {
  if (typeof folderWindowManager !== 'undefined') {
    folderWindowManager.playVideo(url, 'youtube');
  }
}

// 10. APP STORE (SKILLS CATALOG SYSTEM)
const appStoreApp = {
  installedApps: ['premiere', 'davinci', 'aftereffects', 'audition'],

  init() {
    const storeDockBtn = document.querySelector('.open-appstore');
    if (storeDockBtn) {
      storeDockBtn.addEventListener('click', () => this.openAppStoreWindow());
    }

    const appStoreLaunchpad = document.querySelector('.child-launchpad[data-keywords*="Appstore"]');
    if (appStoreLaunchpad) {
      appStoreLaunchpad.addEventListener('click', () => {
        this.openAppStoreWindow();
        launchpad.opening.click();
      });
    }
  },

  openAppStoreWindow() {
    const contentHtml = `
      <div class="appstore-container" style="height: 100%;">
        <!-- Sidebar -->
        <div class="appstore-sidebar">
          <div class="appstore-nav-item active">Discover</div>
          <div class="appstore-nav-item">Create</div>
          <div class="appstore-nav-item">Work</div>
          <div class="appstore-nav-item">Develop</div>
        </div>
        <!-- Grid -->
        <div class="appstore-content">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; text-align:left;">Dharmik's Creative Tools</h2>
          <div class="appstore-grid" id="appstore-cards-list">
            <!-- Rendered via JS -->
          </div>
        </div>
      </div>
    `;

    const win = createSystemWindow('appstore-app-window', 'App Store', '🔵', 600, 500, contentHtml);
    if (!win) return;

    this.renderAppCards();
  },

  renderAppCards() {
    const list = document.getElementById('appstore-cards-list');
    if (!list) return;

    const apps = [
      { id: 'premiere', name: 'Adobe Premiere Pro', category: 'Video Editing', icon: './icon/dock/preferences.png', desc: 'Industry standard professional timeline editing.' },
      { id: 'davinci', name: 'DaVinci Resolve Studio', category: 'Color Grading', icon: './icon/dock/photos.png', desc: 'Hollywood-level color correction and grading workflows.' },
      { id: 'aftereffects', name: 'Adobe After Effects', category: 'Motion Graphics', icon: './icon/dock/appstore.png', desc: 'Cinematic visual effects, composites, and motion assets.' },
      { id: 'audition', name: 'Adobe Audition', category: 'Sound Design', icon: './icon/dock/music.png', desc: 'Precision audio cleanups, soundscapes, and transitions.' },
      { id: 'photoshop', name: 'Adobe Photoshop', category: 'Graphic Assets', icon: './icon/dock/photos.png', desc: 'Creative layout design and video thumbnail edits.' }
    ];

    list.innerHTML = '';
    apps.forEach(app => {
      const card = document.createElement('div');
      card.className = 'appstore-card';
      const isInstalled = this.installedApps.includes(app.id);

      card.innerHTML = `
        <div class="appstore-card__icon">
          <span style="font-size:28px;">💻</span>
        </div>
        <div class="appstore-card__info" style="text-align:left;">
          <div>
            <h3 class="appstore-card__title">${app.name}</h3>
            <p class="appstore-card__category">${app.category}</p>
            <p class="appstore-card__desc">${app.desc}</p>
          </div>
          <button class="appstore-card__btn ${isInstalled ? 'installed' : ''}" data-id="${app.id}" style="border:none;">
            ${isInstalled ? 'OPEN' : 'GET'}
          </button>
        </div>
      `;

      const btn = card.querySelector('.appstore-card__btn');
      btn.addEventListener('click', () => {
        if (!this.installedApps.includes(app.id)) {
          this.installApp(app.id, btn);
        } else {
          if (app.id === 'davinci' || app.id === 'photoshop') {
            photosApp.openPhotosWindow();
          } else if (app.id === 'premiere') {
            if (typeof folderWindowManager !== 'undefined') {
              folderWindowManager.openFolder('brand-commercials');
            }
          }
        }
      });

      list.appendChild(card);
    });
  },

  installApp(appId, btnElement) {
    btnElement.textContent = 'Downloading...';
    btnElement.disabled = true;

    setTimeout(() => {
      this.installedApps.push(appId);
      btnElement.textContent = 'OPEN';
      btnElement.disabled = false;
      btnElement.classList.add('installed');
      alert(`Skill Tool "${appId}" successfully downloaded to macOS Dock and Launchpad.`);
    }, 1500);
  }
};

// 11. SYSTEM PREFERENCES & WALlPAPER SETTING PANEL
const settingsApp = {
  wallpapers: [
    { name: 'Default Dark', url: './background/Porfolio-wallpaper.png' },
    { name: 'Lofi Purple', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400' },
    { name: 'Neon Cyber', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400' }
  ],
  activeWallpaperIndex: 0,

  init() {
    const settingsDockBtn = document.querySelector('.open-settings');
    if (settingsDockBtn) {
      settingsDockBtn.addEventListener('click', () => this.openSettingsWindow());
    }
  },

  openSettingsWindow() {
    const contentHtml = `
      <div class="settings-container" style="height: 100%;">
        <!-- Sidebar -->
        <div class="settings-sidebar">
          <div class="settings-nav-item active">Desktop & Screen</div>
          <div class="settings-nav-item">Appearance</div>
          <div class="settings-nav-item">Battery</div>
        </div>
        <!-- Content -->
        <div class="settings-content" id="settings-body-view">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    const win = createSystemWindow('settings-app-window', 'System Settings', '⚙️', 520, 420, contentHtml);
    if (!win) return;

    this.renderDesktopSettings();
    
    const navItems = win.querySelectorAll('.settings-nav-item');
    navItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (index === 0) this.renderDesktopSettings();
        else if (index === 1) this.renderAppearanceSettings();
        else this.renderBatterySettings();
      });
    });
  },

  renderDesktopSettings() {
    const view = document.getElementById('settings-body-view');
    if (!view) return;

    view.innerHTML = `
      <div class="settings-group" style="text-align:left;">
        <h3 class="settings-title" style="margin-top:0;">Select Desktop Wallpaper</h3>
        <div class="wallpaper-grid" id="wallpapers-list">
          <!-- Wallpapers thumbnails -->
        </div>
      </div>
    `;

    const list = view.querySelector('#wallpapers-list');
    this.wallpapers.forEach((wall, index) => {
      const card = document.createElement('div');
      card.className = `wallpaper-card ${this.activeWallpaperIndex === index ? 'active' : ''}`;
      card.innerHTML = `<img src="${wall.url}" alt="${wall.name}">`;
      
      card.addEventListener('click', () => {
        this.activeWallpaperIndex = index;
        document.body.style.backgroundImage = `url('${wall.url}')`;
        this.renderDesktopSettings();
      });

      list.appendChild(card);
    });
  },

  renderAppearanceSettings() {
    const view = document.getElementById('settings-body-view');
    if (!view) return;

    view.innerHTML = `
      <div class="settings-group" style="text-align:left;">
        <h3 class="settings-title" style="margin-top:0;">Appearance Details</h3>
        
        <div class="settings-toggle-row">
          <span class="settings-label">Dark Mode Theme</span>
          <button style="background:#007ff7; color:#fff; padding:6px 12px; border-radius:6px; cursor:pointer; border:none;" id="appearance-theme-toggle">TOGGLE</button>
        </div>

        <div class="settings-toggle-row">
          <span class="settings-label">Enable Blur Glassmorphic Transitions</span>
          <span class="material-icons-round" style="color:#32d74b; font-size:24px;">toggle_on</span>
        </div>
      </div>
    `;

    const toggleBtn = view.querySelector('#appearance-theme-toggle');
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme-mode');
      alert("Simulated Theme Toggled. Text contrast adjustments loaded.");
    });
  },

  renderBatterySettings() {
    const view = document.getElementById('settings-body-view');
    if (!view) return;

    view.innerHTML = `
      <div class="settings-group" style="text-align:left;">
        <h3 class="settings-title" style="margin-top:0;">Power Preferences</h3>
        <div class="settings-toggle-row">
          <span class="settings-label">Low Power Mode</span>
          <span class="material-icons-round" style="color:#8e8e93; font-size:24px;">toggle_off</span>
        </div>
        <p style="font-size:11px; opacity:0.6; line-height:1.4;">Low Power Mode reduces performance slightly to conserve energy when operating on battery reserves.</p>
      </div>
    `;
  }
};

// 12. SIRI VOICE/TEXT FLOATING WIDGET
const siriWidgetApp = {
  init() {
    const siriLaunchpad = document.querySelector('.child-launchpad[data-keywords*="Siri"]');
    if (siriLaunchpad) {
      siriLaunchpad.addEventListener('click', () => {
        this.toggleSiri();
        launchpad.opening.click();
      });
    }

    if (!document.querySelector('.siri-widget')) {
      const siriDiv = document.createElement('div');
      siriDiv.className = 'siri-widget';
      siriDiv.innerHTML = `
        <div class="siri-header">
          <span class="siri-title">Siri Assistant</span>
          <span class="material-icons-round" style="font-size:16px; cursor:pointer;" onclick="siriWidgetApp.toggleSiri()">close</span>
        </div>
        <div class="siri-content" id="siri-chat-history" style="text-align:left;">
          <div class="siri-bubble assistant">What can I help you with today?</div>
        </div>
        <div class="siri-orb-container">
          <div class="siri-orb"></div>
          <input type="text" placeholder="Ask Siri..." class="siri-input" id="siri-text-input" />
        </div>
      `;

      document.body.appendChild(siriDiv);

      const input = siriDiv.querySelector('#siri-text-input');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.askSiri();
        }
      });
    }
  },

  toggleSiri() {
    const siri = document.querySelector('.siri-widget');
    if (!siri) return;

    if (siri.style.display === 'none' || !siri.style.display) {
      siri.style.display = 'flex';
      setTimeout(() => siri.style.transform = 'scale(1)', 10);
    } else {
      siri.style.transform = 'scale(0.8)';
      setTimeout(() => siri.style.display = 'none', 300);
    }
  },

  askSiri() {
    const input = document.getElementById('siri-text-input');
    const history = document.getElementById('siri-chat-history');
    if (!input || !input.value.trim() || !history) return;

    const query = input.value.trim();
    input.value = '';

    const userBubble = document.createElement('div');
    userBubble.className = 'siri-bubble user';
    userBubble.textContent = query;
    history.appendChild(userBubble);
    history.scrollTop = history.scrollHeight;

    setTimeout(() => {
      const siriBubble = document.createElement('div');
      siriBubble.className = 'siri-bubble assistant';
      siriBubble.textContent = '...';
      siriBubble.id = 'siri-thinking';
      history.appendChild(siriBubble);
      history.scrollTop = history.scrollHeight;
    }, 400);

    setTimeout(() => {
      const thinking = document.getElementById('siri-thinking');
      if (thinking) thinking.remove();

      let reply = '';
      const cleanQ = query.toLowerCase();

      if (cleanQ.includes('dharmik') || cleanQ.includes('who is')) {
        reply = 'Dharmik Vaja is a professional video editor specializing in wedding cinematics and commercial advertisements.';
      } else if (cleanQ.includes('contact') || cleanQ.includes('email') || cleanQ.includes('mail')) {
        reply = 'You can reach Dharmik directly via email at dharmikvaja1111@gmail.com.';
      } else if (cleanQ.includes('music') || cleanQ.includes('song')) {
        reply = 'Opening the music player app...';
        setTimeout(() => musicPlayer.openMusicWindow(), 600);
      } else if (cleanQ.includes('grade') || cleanQ.includes('color') || cleanQ.includes('photo')) {
        reply = 'Opening the color grading showcase slider...';
        setTimeout(() => photosApp.openPhotosWindow(), 600);
      } else {
        reply = 'I found information matching your request. Try asking: "Who is Dharmik?" or "Show me video tools".';
      }

      const replyBubble = document.createElement('div');
      replyBubble.className = 'siri-bubble assistant';
      replyBubble.textContent = reply;
      history.appendChild(replyBubble);
      history.scrollTop = history.scrollHeight;
    }, 1800);
  }
};

// 13. MAIL SYSTEM
const mailApp = {
  activeEmail: 0,
  emails: [
    {
      sender: 'Netflix Ad Production',
      avatar: 'NP',
      subject: 'Cinematic Teaser Approval',
      preview: 'Hi Dharmik, the team has reviewed the draft...',
      body: `Hi Dharmik,<br><br>The Netflix advertising team has reviewed the draft of the wedding-teaser style campaign. The contrast curves and sepia tone look absolutely incredible.<br><br>Please proceed with final rendering. We look forward to locking this edit in for distribution.<br><br>Best regards,<br>Sarah Jenkins<br>Netflix Production Lead`
    },
    {
      sender: 'Krupal & Krupali (Wedding Client)',
      avatar: 'KK',
      subject: 'Loved the Haldi Teaser!',
      preview: 'Oh my gosh, Dharmik! The Haldi video teaser was...',
      body: `Hi Dharmik bhai,<br><br>Oh my gosh, we loved the Haldi video edit so much! The transition cuts to the music beats are perfect. All our family members are asking who did the editing.<br><br>Could you please send over the remaining reels by this weekend?<br><br>Thank you so much!<br>Krupal & Krupali`
    },
    {
      sender: 'Saurashtra Refrigeration',
      avatar: 'SR',
      subject: 'Brand Commercial Promo Campaign',
      preview: 'Dear Dharmik, the new storefront commercial is...',
      body: `Hello Dharmik,<br><br>The store advertisement video you edited for Saurashtra Refrigeration is performing exceptionally well. We have seen a noticeable increase in social media engagement since publishing it.<br><br>We would love to discuss editing another series of promo ads soon.<br><br>Best,<br>Jiten Patel<br>Director, Saurashtra Refrigeration`
    }
  ],

  init() {
    const mailBtn = document.querySelector('.open-mail');
    if (mailBtn) {
      mailBtn.addEventListener('click', () => this.openMailWindow());
    }
  },

  openMailWindow() {
    const contentHtml = `
      <div style="display: flex; height: 100%; background: #1e1e1e; color: #fff; font-family: sans-serif;">
        <div style="width: 220px; background: #181818; border-right: 1px solid #333; display: flex; flex-direction: column; overflow-y: auto;" id="mail-list-pane">
          <!-- Rendered dynamically -->
        </div>
        <div style="flex: 1; padding: 20px; background: #1e1e1e; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; text-align:left;" id="mail-body-pane">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    const win = createSystemWindow('mail-app-window', 'Mail', '✉️', 600, 460, contentHtml);
    if (!win) return;

    this.renderEmailList();
    this.renderEmailBody();
  },

  renderEmailList() {
    const list = document.getElementById('mail-list-pane');
    if (!list) return;

    list.innerHTML = '';
    this.emails.forEach((email, index) => {
      const card = document.createElement('div');
      card.style.padding = '12px 10px';
      card.style.cursor = 'pointer';
      card.style.borderBottom = '1px solid #282828';
      card.style.background = this.activeEmail === index ? '#007ff7' : 'transparent';
      card.style.transition = 'background 0.2s';
      card.style.display = 'flex';
      card.style.gap = '10px';
      card.style.alignItems = 'center';
      card.style.textAlign = 'left';

      card.innerHTML = `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${this.activeEmail === index ? 'rgba(255,255,255,0.2)' : '#3a3a3a'}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px;">${email.avatar}</div>
        <div style="flex: 1; min-width: 0;">
          <h4 style="margin: 0; font-size: 12px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email.sender}</h4>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 500; opacity: 0.9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email.subject}</p>
          <p style="margin: 2px 0 0 0; font-size: 10px; opacity: 0.6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email.preview}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        this.activeEmail = index;
        this.renderEmailList();
        this.renderEmailBody();
      });

      list.appendChild(card);
    });
  },

  renderEmailBody() {
    const body = document.getElementById('mail-body-pane');
    if (!body) return;

    const email = this.emails[this.activeEmail];
    body.innerHTML = `
      <div style="border-bottom: 1px solid #333; padding-bottom: 12px;">
        <h2 style="margin: 0; font-size: 16px; font-weight: 600;">${email.subject}</h2>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; opacity: 0.8;">
          <span>From: <b>${email.sender}</b></span>
          <span>Today</span>
        </div>
      </div>
      <div style="font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.9); padding-top: 10px;">
        ${email.body}
      </div>
    `;
  }
};

// 14. FINDER DOCK TRIGGER
const finderDock = {
  init() {
    const finderBtn = document.querySelector('.open-finder');
    if (finderBtn) {
      finderBtn.addEventListener('click', () => {
        if (typeof folderWindowManager !== 'undefined') {
          folderWindowManager.openFolder('brand-commercials');
        }
      });
    }
  }
};

// INITIALIZE ALL SYSTEM INTEGRATIONS ON LOAD
document.addEventListener('DOMContentLoaded', () => {
  mobileEngine.init();
  notesPersistence.init();
  musicPlayer.init();
  photosApp.init();
  terminalOverrides.init();
  vscodeTrigger.init();
  imessageApp.init();
  safariApp.init();
  appStoreApp.init();
  settingsApp.init();
  siriWidgetApp.init();
  mailApp.init();
  finderDock.init();
  spotlightSearchSystem.init();
});