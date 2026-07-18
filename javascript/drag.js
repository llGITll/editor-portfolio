/**
 * VANILLA DRAG & DROP UTILITY
 * Replaces jQuery UI draggable and supports touch devices
 */
function makeDraggable(element, handleSelector) {
  const handle = handleSelector ? element.querySelector(handleSelector) : element;
  if (!handle) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  handle.style.cursor = 'grab';

  const onStart = (clientX, clientY) => {
    isDragging = true;
    handle.style.cursor = 'grabbing';
    
    // Bring window to front
    if (typeof folderWindowManager !== 'undefined' && folderWindowManager.bringToFront) {
      folderWindowManager.bringToFront(element);
    } else {
      // Fallback: increment zIndex relative to other windows
      const windows = document.querySelectorAll('.window, .calculator, .folder-window');
      let maxZ = 30;
      windows.forEach(w => {
        const z = parseInt(w.style.zIndex) || 0;
        if (z > maxZ) maxZ = z;
      });
      element.style.zIndex = maxZ + 1;
    }

    const computedStyle = window.getComputedStyle(element);
    initialLeft = parseFloat(computedStyle.left) || element.offsetLeft;
    initialTop = parseFloat(computedStyle.top) || element.offsetTop;
    
    startX = clientX;
    startY = clientY;
  };

  const onMove = (clientX, clientY) => {
    if (!isDragging) return;
    
    const dx = clientX - startX;
    const dy = clientY - startY;
    
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Prevent dragging header fully off-screen (keep titlebar visible below top bar)
    const navbarHeight = 25; 
    if (newTop < navbarHeight) newTop = navbarHeight;
    
    // Keep at least 40px of window width on screen
    if (newLeft < -element.offsetWidth + 40) newLeft = -element.offsetWidth + 40;
    if (newLeft > window.innerWidth - 40) newLeft = window.innerWidth - 40;

    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';
  };

  const onEnd = () => {
    isDragging = false;
    handle.style.cursor = 'grab';
  };

  // Mouse Events
  handle.addEventListener('mousedown', (e) => {
    // Ignore clicks on control buttons or inputs
    if (e.target.closest('.window__taskbar--actions') || 
        e.target.closest('.calculator__top--taskabr') || 
        e.target.closest('.folder-window__controls') || 
        e.target.closest('button') || 
        e.target.closest('input')) {
      return;
    }
    onStart(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      onMove(e.clientX, e.clientY);
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) onEnd();
  });

  // Touch Events
  handle.addEventListener('touchstart', (e) => {
    if (e.target.closest('.window__taskbar--actions') || 
        e.target.closest('.calculator__top--taskabr') || 
        e.target.closest('.folder-window__controls') || 
        e.target.closest('button') || 
        e.target.closest('input')) {
      return;
    }
    const touch = e.touches[0];
    onStart(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      onMove(touch.clientX, touch.clientY);
      // Only prevent default on move to avoid breaking click responsiveness
      if (e.cancelable) e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (isDragging) onEnd();
  });
}

// Global initialization helper
function initDraggableApps() {
  const terminal = document.querySelector('.terminal');
  if (terminal) makeDraggable(terminal, '.window__taskbar');

  const notes = document.querySelector('.note');
  if (notes) makeDraggable(notes, '.window__taskbar');

  const calculator = document.querySelector('.calculator');
  if (calculator) makeDraggable(calculator, '.calculator__top');

  const maps = document.querySelector('.maps');
  if (maps) makeDraggable(maps, '.window__taskbar');

  const spotlight = document.querySelector('.spotlight_serach');
  if (spotlight) makeDraggable(spotlight);
}
