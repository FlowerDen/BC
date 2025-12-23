/**
 * Florist Date Picker Logic
 * Handles delivery date blocking for holidays, Sundays, and time cutoffs
 * Automatically loads Flatpickr library if not already present
 */

// Load Flatpickr CSS if not already loaded
function loadFlatpickrCSS() {
  if (document.querySelector('link[href*="flatpickr"]')) {
    return Promise.resolve(); // Already loaded
  }
  
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

// Load Flatpickr JS if not already loaded
function loadFlatpickrJS() {
  if (window.flatpickr) {
    return Promise.resolve(); // Already loaded
  }
  
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

// Initialize date picker after Flatpickr is loaded
async function initializeDatePicker() {
  // Load dependencies
  await loadFlatpickrCSS();
  await loadFlatpickrJS();

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }

  // Now initialize the date picker logic

  const hiddenDay = document.getElementById("EventDateDay");
  const hiddenMonth = document.getElementById("EventDateMonth");
  const hiddenYear = document.getElementById("EventDateYear");
  const triggerButton = document.getElementById("CalendarTrigger");
  const dateInput = document.getElementById("EventDate");
  const hiddenMonth = document.getElementById("EventDateMonth");
  const hiddenYear = document.getElementById("EventDateYear");
  const triggerButton = document.getElementById("CalendarTrigger");
  const dateInput = document.getElementById("EventDate");

  // Check if elements exist before proceeding
  if (!hiddenDay || !hiddenMonth || !hiddenYear || !triggerButton || !dateInput) {
    return;
  }

  const CUTOFF_HOUR = 13; // 1 PM Eastern

  function getEasternNow() {
    const nowUTC = new Date();
    return new Date(nowUTC.toLocaleString("en-US", { timeZone: "America/New_York" }));
  }

  function isSaturday(date) { return date.getDay() === 6; }
  function isSunday(date) { return date.getDay() === 0; }

  /* ---- HOLIDAYS ---- */

  // Christmas
  function isChristmas(date) {
    return date.getMonth() === 11 && date.getDate() === 25;
  }

  // New Year's Day
  function isNewYearsDay(date) {
    return date.getMonth() === 0 && date.getDate() === 1;
  }

  // Thanksgiving (4th Thursday of November)
  function isThanksgiving(date) {
    // Thanksgiving = 4th Thursday of November
    if (date.getMonth() !== 10) return false; // November only

    const year = date.getFullYear();

    // Find the first day of November
    const firstDay = new Date(year, 10, 1);
    
    // Find the first Thursday in November
    const firstThursday = 1 + ((11 - firstDay.getDay()) % 7);

    // Calculate Thanksgiving: 4th Thursday = firstThursday + 21 days
    const thanksgiving = new Date(year, 10, firstThursday + 21);

    return (
      date.getDate() === thanksgiving.getDate() &&
      date.getMonth() === thanksgiving.getMonth()
    );
  }

  // Compute Saturday cutoff for a specific Sunday
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
    if (hour >= CUTOFF_HOUR) {
      defaultDate.setDate(defaultDate.getDate() + 1);
    }
    return defaultDate;
  }

  /* ---- DISABLE LOGIC ---- */
  function disableDate(date) {
    const now = getEasternNow();

    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    // Block past days
    if (date < todayMidnight) return true;

    // Block holidays
    if (isChristmas(date) || isThanksgiving(date) || isNewYearsDay(date)) return true;

    // Block a specific Sunday if its cutoff has passed
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

  function updateBigCommerceFields(selectedDate) {
    if (!selectedDate) {
      triggerButton.textContent = "📅 Choose Delivery Date";
      triggerButton.classList.remove("sunday");
      return;
    }

    hiddenDay.value = selectedDate.getDate();
    hiddenMonth.value = selectedDate.getMonth() + 1;
    hiddenYear.value = selectedDate.getFullYear();

    let friendly = formatFriendly(selectedDate);

    if (isSunday(selectedDate)) {
      friendly += " (Funeral Deliveries Only)";
      triggerButton.classList.add("sunday");
    } else {
      triggerButton.classList.remove("sunday");
    }

    triggerButton.textContent = `📅 ${friendly}`;
  }

  const defaultDate = getDefaultDeliveryDate();

  const picker = flatpickr(dateInput, {
    dateFormat: "Y-m-d",
    defaultDate: defaultDate,
    minDate: getEasternNow(),
    allowInput: false,
    appendTo: document.body,
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
}

// Start initialization
initializeDatePicker();
