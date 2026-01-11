/**
 * Florist Date Picker Logic (Theme-Compatible)
 * Supports:
 *  A) Old theme: #EventDate + hidden #EventDateDay/#EventDateMonth/#EventDateYear + #CalendarTrigger
 *  B) New theme: 3 <select> inputs for Delivery Date (Year/Month/Day) detected by label text
 * Loads Flatpickr if needed.
 */

/* ------------------ STYLE ------------------ */
function injectDatePickerCSS() {
  if (document.getElementById('florist-date-picker-styles')) return;

  const style = document.createElement('style');
  style.id = 'florist-date-picker-styles';
  style.textContent = `
    .date-picker-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 100%;
      margin-bottom: 10px;
    }

    #CalendarTrigger,
    .florist-calendar-trigger {
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      justify-content: flex-start;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    #CalendarTrigger:hover,
    .florist-calendar-trigger:hover {
      background-color: #f3f3f3;
      border-color: #bbb;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    #CalendarTrigger.sunday,
    .florist-calendar-trigger.sunday {
      background-color: #fff0bf7d;
      color: #444;
      border-color: #aaa;
      font-style: italic;
    }

    /* Holiday styling */
    .flatpickr-day.disabled.holiday {
      position: relative;
      background: #ffe6e6 !important;
      color: #999 !important;
      cursor: not-allowed;
    }

    /* Ensure calendar appears above theme overlays */
    .flatpickr-calendar {
      z-index: 999999 !important;
    }
  `;
  document.head.appendChild(style);
}

/* ------------------ LOAD FLATPICKR ------------------ */
function loadFlatpickrCSS() {
  if (document.querySelector('link[href*="flatpickr"]')) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

function loadFlatpickrJS() {
  if (window.flatpickr) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/* ------------------ DATE RULES ------------------ */
const CUTOFF_HOUR = 13; // 1 PM Eastern

function getEasternNow() {
  const nowUTC = new Date();
  return new Date(nowUTC.toLocaleString("en-US", { timeZone: "America/New_York" }));
}

function isSaturday(date) { return date.getDay() === 6; }
function isSunday(date) { return date.getDay() === 0; }

// Holidays
function isChristmas(date) { return date.getMonth() === 11 && date.getDate() === 25; }
function isNewYearsDay(date) { return date.getMonth() === 0 && date.getDate() === 1; }

// Thanksgiving (4th Thursday of November)
function isThanksgiving(date) {
  if (date.getMonth() !== 10) return false; // November only
  const year = date.getFullYear();
  const firstDay = new Date(year, 10, 1);
  const firstThursday = 1 + ((11 - firstDay.getDay()) % 7);
  const thanksgiving = new Date(year, 10, firstThursday + 21);
  return date.getDate() === thanksgiving.getDate() && date.getMonth() === thanksgiving.getMonth();
}

function getSundayCutoffDateTime(sundayDate) {
  const cutoff = new Date(sundayDate);
  cutoff.setDate(cutoff.getDate() - 1);
  cutoff.setHours(CUTOFF_HOUR, 0, 0, 0);
  return cutoff;
}

function getDefaultDeliveryDate() {
  const now = getEasternNow();
  const hour = now.getHours();

  if (isSunday(now)) {
    const monday = new Date(now);
    monday.setDate(now.getDate() + 1);
    return monday;
  }

  if (isSaturday(now)) {
    if (hour >= CUTOFF_HOUR) {
      const monday = new Date(now);
      monday.setDate(now.getDate() + 2);
      return monday;
    }
    return now;
  }

  const defaultDate = new Date(now);
  if (hour >= CUTOFF_HOUR) defaultDate.setDate(defaultDate.getDate() + 1);
  return defaultDate;
}

function disableDate(date) {
  const now = getEasternNow();
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  if (date < todayMidnight) return true;
  if (isChristmas(date) || isThanksgiving(date) || isNewYearsDay(date)) return true;

  if (isSunday(date)) {
    const estDate = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const estNow = getEasternNow();
    const cutoff = getSundayCutoffDateTime(estDate);
    if (estNow > cutoff) return true;
  }
  return false;
}

function formatFriendly(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

/* ------------------ THEME DETECTION ------------------ */
function detectOldThemeElements() {
  const hiddenDay = document.getElementById("EventDateDay");
  const hiddenMonth = document.getElementById("EventDateMonth");
  const hiddenYear = document.getElementById("EventDateYear");
  const triggerButton = document.getElementById("CalendarTrigger");
  const dateInput = document.getElementById("EventDate");

  if (hiddenDay && hiddenMonth && hiddenYear && triggerButton && dateInput) {
    return { mode: "old", hiddenDay, hiddenMonth, hiddenYear, triggerButton, dateInput };
  }
  return null;
}

/* REPLACED: more reliable BigCommerce date-field detection */
function findDeliveryDateSelects() {
  const dateFields = [...document.querySelectorAll('.form-field[data-product-attribute="date"]')];

  // Prefer the one labeled "Delivery Date" if multiple date fields exist
  const chosen =
    dateFields.find(f =>
      (f.querySelector("label")?.textContent || "").toLowerCase().includes("delivery date")
    ) || dateFields[0];

  if (!chosen) return null;

  const yearSelect = chosen.querySelector('select[name$="[year]"]');
  const monthSelect = chosen.querySelector('select[name$="[month]"]');
  const daySelect = chosen.querySelector('select[name$="[day]"]');

  if (!yearSelect || !monthSelect || !daySelect) return null;
  return { mode: "selects", root: chosen, yearSelect, monthSelect, daySelect };
}

function setSelectValue(select, value) {
  const str = String(value);
  const padded = str.padStart(2, "0");

  const opt = [...select.options].find(o =>
    o.value === str || o.value === padded || o.text === str || o.text === padded
  );
  if (!opt) return false;

  select.value = opt.value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

/* ADDED: retry helpers for BigCommerce select updates */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function setSelectValueWithRetry(select, value, retries = 40, delayMs = 50) {
  for (let i = 0; i < retries; i++) {
    if (setSelectValue(select, value)) return true;
    await sleep(delayMs);
  }
  return false;
}

/* ------------------ UI + UPDATE ADAPTERS ------------------ */
function ensureSelectsTrigger(selectsRoot) {
  // Create a single trigger button above the selects
  let btn = selectsRoot.querySelector(".florist-calendar-trigger");
  if (btn) return btn;

  const wrapper = document.createElement("div");
  wrapper.className = "date-picker-wrapper";

  btn = document.createElement("button");
  btn.type = "button";
  btn.className = "florist-calendar-trigger";
  btn.textContent = "📅 Choose Delivery Date";

  wrapper.appendChild(btn);
  selectsRoot.insertBefore(wrapper, selectsRoot.firstChild);

  return btn;
}

function updateTriggerLabel(triggerButton, selectedDate) {
  if (!selectedDate) {
    triggerButton.textContent = "📅 Choose Delivery Date";
    triggerButton.classList.remove("sunday");
    return;
  }

  let friendly = formatFriendly(selectedDate);

  if (isSunday(selectedDate)) {
    friendly += " (Funeral Deliveries Only)";
    triggerButton.classList.add("sunday");
  } else {
    triggerButton.classList.remove("sunday");
  }

  triggerButton.textContent = `📅 ${friendly}`;
}

/* ------------------ INIT ------------------ */
async function initializeDatePicker() {
  injectDatePickerCSS();

  // Wait for DOM
  if (document.readyState === "loading") {
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
  }

  // Detect which theme markup exists
  const old = detectOldThemeElements();
  const selects = old ? null : findDeliveryDateSelects();

  if (!old && !selects) {
    // Not found on this page (or loaded later). Log for debugging.
    console.warn("[Florist Date Picker] Could not find expected date fields on this page.");
    return;
  }

  // Load Flatpickr (may be blocked by CSP; if so, you’ll see console error)
  try {
    await loadFlatpickrCSS();
    await loadFlatpickrJS();
  } catch (e) {
    console.error("[Florist Date Picker] Failed to load Flatpickr. Possible CSP/CDN block.", e);
    return;
  }

  const defaultDate = getDefaultDeliveryDate();

  // OLD THEME MODE
  if (old) {
    const { hiddenDay, hiddenMonth, hiddenYear, triggerButton, dateInput } = old;

    function updateBigCommerceFields(selectedDate) {
      if (!selectedDate) return;

      hiddenDay.value = selectedDate.getDate();
      hiddenMonth.value = selectedDate.getMonth() + 1;
      hiddenYear.value = selectedDate.getFullYear();

      updateTriggerLabel(triggerButton, selectedDate);
    }

    const picker = flatpickr(dateInput, {
      dateFormat: "Y-m-d",
      defaultDate,
      minDate: getEasternNow(),
      allowInput: false,
      disable: [disableDate],
      onDayCreate: function(dObj, dStr, fp, dayElem) {
        const date = dayElem.dateObj;
        if (isChristmas(date) || isThanksgiving(date) || isNewYearsDay(date)) {
          dayElem.classList.add("holiday");
        }
      },
      onChange: function (selectedDates) {
        if (!selectedDates[0]) return;
        updateBigCommerceFields(selectedDates[0]);
      }
    });

    triggerButton.addEventListener("click", () => picker.open());
    updateBigCommerceFields(defaultDate);
    return;
  }

  // NEW THEME (SELECTS) MODE
  const { root, yearSelect, monthSelect, daySelect } = selects;
  const triggerButton = ensureSelectsTrigger(root);

  // Hidden input for flatpickr
  let dateInput = root.querySelector("input.florist-flatpickr-input");
  if (!dateInput) {
    dateInput = document.createElement("input");
    dateInput.type = "text";
    dateInput.className = "florist-flatpickr-input";
    dateInput.style.position = "absolute";
    dateInput.style.opacity = "0";
    dateInput.style.pointerEvents = "none";
    dateInput.style.height = "0";
    dateInput.style.width = "0";
    root.appendChild(dateInput);
  }

  /* REPLACED: sequential + retry to avoid BigCommerce timing issues */
  async function updateSelectsFromDate(selectedDate) {
    if (!selectedDate) return;

    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();

    // Set in order with pauses so BC/theme scripts can react
    await setSelectValueWithRetry(yearSelect, y);
    await sleep(50);
    await setSelectValueWithRetry(monthSelect, m);
    await sleep(75);
    await setSelectValueWithRetry(daySelect, d);

    updateTriggerLabel(triggerButton, selectedDate);
  }

  const picker = flatpickr(dateInput, {
    dateFormat: "Y-m-d",
    defaultDate,
    minDate: getEasternNow(),
    allowInput: false,
    disable: [disableDate],
    onDayCreate: function(dObj, dStr, fp, dayElem) {
      const date = dayElem.dateObj;
      if (isChristmas(date) || isThanksgiving(date) || isNewYearsDay(date)) {
        dayElem.classList.add("holiday");
      }
    },
    onChange: async function (selectedDates) {
      if (!selectedDates[0]) return;
      await updateSelectsFromDate(selectedDates[0]);
    }
  });

  triggerButton.addEventListener("click", () => picker.open());
  await updateSelectsFromDate(defaultDate);
}

initializeDatePicker();
