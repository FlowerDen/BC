/**
 * Checkbox Toggle Handler
 * Transforms standard checkboxes into custom toggle switches
 * Survives template changes by reconstructing UI on page load
 */

// Inject checkbox toggle styling
function injectCheckboxCSS() {
  if (document.getElementById('checkbox-toggle-styles')) {
    return; // Already injected
  }

  const style = document.createElement('style');
  style.id = 'checkbox-toggle-styles';
  style.textContent = `
    .fd-toggle {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      user-select: none;
    }

    .fd-toggle input[type="checkbox"] {
      display: none;
    }

    .fd-toggle-slider {
      display: inline-block;
      width: 44px;
      height: 24px;
      background-color: #ccc;
      border-radius: 12px;
      position: relative;
      transition: background-color 0.3s ease;
      box-sizing: border-box;
    }

    .fd-toggle-slider::before {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: white;
      top: 3px !important;
      left: 3px !important;
      transition: left 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .fd-toggle input[type="checkbox"]:checked ~ .fd-toggle-slider {
      background-color: #4caf50;
    }

    .fd-toggle input[type="checkbox"]:checked ~ .fd-toggle-slider::before {
      left: 23px !important;
    }

    .fd-toggle-text {
      font-size: 14px;
      color: #333;
    }

    .fd-toggle input[type="checkbox"]:disabled ~ .fd-toggle-slider {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
}

// Initialize checkbox toggles after DOM is ready
async function initializeCheckboxes() {
  // Inject custom CSS
  injectCheckboxCSS();

  // Wait for DOM to be ready if needed
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }

  // Find all form fields with checkboxes
  document.querySelectorAll('.form-field').forEach((field, index) => {
    const checkbox = field.querySelector('input[type="checkbox"]');
    
    if (!checkbox || field.querySelector('.fd-toggle')) {
      return; // Not a checkbox field or already transformed
    }

    // Create unique IDs if not present
    if (!checkbox.id) {
      checkbox.id = `checkbox-${index}`;
    }

    const toggleId = `fd-toggle-${index}`;

    // Get the label text from form-label if available
    const labelElement = field.querySelector('.form-label');
    let labelText = '';
    
    if (labelElement) {
      // Clone and clean the label text (remove required small tag)
      const clone = labelElement.cloneNode(true);
      const smallTag = clone.querySelector('small');
      if (smallTag) smallTag.remove();
      labelText = clone.textContent.trim().replace(/:/g, '');
    }

    // Create the toggle wrapper
    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'fd-toggle';
    toggleLabel.setAttribute('for', toggleId);
    toggleLabel.innerHTML = `
      <input
        type="checkbox"
        class="fd-toggle-checkbox"
        id="${toggleId}"
        ${checkbox.checked ? 'checked' : ''}
        ${checkbox.disabled ? 'disabled' : ''}
      >
      <span class="fd-toggle-slider" aria-hidden="true"></span>
      ${labelText ? `<span class="fd-toggle-text">${labelText}</span>` : ''}
    `;

    // Insert toggle after the original checkbox
    checkbox.parentNode.insertBefore(toggleLabel, checkbox.nextSibling);

    // Hide the original checkbox
    checkbox.style.display = 'none';

    // Get references to both checkboxes
    const toggleCheckbox = toggleLabel.querySelector('.fd-toggle-checkbox');

    // Sync and trigger change on original checkbox
    // Let theme's backup code (product.html) handle the dispatch to option-change div
    toggleCheckbox.addEventListener('change', () => {
      checkbox.checked = toggleCheckbox.checked;
      
      // Fire change event on ORIGINAL checkbox (has proper name attribute)
      // Theme's product.html backup code will catch this and dispatch to BigCommerce
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
}

// Start initialization
initializeCheckboxes();
