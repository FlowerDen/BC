// BigCommerce Admin UI - Console Script to Find Shared Options Editor
// Open this in Chrome DevTools Console on your BigCommerce admin

console.log('=== BigCommerce Admin UI Inspector ===');
console.log('');

// Check if we're on the admin site
if (!window.location.hostname.includes('bigcommerce.com')) {
    console.error('❌ Not on BigCommerce admin site!');
    console.log('Go to: https://store-jxetu2nhyu.mybigcommerce.com/manage');
} else {
    console.log('✅ On BigCommerce admin');
}

console.log('');
console.log('=== Manual Navigation Steps ===');
console.log('1. Click "Products" in left sidebar');
console.log('2. Click "Product Options" in dropdown');
console.log('3. Look for tabs: "Product Options" and "Shared Options"');
console.log('4. Click "Shared Options" tab');
console.log('5. Find "Custom Ribbon" and "Full Size Card"');
console.log('6. Click "Edit" on each option');
console.log('7. Look for price adjuster fields on each value');
console.log('');

console.log('=== Checking for Shared Options API Routes ===');
// Try to find API endpoints used by the admin UI
if (window.fetch) {
    console.log('Monitoring fetch requests...');
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && (
            url.includes('/options') || 
            url.includes('/modifiers') || 
            url.includes('/shared')
        )) {
            console.log('🔍 API Call detected:', url);
        }
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ Fetch monitor installed. Navigate to Shared Options and watch for API calls.');
} else {
    console.log('⚠️  Fetch API not available');
}

console.log('');
console.log('=== Direct URL Attempts ===');
console.log('Try accessing these URLs directly:');
console.log('');
console.log('Option 1: V2 Options Editor');
console.log('https://store-jxetu2nhyu.mybigcommerce.com/manage/products/options');
console.log('');
console.log('Option 2: V3 Options (if it exists)');
console.log('https://store-jxetu2nhyu.mybigcommerce.com/manage/products/options/shared');
console.log('');
console.log('Option 3: Store Setup Path');
console.log('https://store-jxetu2nhyu.mybigcommerce.com/manage/settings/options');
console.log('');

console.log('=== What to Look For ===');
console.log('When editing a shared option value:');
console.log('  - "Add to Price" field');
console.log('  - "Price Modifier" field');
console.log('  - "Adjuster" dropdown');
console.log('  - "Fixed" vs "Relative" price options');
console.log('');
console.log('If you find it, set:');
console.log('  Custom Ribbon -> Yes -> Price Adjuster: +$5');
console.log('  Full Size Card -> Yes -> Price Adjuster: +$5');
