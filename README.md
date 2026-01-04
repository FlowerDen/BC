# BC
Scripts used on the BigCommerce site

## Script Manager Scripts

### Modern-Checkbox.js
Transforms standard checkboxes into custom toggle switches with iOS-style design.

**Features:**
- Custom toggle UI with smooth animations
- Syncs toggle state to original checkbox for form submission
- One-way sync to avoid event interference with BigCommerce/Omnisend
- Survives template changes by reconstructing UI on page load

**CDN URL:**
```
https://cdn.jsdelivr.net/gh/flowerden/BC@main/Javascript/Modern-Checkbox.js
```

**Compatibility:**
- Works silently without triggering events that interfere with BigCommerce's native price update system
- Compatible with Omnisend tracking scripts

---

### custom-ribbon-text.js
Shows/hides the "Custom Ribbon Text" field based on the "Custom Ribbon" checkbox state.

**Features:**
- Automatically hides text field when checkbox is unchecked
- Uses MutationObserver to detect checkbox changes from Modern-Checkbox.js
- Prevents infinite loops with attempt counter (max 50 attempts)
- Works on products with and without custom ribbon options

**CDN URL:**
```
https://cdn.jsdelivr.net/gh/flowerden/BC@main/Javascript/custom-ribbon-text.js
```

**How it works:**
1. Searches for "Custom Ribbon" checkbox on page load
2. Finds corresponding "Custom Ribbon Text" field
3. Watches checkbox state using MutationObserver
4. Shows/hides text field and manages required attribute

---

### funeral-home-autofill.js
Autofills funeral home information into form fields.

**CDN URL:**
```
https://cdn.jsdelivr.net/gh/flowerden/BC@main/Javascript/funeral-home-autofill.js
```

---

### Florist-Date.js
Handles date-related functionality for florist orders.

**CDN URL:**
```
https://cdn.jsdelivr.net/gh/flowerden/BC@main/Javascript/Florist-Date.js
```

---

## Deployment

### Using jsDelivr CDN
Scripts are automatically served via jsDelivr CDN from this GitHub repository.

**Standard URL format:**
```
https://cdn.jsdelivr.net/gh/flowerden/BC@main/Javascript/[filename].js
```

**Commit-specific URL (bypasses cache):**
```
https://cdn.jsdelivr.net/gh/flowerden/BC@[commit-hash]/Javascript/[filename].js
```

### Purging CDN Cache
After pushing changes to GitHub, purge the CDN cache:
```
https://purge.jsdelivr.net/gh/flowerden/BC@main/Javascript/[filename].js
```

**Note:** Purge requests may be throttled. If cache doesn't clear immediately, either:
1. Wait 10-15 minutes for propagation
2. Use commit-specific URL in Script Manager

---

## Known Issues & Solutions

### Issue: Price not updating on product page
**Cause:** Event interference between Modern-Checkbox.js and BigCommerce's native handlers

**Solution:** Modern-Checkbox.js uses one-way sync without event dispatch. Theme's product.html includes backup JavaScript (lines 109-129) that forces price updates.

### Issue: Omnisend "Cannot read properties of undefined (reading 'match')" error
**Cause:** Synthetic change events without proper event structure

**Solution:** Modern-Checkbox.js no longer dispatches synthetic events

### Issue: Custom Ribbon text field not appearing
**Cause:** MutationObserver needs to detect checkbox property changes

**Solution:** custom-ribbon-text.js uses MutationObserver with `attributes: true, attributeFilter: ['checked']`

---

## Development

### Local Testing
1. Clone repository: `git clone https://github.com/FlowerDen/BC.git`
2. Make changes to files in `Javascript/` directory
3. Commit and push changes
4. Purge CDN cache
5. Test on BigCommerce storefront

### Commit Messages Format
- `Fix: [description]` - Bug fixes
- `Feature: [description]` - New features
- `Update: [description]` - Updates to existing features

---

## License
Proprietary - FlowerDen