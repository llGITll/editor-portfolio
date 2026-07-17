/**
 * SCRIPT.JS - Desktop & App Management
 * Fixed: Container now shows by default so folder windows are visible
 */

/********** ELEMENTS **********/
const elements = {
  body: document.querySelector("body"),
  navbar: document.querySelector(".navbar"),
  open_spotlight: document.querySelector(".open_Search"),
  spotlight_search: document.querySelector(".spotlight_serach"),
  brightness_range: document.getElementById("brightness"),
  sound_range: document.getElementById("sound"),
  clockElement: document.getElementById("clock"),
  clockWrapper: document.querySelector(".clock"),
  widgetsPanel: document.querySelector(".widgets-panel"),
  batteryButton: document.querySelector(".battery"),
  batteryText: document.querySelector(".battery__text"),
  batteryPopup: document.querySelector(".battery__popup"),
  batteryPopupText: document.querySelector(".battery__popup header span"),
  batteryProgress: document.querySelector(".battery__progress"),
  batteryIsChargingLogo: document.querySelector(".is-charging"),
  powerSource: document.querySelector(".power-source"),
};

// Calculator App
const calculatorApp = {
  app_name: document.querySelector("#calculator"),
  window: document.querySelector(".calculator"),
  full: document.querySelector(".full"),
  close: document.querySelector(".close-cal"),
  backfull: document.querySelector(".min-cal"),
  point: document.querySelector("#point-cal"),
  opening: document.querySelector(".open-cal"),
  opening_l: document.querySelector(".open-cal-lunching"),
};

// Notes App
const notesApp = {
  app_name: document.querySelector("#Notes"),
  window: document.querySelector(".note"),
  full: document.querySelector(".full-note"),
  close: document.querySelector(".close-note"),
  backfull: document.querySelector(".backfull-note"),
  point: document.querySelector("#point-note"),
  adding: document.querySelector(".adding"),
  deleting: document.querySelector(".deleting"),
  content_typing: document.querySelector(".content__typing"),
  opening: document.querySelector(".open-note"),
  notes: document.querySelector(".content__sidebar--notes"),
};

// Terminal App
const terminalApp = {
  app_name: document.querySelector("#Terminal"),
  window: document.querySelector(".terminal"),
  full: document.querySelector(".full"),
  close: document.querySelector(".close"),
  backfull: document.querySelector(".backfull"),
  point: document.querySelector("#point-terminal"),
  content: document.querySelector(".terminal .terminal_content"),
  taskbar: document.querySelector(".terminal .window__taskbar"),
  opening: document.querySelector(".open-terminal"),
};

// VScode App

/*  Can't connect to the github.dev or vscode.dev 
const vscodeApp = {
  app_name: document.querySelector("#VScode"),
  window: document.querySelector(".Vscode"),
  close: document.querySelector(".close-Vscode"),
  backfull: document.querySelector(".backfull-Vscode"),
  full: document.querySelector(".full-Vscode"),
  point: document.querySelector("#point-vscode"),
  opening: document.querySelector(".open-vscode")
};
*/

// Maps App
const mapsApp = {
  app_name: document.querySelector("#map"),
  window: document.querySelector(".maps"),
  full: document.querySelector(".full-map"),
  close: document.querySelector(".close-map"),
  backfull: document.querySelector(".backfull-map"),
  point: document.querySelector("#point-maps"),
  opening: document.querySelector(".open-map"),
};

// Launchpad
const launchpad = {
  container: document.querySelector(".container__Window"),
  window: document.querySelector(".launchpad"),
  searchbox: document.querySelector(".launchpad .searchbox"),
  app_container: document.querySelector(".Apps-container"),
  point: document.querySelector("#point-launchpad"),
  opening: document.querySelector(".open-lunchpad"),
};

/********** LISTENERS **********/

/* 
Now it's not good cause when i set this, the default blur will be remove of everywhere.

function change_brightness() {
  var brightnessVal = elements.brightness_range.value;

  elements.body.style.filter = `brightness(${brightnessVal + '%'})`;
  elements.body.style.backdropFilter = `brightness(${brightnessVal + '%'})`;
}
*/

// Notes app function start
function handleAdding() {
  const create_input = document.createElement("input");
  create_input.placeholder = "Writing name";
  notesApp.notes.appendChild(create_input);
}

function handleDeleting() {
  const inputChild = document.querySelector(".content__sidebar--notes input");
  if (inputChild) inputChild.remove();
  notesApp.content_typing.style.display = "none";
}

function handleNotes() {
  notesApp.content_typing.style.display = "block";
}

// Notes app function end

function handleMinimize(windowEl) {
  windowEl.classList.toggle("minimized");
}

function handleFullScreen(windowEl) {
  windowEl.classList.toggle("maximized");
}

function close_window(close, point, appName) {
  close.style.display = "none";
  point.style.display = "none";
  appName.style.display = "none";
}

function open_window(open, point, appName) {
  elements.navbar.style.display = "flex";
  open.style.display = "block";
  launchpad.container.style.display = "flex";
  launchpad.window.style.display = "none";
  launchpad.point.style.display = "none";
  appName.style.display = "block";
  point.style.display = "block";
}

// Launchpad function start
launchpad.opening.addEventListener("click", handleOpenLaunching);

function handleOpenLaunching() {
  if (launchpad.window.style.display === "none") {
    launchpad.window.style.display = "block";
    elements.navbar.style.display = "none";
    launchpad.point.style.display = "block";
    launchpad.container.style.display = "none";  // Hide container when launchpad opens
  } else {
    launchpad.window.style.display = "none";
    elements.navbar.style.display = "flex";
    launchpad.point.style.display = "none";
    launchpad.container.style.display = "flex";  // Show container when launchpad closes (so folder windows are visible)
  }
}

function handleLaunchpadSearch(e) {
  for (let app of launchpad.app_container.children) {
    if (e.target.value) {
      app.style.display = "none";
      if (app.dataset.keywords.includes(e.target.value)) {
        app.style.display = "flex";
      }
    } else app.style.display = "flex";
  }
}
// Launchpad function end

// Calculator app start
function handleOpenCal_lunchpad() {
  calculatorApp.window.style.display = "block";
  calculatorApp.app_name.style.display = "block";
  launchpad.container.style.display = "flex";
  elements.navbar.style.display = "flex";
  launchpad.window.style.display = "none";
  calculatorApp.point.style.display = "block";
  launchpad.point.style.display = "none";
}
// Calculator app end

// Initialize container as visible so folder windows work
launchpad.container.style.display = "flex";

handleOpenLaunching();
notesApp.adding.addEventListener("click", handleAdding);

// Link yellow button minimize event listeners to their respective windows (Fixes terminal/calculator bug)
calculatorApp.backfull.addEventListener("click", () =>
  handleMinimize(calculatorApp.window)
);
terminalApp.backfull.addEventListener("click", () =>
  handleMinimize(terminalApp.window)
);
notesApp.backfull.addEventListener("click", () =>
  handleMinimize(notesApp.window)
);
terminalApp.close.addEventListener("click", () =>
  close_window(terminalApp.window, terminalApp.point, terminalApp.app_name)
);
notesApp.close.addEventListener("click", () =>
  close_window(notesApp.window, notesApp.point, notesApp.app_name)
);
mapsApp.close.addEventListener("click", () =>
  close_window(mapsApp.window, mapsApp.point, mapsApp.app_name)
);
notesApp.deleting.addEventListener("click", handleDeleting);
terminalApp.full.addEventListener("click", () =>
  handleFullScreen(terminalApp.window)
);
notesApp.full.addEventListener("click", () =>
  handleFullScreen(notesApp.window)
);
/*
vscodeApp.full.addEventListener("click", () =>
  handleFullScreen(vscodeApp.window)
);
*/
mapsApp.full.addEventListener("click", () => handleFullScreen(mapsApp.window));
notesApp.window.addEventListener("click", handleNotes);
terminalApp.opening.addEventListener("click", () =>
  open_window(terminalApp.window, terminalApp.point, terminalApp.app_name)
);
notesApp.opening.addEventListener("click", () =>
  open_window(notesApp.window, notesApp.point, notesApp.app_name)
);
calculatorApp.opening.addEventListener("click", () =>
  open_window(calculatorApp.window, calculatorApp.point, calculatorApp.app_name)
);
/*
vscodeApp.opening.addEventListener("click", () =>
  open_window(vscodeApp.window, vscodeApp.point, vscodeApp.app_name)
);
*/
mapsApp.opening.addEventListener("click", () =>
  open_window(mapsApp.window, mapsApp.point, mapsApp.app_name)
);
/*
vscodeApp.close.addEventListener("click", () =>
  close_window(vscodeApp.window, vscodeApp.point, vscodeApp.app_name)
);
vscodeApp.backfull.addEventListener("click", () =>
  handleMinimize(vscodeApp.window)
);
*/
mapsApp.backfull.addEventListener("click", () =>
  handleMinimize(mapsApp.window)
);
calculatorApp.close.addEventListener("click", () =>
  close_window(
    calculatorApp.window,
    calculatorApp.point,
    calculatorApp.app_name
  )
);
calculatorApp.opening_l.addEventListener("click", handleOpenCal_lunchpad);
launchpad.searchbox.addEventListener("input", handleLaunchpadSearch);
elements.clockWrapper.addEventListener("click", () => {
  elements.widgetsPanel.classList.toggle("open");
});

// Calculator code
// select all the buttons
const calculatorButtons = document.querySelectorAll(".standard-calc-keys button");
// select the <input type="text" class="display" disabled> element
const calculatorDisplay = document.querySelector(".display");

// add eventListener to each button
calculatorButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    calculate(event.target.value, calculatorDisplay);
    console.log("btn");
  });
});

// Calculator tab switching & project estimation logic
const tabStd = document.getElementById("calc-tab-std");
const tabEst = document.getElementById("calc-tab-est");
const calcKeys = document.querySelector(".standard-calc-keys");
const estContainer = document.querySelector(".estimator-mode-container");

if (tabStd && tabEst && calcKeys && estContainer) {
  tabStd.addEventListener("click", () => {
    tabStd.style.background = "rgba(255,255,255,0.12)";
    tabStd.style.color = "#fff";
    tabEst.style.background = "transparent";
    tabEst.style.color = "#aaa";
    calcKeys.style.display = "grid";
    estContainer.style.display = "none";
    calculatorDisplay.value = "0";
  });

  tabEst.addEventListener("click", () => {
    tabEst.style.background = "rgba(255,255,255,0.12)";
    tabEst.style.color = "#fff";
    tabStd.style.background = "transparent";
    tabStd.style.color = "#aaa";
    calcKeys.style.display = "none";
    estContainer.style.display = "flex";
    calculateEstimate();
  });

  const estVideoType = document.getElementById("est-video-type");
  const estAddons = document.querySelectorAll(".est-addon");

  const calculateEstimate = () => {
    let total = parseInt(estVideoType.value) || 0;
    estAddons.forEach(checkbox => {
      if (checkbox.checked) {
        total += parseInt(checkbox.value) || 0;
      }
    });
    calculatorDisplay.value = "$" + total;
  };

  estVideoType.addEventListener("change", calculateEstimate);
  estAddons.forEach(addon => {
    addon.addEventListener("change", calculateEstimate);
  });

  // Redirect to contact form with prefilled specifications
  const estBookBtn = document.getElementById("est-book-btn");
  if (estBookBtn) {
    estBookBtn.addEventListener("click", () => {
      const typeSelect = estVideoType.options[estVideoType.selectedIndex];
      const typeName = typeSelect.getAttribute("data-name");
      
      let addonsSelected = [];
      estAddons.forEach(checkbox => {
        if (checkbox.checked) {
          addonsSelected.push(checkbox.getAttribute("data-name"));
        }
      });

      // Close calculator window
      close_window(calculatorApp.window, calculatorApp.point, calculatorApp.app_name);
      
      // Open Booking Form window
      if (typeof contactFormApp !== "undefined") {
        contactFormApp.openInquiryWindow();
        
        setTimeout(() => {
          const formType = document.getElementById("inquiryType");
          const formBudget = document.getElementById("inquiryBudget");
          const formBrief = document.getElementById("inquiryMessage");

          if (formType) {
            if (typeName.includes("Trailer")) formType.value = "Wedding Film";
            else if (typeName.includes("Reel")) formType.value = "Social Reels";
            else if (typeName.includes("Commercial")) formType.value = "Brand Ad";
          }

          if (formBudget) {
            const totalVal = calculatorDisplay.value.replace("$", "");
            const totalNum = parseInt(totalVal);
            if (totalNum <= 3000) formBudget.value = "$1,000 - $3,000";
            else if (totalNum <= 5000) formBudget.value = "$3,000 - $5,000";
            else formBudget.value = "$5,000 - $10,000";
          }

          if (formBrief) {
            formBrief.value = `Hi Dharmik,\n\nI would like to book a ${typeName} project.\n\nSpecs selected:\n- ${addonsSelected.join('\n- ')}\n\nCalculated estimate: ${calculatorDisplay.value}`;
          }
        }, 100);
      }
    });
  }
}

function lastNumber(value) {
  return value.split(/[\+\-\*\/\%]/).pop();
}

const operators = ["+", "-", "*", "/", "%"];

function calculate(value, display) {
  const latestChar = display.value[display.value.length - 1];

  const isEmpty = display.value === "0";
  const isDecimalLastOperand = lastNumber(display.value).includes(".");
  const isNumber = /^[0-9]$/.test(value);

  if (isEmpty && isNumber) {
    return (display.value = value);
  }

  switch (value) {
    case "=":
      if (!isEmpty) display.value = eval(display.value);
      return;
    case ".":
      if (!isDecimalLastOperand) display.value += ".";
      return;
    case "C":
      return (display.value = "0");
    case "+/-":
      if (
        !operators.some((operator) =>
          display.value.replace(/^-/, "").includes(operator)
        )
      )
        display.value = -1 * parseFloat(display.value);
      return;
    case "*":
    case "/":
    case "-":
    case "+":
    case "%":
      if (operators.includes(latestChar)) {
        return (display.value = display.value.slice(0, -1) + value);
      }
    // Fall through to default case
    default:
      display.value += value;
  }
}

// App draggable (replacing jQuery UI with vanilla JS drag support)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initDraggableApps === 'function') {
    initDraggableApps();
  }
});

// Date and time
const dateElement = document.getElementById("date");
const currentDate = new Date();
dateElement.innerHTML = currentDate.toDateString();

function digi() {
  const date = new Date();
  let hour = date.getHours();
  let minute = checkTime(date.getMinutes());

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  if (hour > 12) {
    hour = hour - 12;
    if (hour === 12) {
      hour = checkTime(hour);
      elements.clockElement.innerHTML = hour + ":" + minute + " AM";
    } else {
      hour = checkTime(hour);
      elements.clockElement.innerHTML = hour + ":" + minute + " PM";
    }
  } else {
    elements.clockElement.innerHTML = hour + ":" + minute + " AM";
  }
}

// Right click to desktop
document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
  document.getElementById("contextMenu").style.opacity = "0";
}

function rightClick(e) {
  e.preventDefault();

  if (document.getElementById("contextMenu").style.opacity == "1") hideMenu();
  else {
    var menu = document.getElementById("contextMenu");

    menu.style.opacity = "1";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
  }
}

// Loading
// const load = document.getElementById("loading");
// function lockload() {
//   load.style.display = "none";
// }

/********** Start Battery **********/
const calculateBattery = () => {
  let number = Math.floor(Math.random() * 100); // If there is any error, it will be the random default battery level
  let batteryIsCharging = false; // Charging status

  navigator
    .getBattery()
    .then(function (battery) {
      number = battery.level * 100;

      batteryIsCharging = battery.charging;
      battery.addEventListener("chargingchange", function () {
        batteryIsCharging = battery.charging;
      });
    })
    .finally(() => {
      elements.batteryText.textContent = `${number}%`;
      elements.batteryProgress.style.width = `${number}%`;
      elements.batteryPopupText.textContent = `${number}%`;

      if (number <= 20) {
        elements.batteryProgress.classList.add("battery__low");
      } else if ((number > 90 && batteryIsCharging) || batteryIsCharging) {
        elements.batteryProgress.classList.add("battery__high");
        elements.batteryIsChargingLogo.classList.add("is-charging-visibel");
        elements.powerSource.textContent = "Power Adapter";
      }
    });
};

elements.batteryButton.addEventListener("click", () => {
  elements.batteryPopup.classList.toggle("opened");
  elements.batteryButton.classList.toggle("selected");
});
/********** End Battery **********/

// Call the functions
calculateBattery();
digi();
