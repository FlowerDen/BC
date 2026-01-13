# BigCommerce Modifier Manager

A web app to manage "pseudo-shared" modifiers across multiple BigCommerce products.

## Features

✅ Apply modifier configurations to:
- Single products
- Entire categories
- Multiple products at once

✅ Manage in one place (acts like shared modifiers)

✅ Set custom sort orders

✅ Configure price adjusters

✅ Preset configurations for quick setup

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open browser to:
```
http://localhost:3000
```

## How It Works

1. **Select Products**: Choose by product ID, category, or multiple IDs
2. **Configure Modifiers**: Set display name, sort order, and price adjuster
3. **Apply**: The app will:
   - Delete old Custom Ribbon and Full Size Card modifiers
   - Create new product-specific modifiers with your configuration
   - Apply price adjusters automatically
   - Set sort orders

## Preset Configurations

**Standard Config**:
- Full Size Card (+5) - Sort Order 9
- Custom Ribbon (+5) - Sort Order 10

You can create custom configurations or save your own presets.

## API Endpoints

- `GET /api/products/:productId` - Get single product
- `GET /api/products/category/:categoryId` - Get products in category
- `POST /api/products/:productId/apply-modifiers` - Apply config to single product
- `POST /api/bulk-apply` - Apply config to multiple products

## Technical Details

This creates **product-specific modifiers** (not BigCommerce shared modifiers), but by managing them centrally through this app, they act like shared modifiers. Any changes you make are applied to all selected products.

### Why Product-Specific?

BigCommerce API doesn't allow modifying shared modifier values. This approach:
- ✅ Works around the API limitation
- ✅ Gives you full control via API
- ✅ Centrally managed through this app
- ✅ No complex rules needed (price adjusters on values work perfectly)

## Future Enhancements

- [ ] Save/load custom preset configurations
- [ ] Product search by name
- [ ] Undo last operation
- [ ] Bulk export/import configurations
- [ ] Scheduled updates
