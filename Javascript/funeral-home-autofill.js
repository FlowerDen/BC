(function () {
  // Funeral Home List (add/edit as needed)
  const FUNERAL_HOMES = [
    { label: "Adams-Green Funeral Home", company: "Adams-Green Funeral Home", address1: "721 Elden St", city: "Herndon", state: "VA", zip: "20170", phone: "7034371764" },
    { label: "Advent Funeral & Cremation Services", company: "Advent Funeral & Cremation Services", address1: "7211 U.S. 29", city: "Falls Church", state: "VA", zip: "22046", phone: "7032410088" },
    { label: "Alfirdaus Jinnaza Services", company: "Alfirdaus Jinnaza Services", address1: "10580 Main St", city: "Fairfax", state: "VA", zip: "22030", phone: "7039276917" },
    { label: "Ames Funeral Home", company: "Ames Funeral Home", address1: "8914 Quarry Rd", city: "Manassas", state: "VA", zip: "20110", phone: "7033682214" },
    { label: "Baker-Post Funeral Home & Cremation Center", company: "Baker-Post Funeral Home & Cremation Center", address1: "10001 Nokesville Rd", city: "Manassas", state: "VA", zip: "20110", phone: "7033683116" },
    { label: "Carewell Cremations", company: "Carewell Cremations", address1: "2929 Eskridge Rd", address2: "Ste N", city: "Fairfax", state: "VA", zip: "22031", phone: "5713002273" },
    { label: "Cunningham Turch Funeral Home", company: "Cunningham Turch Funeral Home", address1: "811 Cameron St", city: "Alexandria", state: "VA", zip: "22314", phone: "7035491800" },
    { label: "Demaine Funeral Home – Alexandria", company: "Demaine Funeral Home (Alexandria)", address1: "520 S Washington St", city: "Alexandria", state: "VA", zip: "22314", phone: "7035490074" },
    { label: "Demaine Funeral Home – Fairfax", company: "Demaine Funeral Home (Fairfax)", address1: "10565 Main St", city: "Fairfax", state: "VA", zip: "22030", phone: "7033851110" },
    { label: "Demaine Funeral Home – Springfield", company: "Demaine Funeral Home (Springfield)", address1: "5308 Backlick Rd", city: "Springfield", state: "VA", zip: "22151", phone: "7039419428" },
    { label: "Demaine Life Celebration Center – Sterling", company: "Demaine Funeral Home (Sterling)", address1: "45511 E Severn Way", city: "Sterling", state: "VA", zip: "20166", phone: "5716857984" },
    { label: "Everly Funeral Home & Cremation Service", company: "Everly Funeral Home & Cremation Service", address1: "6161 Leesburg Pike", city: "Falls Church", state: "VA", zip: "22044", phone: "7035325100" },
    { label: "Everly-Wheatley Funerals and Cremation", company: "Everly-Wheatley Funerals and Cremation", address1: "1500 W Braddock Rd", city: "Alexandria", state: "VA", zip: "22302", phone: "7039989200" },
    { label: "Fairfax Memorial Funeral Home", company: "Fairfax Memorial Funeral Home", address1: "9902 Braddock Rd", city: "Fairfax", state: "VA", zip: "22032", phone: "7034259702" },
    { label: "Greene Funeral Home", company: "Greene Funeral Home", address1: "814 Franklin St", city: "Alexandria", state: "VA", zip: "22314", phone: "7035490089" },
    { label: "Jefferson Funeral Chapel", company: "Jefferson Funeral Chapel", address1: "5755 Castlewellan Dr", city: "Alexandria", state: "VA", zip: "22315", phone: "7039717400" },
    { label: "Lay To Rest Cremation and Funeral Home", company: "Lay To Rest Cremation and Funeral Home", address1: "8434 Alban Rd", city: "Springfield", state: "VA", zip: "22150", phone: "7033721177" },
    { label: "Loudoun Funeral Chapel & Crematory", company: "Loudoun Funeral Chapel & Crematory", address1: "158 Catoctin Cir SE", city: "Leesburg", state: "VA", zip: "20175", phone: "7037776000" },
    { label: "Miller Funeral Home & Crematory", company: "Miller Funeral Home & Crematory", address1: "3200 Golansky Blvd", city: "Woodbridge", state: "VA", zip: "22192", phone: "7038782273" },
    { label: "Money & King Vienna Funeral Home", company: "Money & King Vienna Funeral Home", address1: "171 Maple Ave W", city: "Vienna", state: "VA", zip: "22180", phone: "7039387440" },
    { label: "Murphy Funeral Homes", company: "Murphy Funeral Homes", address1: "4510 Wilson Blvd", city: "Arlington", state: "VA", zip: "22203", phone: "7039204800" },
    { label: "National Funeral Home & Memorial Park", company: "National Funeral Home & Memorial Park", address1: "7482 Lee Hwy", city: "Falls Church", state: "VA", zip: "22042", phone: "7035604400" },
    { label: "Northern Virginia Jewish Funerals", company: "Northern Virginia Jewish Funerals", address1: "8453 Tyco Rd, Suite D", city: "Vienna", state: "VA", zip: "22182", phone: "7032812345" },
    { label: "Pierce Funeral Home", company: "Pierce Funeral Home", address1: "9609 Center St", city: "Manassas", state: "VA", zip: "20110", phone: "7032576028" }
    // ...add more funeral homes here...
  ];

  FUNERAL_HOMES.sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));

  function fillShipping(home) {
    // Helper function to find field with multiple selector attempts
    function getField(selectors) {
      for (let selector of selectors) {
        const field = document.querySelector(selector);
        if (field) {
          console.log('Found field with selector:', selector);
          return field;
        }
      }
      console.warn('Field not found. Tried selectors:', selectors);
      return null;
    }

    // Try to find all inputs and log them to help debug
    console.log('All input fields on page:');
    document.querySelectorAll('input[type="text"]').forEach((input, idx) => {
      if (input.name || input.id) {
        console.log(`Input ${idx}: name="${input.name}" id="${input.id}" placeholder="${input.placeholder}"`);
      }
    });

    const fields = {
      company: getField([
        'input[name="shippingAddress.company"]', 
        'input[name="shippingAddress[company]"]'
      ]),
      address1: getField([
        '#addressLine1Input',
        'input[name="shippingAddress.addressLine1"]', 
        'input[name="shippingAddress[addressLine1]"]',
        'input[id*="addressLine1"]'
      ]),
      address2: getField([
        '#addressLine2Input',
        'input[name="shippingAddress.addressLine2"]', 
        'input[name="shippingAddress[addressLine2]"]',
        'input[id*="addressLine2"]'
      ]),
      city: getField([
        'input[name="shippingAddress.city"]', 
        'input[name="shippingAddress[city]"]',
        'input[name="city"]'
      ]),
      state: getField([
        'select[name="shippingAddress.stateOrProvince"]', 
        'select[name="shippingAddress[stateOrProvince]"]', 
        'select[name="shippingAddress.stateOrProvinceCode"]', 
        'select[name="shippingAddress[stateOrProvinceCode]"]',
        'select[name="provinceCode"]',
        'select[id*="stateOrProvince"]'
      ]),
      zip: getField([
        'input[name="shippingAddress.postalCode"]', 
        'input[name="shippingAddress[postalCode]"]',
        'input[name="postalCode"]'
      ]),
      phone: getField([
        'input[name="shippingAddress.phone"]', 
        'input[name="shippingAddress[phone]"]',
        'input[name="phone"]'
      ])
    };

    console.log('Autofilling with:', home);
    console.log('Fields found:', Object.keys(fields).filter(k => fields[k]));

    // Autofill all fields with a slight delay to ensure rendering
    setTimeout(() => {
      // Helper to set value on React-controlled inputs
      function setFieldValue(field, value) {
        if (!field) return;
        
        // Use the native HTMLInputElement/HTMLSelectElement setter to bypass React
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 
          'value'
        )?.set;
        const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLSelectElement.prototype, 
          'value'
        )?.set;
        
        if (field.tagName === 'SELECT' && nativeSelectValueSetter) {
          nativeSelectValueSetter.call(field, value);
        } else if (nativeInputValueSetter) {
          nativeInputValueSetter.call(field, value);
        } else {
          field.value = value;
        }
        
        // Trigger events that React listens to
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.dispatchEvent(new Event('blur', { bubbles: true }));
      }

      if (fields.company) {
        console.log('Filling company:', home.company);
        setFieldValue(fields.company, home.company);
      }
      if (fields.address1) {
        console.log('Filling address1:', home.address1);
        setFieldValue(fields.address1, home.address1);
      }
      if (home.address2 && fields.address2) {
        console.log('Filling address2:', home.address2);
        setFieldValue(fields.address2, home.address2);
      }
      if (fields.city) {
        console.log('Filling city:', home.city);
        setFieldValue(fields.city, home.city);
      }
      if (fields.state) {
        console.log('Filling state:', home.state);
        setFieldValue(fields.state, home.state);
      }
      if (fields.zip) {
        console.log('Filling zip:', home.zip);
        setFieldValue(fields.zip, home.zip);
      }
      if (fields.phone) {
        console.log('Filling phone:', formatPhone(home.phone));
        setFieldValue(fields.phone, formatPhone(home.phone));
      }
    }, 100);
  }

  // Format phone as XXX-XXX-XXXX
  function formatPhone(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return phone;
  }

  function injectDropdown() {
    if (document.getElementById('funeral-home-select')) return;

    const countrySelect = document.querySelector(
      'select[name="shippingAddress.countryCode"],' +
      'select[name="shippingAddress[countryCode]"],' +
      'select[name="countryCode"],' +
      'select[id*="country"]'
    );
    if (!countrySelect) {
      console.warn('Country select not found. Tried multiple selectors.');
      return;
    }

    const stepContainer = countrySelect.closest('.checkout-step');
    const hasShippingHeading = stepContainer?.querySelector(
      'legend[data-test="shipping-address-heading"]'
    );
    if (!stepContainer || stepContainer.classList.contains('checkout-step--billing') || !hasShippingHeading) {
      console.warn('Country select is not in the shipping step.');
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '16px';

    // Question label
    const questionLabel = document.createElement('label');
    questionLabel.textContent = 'Deliver to Funeral Home? (Optional)';
    questionLabel.style.fontWeight = '600';
    questionLabel.style.display = 'block';
    questionLabel.style.marginBottom = '8px';

    // Yes/No buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginBottom = '12px';

    const yesButton = document.createElement('button');
    yesButton.type = 'button';
    yesButton.textContent = 'Yes';
    yesButton.style.padding = '8px 20px';
    yesButton.style.border = '2px solid #ccc';
    yesButton.style.borderRadius = '4px';
    yesButton.style.backgroundColor = '#fff';
    yesButton.style.cursor = 'pointer';
    yesButton.style.fontWeight = '500';

    const noButton = document.createElement('button');
    noButton.type = 'button';
    noButton.textContent = 'No';
    noButton.style.padding = '8px 20px';
    noButton.style.border = '2px solid #dc3545';
    noButton.style.borderRadius = '4px';
    noButton.style.backgroundColor = '#dc3545';
    noButton.style.color = '#fff';
    noButton.style.cursor = 'pointer';
    noButton.style.fontWeight = '500';

    // Instruction text (initially hidden)
    const instructionText = document.createElement('p');
    instructionText.textContent = 'Please enter deceased first and last name for the delivery information';
    instructionText.style.display = 'none';
    instructionText.style.color = '#0066cc';
    instructionText.style.fontStyle = 'italic';
    instructionText.style.marginBottom = '12px';
    instructionText.style.marginTop = '8px';

    // Dropdown container (initially hidden)
    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.display = 'none';

    const dropdownLabel = document.createElement('label');
    dropdownLabel.textContent = 'Select Funeral Home';
    dropdownLabel.style.fontWeight = '600';
    dropdownLabel.style.display = 'block';
    dropdownLabel.style.marginBottom = '6px';

    const select = document.createElement('select');
    select.id = 'funeral-home-select';
    select.style.width = '100%';
    select.style.padding = '10px';

    select.innerHTML =
      '<option value="">Select a funeral home</option>' +
      FUNERAL_HOMES.map((h, i) => `<option value="${i}">${h.label}</option>`).join('');

    select.addEventListener('change', function () {
      const idx = select.value;
      if (idx !== "") fillShipping(FUNERAL_HOMES[idx]);
    });

    dropdownContainer.appendChild(dropdownLabel);
    dropdownContainer.appendChild(select);

    // Button click handlers
    yesButton.addEventListener('click', function () {
      yesButton.style.backgroundColor = '#007bff';
      yesButton.style.color = '#fff';
      yesButton.style.borderColor = '#007bff';
      noButton.style.backgroundColor = '#fff';
      noButton.style.color = '#000';
      noButton.style.borderColor = '#ccc';
      instructionText.style.display = 'block';
      dropdownContainer.style.display = 'block';
    });

    noButton.addEventListener('click', function () {
      noButton.style.backgroundColor = '#dc3545';
      noButton.style.color = '#fff';
      noButton.style.borderColor = '#dc3545';
      yesButton.style.backgroundColor = '#fff';
      yesButton.style.color = '#000';
      yesButton.style.borderColor = '#ccc';
      instructionText.style.display = 'none';
      dropdownContainer.style.display = 'none';
      select.value = '';
    });

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);

    wrapper.appendChild(questionLabel);
    wrapper.appendChild(buttonContainer);
    wrapper.appendChild(instructionText);
    wrapper.appendChild(dropdownContainer);

    // Find the country label and insert before it
    const countryLabel = document.querySelector('label[for*="country"], label');
    const fieldWrapper = countrySelect.closest('[class*="form"], div') || countrySelect.parentNode;
    
    // Insert at the very top of the delivery address section, before country
    if (countryLabel && fieldWrapper.contains(countryLabel)) {
      fieldWrapper.insertBefore(wrapper, countryLabel);
    } else {
      fieldWrapper.parentNode.insertBefore(wrapper, fieldWrapper);
    }
    
    console.log('Dropdown injected successfully');
  }

  // Observe for dynamic changes in checkout
  const observer = new MutationObserver(injectDropdown);
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial injection
  injectDropdown();
})();
