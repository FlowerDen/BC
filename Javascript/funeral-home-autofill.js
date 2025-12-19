(function () {
  // Funeral Home List (add/edit as needed)
  const FUNERAL_HOMES = [
    { label: "Adams-Green Funeral Home", company: "Adams-Green Funeral Home", address1: "721 Elden St", city: "Herndon", state: "VA", zip: "20170", phone: "7034371764" },
    { label: "Advent Funeral & Cremation Services", company: "Advent Funeral & Cremation Services", address1: "7211 U.S. 29", city: "Falls Church", state: "VA", zip: "22046", phone: "7032410088" },
    { label: "Alfirdaus Jinnaza Services", company: "Alfirdaus Jinnaza Services", address1: "10580 Main St", city: "Fairfax", state: "VA", zip: "22030", phone: "7039276917" },
    { label: "Ames Funeral Home", company: "Ames Funeral Home", address1: "8914 Quarry Rd", city: "Manassas", state: "VA", zip: "20110", phone: "7033682214" },
    { label: "Baker-Post Funeral Home & Cremation Center", company: "Baker-Post Funeral Home & Cremation Center", address1: "10001 Nokesville Rd", city: "Manassas", state: "VA", zip: "20110", phone: "7033683116" },
    { label: "Carewell Cremations", company: "Carewell Cremations", address1: "2929 Eskridge Rd, Ste N", city: "Fairfax", state: "VA", zip: "22031", phone: "5713002273" },
    { label: "Cunningham Turch Funeral Home", company: "Cunningham Turch Funeral Home", address1: "811 Cameron St", city: "Alexandria", state: "VA", zip: "22314", phone: "7035491800" },
    { label: "Demaine Funeral Home – Alexandria", company: "Demaine Funeral Home", address1: "520 S Washington St", city: "Alexandria", state: "VA", zip: "22314", phone: "7035490074" },
    { label: "Demaine Funeral Home – Fairfax", company: "Demaine Funeral Home", address1: "10565 Main St", city: "Fairfax", state: "VA", zip: "22030", phone: "7033851110" },
    { label: "Demaine Funeral Home – Springfield", company: "Demaine Funeral Home", address1: "5308 Backlick Rd", city: "Springfield", state: "VA", zip: "22151", phone: "7039419428" },
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
        if (field) return field;
      }
      return null;
    }

    const fields = {
      company: getField(['input[name="shippingAddress.company"]', 'input[name="shippingAddress[company]"]']),
      address1: getField(['input[name="shippingAddress.addressLine1"]', 'input[name="shippingAddress[addressLine1]"]']),
      address2: getField(['input[name="shippingAddress.addressLine2"]', 'input[name="shippingAddress[addressLine2]"]']),
      city: getField(['input[name="shippingAddress.city"]', 'input[name="shippingAddress[city]"]']),
      state: getField(['select[name="shippingAddress.stateOrProvince"]', 'select[name="shippingAddress[stateOrProvince]"]', 'select[name="shippingAddress.stateOrProvinceCode"]', 'select[name="shippingAddress[stateOrProvinceCode]"]']),
      zip: getField(['input[name="shippingAddress.postalCode"]', 'input[name="shippingAddress[postalCode]"]']),
      phone: getField(['input[name="shippingAddress.phone"]', 'input[name="shippingAddress[phone]"]'])
    };

    // Autofill all fields
    if (fields.company) fields.company.value = home.company;
    if (fields.address1) fields.address1.value = home.address1;
    if (home.address2 && fields.address2) fields.address2.value = home.address2;
    if (fields.city) fields.city.value = home.city;
    if (fields.state) fields.state.value = home.state;
    if (fields.zip) fields.zip.value = home.zip;
    if (fields.phone) fields.phone.value = formatPhone(home.phone);

    // Trigger change events to ensure BigCommerce registers the values
    Object.values(fields).forEach(field => {
      if (field) {
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
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

    const countrySelect = document.querySelector('select[name="shippingAddress.countryCode"]');
    if (!countrySelect) return;

    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '16px';

    const label = document.createElement('label');
    label.textContent = 'Deliver to Funeral Home (optional)';
    label.style.fontWeight = '600';
    label.style.display = 'block';
    label.style.marginBottom = '6px';

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

    wrapper.appendChild(label);
    wrapper.appendChild(select);

    // Insert dropdown BEFORE Country field
    const fieldWrapper = countrySelect.closest('[class*="form"], div') || countrySelect.parentNode;
    fieldWrapper.parentNode.insertBefore(wrapper, fieldWrapper);
  }

  // Observe for dynamic changes in checkout
  const observer = new MutationObserver(injectDropdown);
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial injection
  injectDropdown();
})();