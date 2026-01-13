# BigCommerce Admin UI - Finding Shared Options Editor

## Method 1: Browser Console Inspector

1. **Open BigCommerce Admin**
   - Go to: https://store-jxetu2nhyu.mybigcommerce.com/manage

2. **Open Chrome DevTools**
   - Press F12 or Right-click → Inspect

3. **Open Console Tab**
   - Click "Console" tab at top

4. **Copy and paste this script:**

```javascript
// Monitor API calls to find shared options endpoint
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && (
        url.includes('/options') || 
        url.includes('/modifiers') || 
        url.includes('/shared')
    )) {
        console.log('🔍 API Call:', url);
    }
    return originalFetch.apply(this, args);
};
console.log('✅ Monitoring API calls. Navigate to Product Options now.');
```

5. **Navigate in admin UI** (while console is open):
   - Products → Product Options
   - Look for "Shared Options" section/tab
   - Click on any shared option
   - Watch console for API endpoint URLs

## Method 2: Direct Navigation

Try these URLs directly in your browser:

### Option 1: V2 Options Manager
```
https://store-jxetu2nhyu.mybigcommerce.com/manage/products/options
```

### Option 2: Store Settings Path
```
https://store-jxetu2nhyu.mybigcommerce.com/manage/settings/products/options
```

### Option 3: Products Path
```
https://store-jxetu2nhyu.mybigcommerce.com/manage/products/product-options
```

## What You're Looking For

When you find the shared options editor, look for:
- **Custom Ribbon** (should be option ID 9)
- **Full Size Card** (should be option ID 8)

For each option:
1. Click "Edit"
2. Find the "Yes" value
3. Look for fields like:
   - "Price Adjustment"
   - "Add to Price"
   - "Price Modifier"
   - Dropdown with "Fixed" / "Relative" / "Percentage"

4. Set:
   - Type: Relative (or +/-)
   - Value: 5

## What It Should Look Like

Typical BigCommerce admin option editor has:
```
Option Name: Custom Ribbon
  
  Values:
  ┌────────────────────────────────────┐
  │ Label: Yes                          │
  │ Default: [ ]                        │
  │ Price Modifier: [+/-] [$5.00]      │  ← This is what you need!
  └────────────────────────────────────┘
  
  ┌────────────────────────────────────┐
  │ Label: No                           │
  │ Default: [x]                        │
  │ Price Modifier: [None] [$0.00]     │
  └────────────────────────────────────┘
```

## If You Can't Find It

If the shared options editor doesn't exist or is hidden:
- The admin UI might not support editing shared option price adjusters
- This would explain why the API also doesn't support it
- Only solution: Use product-specific modifiers (see test script results)

## After Adding Price Adjusters

Once you add +$5 to the shared "Yes" values:
- ALL products using these shared options will automatically get the price adjusters
- Your Power Automate flow will work immediately
- No need to modify each product individually
