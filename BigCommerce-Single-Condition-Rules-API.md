# BigCommerce Single-Condition Complex Rules API

## Overview
This document explains how to create single-condition complex rules in BigCommerce that allow individual checkbox options to update product prices immediately, without requiring all checkboxes to be checked.

## The Problem
Complex rules with **multiple conditions** use AND logic - ALL conditions must be true for the rule to apply. This causes checkboxes to only update prices when specific combinations are selected.

## The Solution
Use **single-condition complex rules** - rules with only ONE condition that matches when a single checkbox is selected.

---

## API Endpoint

**POST** `https://api.bigcommerce.com/stores/{store_hash}/v3/catalog/products/{product_id}/complex-rules`

### Headers
```json
{
  "X-Auth-Token": "your_api_token_here",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

---

## Request Body Structure

### Single-Condition Rule (✅ Works for individual checkboxes)
```json
{
  "sort_order": 1,
  "enabled": true,
  "price_adjuster": {
    "adjuster": "relative",
    "adjuster_value": 5
  },
  "conditions": [
    {
      "modifier_id": 7164,
      "modifier_value_id": 990
    }
  ]
}
```

**Key Point:** The `conditions` array has **only ONE object** - this makes the rule match when just that one checkbox is selected.

### Multi-Condition Rule (❌ Requires ALL checkboxes)
```json
{
  "sort_order": 1,
  "enabled": true,
  "price_adjuster": {
    "adjuster": "relative",
    "adjuster_value": 5
  },
  "conditions": [
    {
      "modifier_id": 7164,
      "modifier_value_id": 990
    },
    {
      "modifier_id": 7165,
      "modifier_value_id": 1122
    }
  ]
}
```

**Problem:** The `conditions` array has **TWO objects** - BOTH must be true (Card YES AND Ribbon YES) for the rule to apply.

---

## Complete Example: Card + Ribbon Checkboxes

### Step 1: Get Modifier IDs
```powershell
$StoreHash = "jxetu2nhyu"
$Token = "your_token_here"
$ProductId = 281
$Headers = @{
    "X-Auth-Token" = $Token
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Get modifiers
$Response = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/v3/catalog/products/$ProductId/modifiers" -Method GET -Headers $Headers

# Find Card modifier (shared_option_id = 8)
$CardModifier = $Response.data | Where-Object { $_.shared_option_id -eq 8 }
Write-Host "Card Modifier ID: $($CardModifier.id)"
Write-Host "Card YES Value ID: $($CardModifier.option_values[0].id)"

# Find Ribbon modifier (shared_option_id = 9)
$RibbonModifier = $Response.data | Where-Object { $_.shared_option_id -eq 9 }
Write-Host "Ribbon Modifier ID: $($RibbonModifier.id)"
Write-Host "Ribbon YES Value ID: $($RibbonModifier.option_values[0].id)"
```

### Step 2: Create Single-Condition Rule for Card
```powershell
$CardModId = 7164  # From Step 1
$CardYesId = 990   # From Step 1

$CardRuleBody = @{
    sort_order = 1
    enabled = $true
    price_adjuster = @{
        adjuster = "relative"
        adjuster_value = 5
    }
    conditions = @(
        @{
            modifier_id = $CardModId
            modifier_value_id = $CardYesId
        }
    )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/v3/catalog/products/$ProductId/complex-rules" -Method POST -Headers $Headers -Body $CardRuleBody -ContentType "application/json"
```

### Step 3: Create Single-Condition Rule for Ribbon
```powershell
$RibbonModId = 7165  # From Step 1
$RibbonYesId = 1122  # From Step 1

$RibbonRuleBody = @{
    sort_order = 1
    enabled = $true
    price_adjuster = @{
        adjuster = "relative"
        adjuster_value = 5
    }
    conditions = @(
        @{
            modifier_id = $RibbonModId
            modifier_value_id = $RibbonYesId
        }
    )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/v3/catalog/products/$ProductId/complex-rules" -Method POST -Headers $Headers -Body $RibbonRuleBody -ContentType "application/json"
```

---

## Result
- ✅ Click **Card** checkbox alone → Price increases by $5
- ✅ Click **Ribbon** checkbox alone → Price increases by $5
- ✅ Click **both** checkboxes → Price increases by $10 (both rules apply)

---

## Working Configuration Requirements

For this to work properly, ensure:

1. **Shared modifiers have price adjusters configured:**
   - YES value: `adjuster: relative, adjuster_value: 5`
   - NO value: No price adjuster (null)

2. **Single-condition complex rules exist:**
   - One rule per checkbox option
   - Each rule has only ONE condition in the `conditions` array

3. **Sort order doesn't conflict:**
   - All rules can have the same `sort_order` (e.g., 1)
   - BigCommerce will evaluate all matching rules

---

## cURL Example

```bash
curl -X POST \
  https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/281/complex-rules \
  -H 'X-Auth-Token: your_token_here' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "sort_order": 1,
    "enabled": true,
    "price_adjuster": {
      "adjuster": "relative",
      "adjuster_value": 5
    },
    "conditions": [
      {
        "modifier_id": 7164,
        "modifier_value_id": 990
      }
    ]
  }'
```

---

## Troubleshooting

### 422 Unprocessable Entity Error
**Possible causes:**
1. Modifier ID doesn't exist on the product
2. Value ID doesn't match the modifier
3. Conflicting price adjusters (though testing shows they can coexist)

**Solution:** Verify modifier and value IDs using the GET modifiers endpoint first.

### Rules not taking effect
**Possible causes:**
1. Browser cache - Try Ctrl+F5 or incognito mode
2. Rules disabled - Check `"enabled": true` in the rule
3. Wrong modifier/value IDs

---

## References
- [BigCommerce Complex Rules API Documentation](https://developer.bigcommerce.com/docs/rest-catalog/products/complex-rules)
- [BigCommerce Modifiers API Documentation](https://developer.bigcommerce.com/docs/rest-catalog/products/modifiers)

---

## Discovery Notes
This single-condition rule approach was discovered through empirical testing by comparing:
- **Product 423** (working): Had 2 single-condition rules
- **Product 281** (not working): Had 3 multi-condition (combination) rules

BigCommerce's documentation doesn't explicitly explain that single-condition rules enable individual checkbox pricing, but testing confirmed this is the correct approach.

---

## CRITICAL: API Limitation with Shared Modifiers

### The Problem
**Shared modifiers (shared_option_id 8, 9) CANNOT have price adjusters added via BigCommerce REST API.**

#### REST API Attempts (All Failed):
```powershell
# Attempt 1: Update modifier value price adjuster
PUT /v3/catalog/products/279/modifiers/7179/values/990
ERROR 422: "Option you are trying to modify is shared. Please use related endpoints"

# Attempt 2: Access v3 shared options endpoint
GET /v3/catalog/products/options/8
ERROR 404: "No option(s) were found"

# Attempt 3: Create complex rules without price adjusters
POST /v3/catalog/products/279/complex-rules
ERROR 422: Unprocessable Entity (requires price adjusters first)
```

### Official BigCommerce Bulk Update Support

Per [BigCommerce Support: V2 to V3 Considerations](https://support.bigcommerce.com/s/article/V2-to-V3-Considerations?language=en_US):

> **"Products, variant options, and rules can be created or applied to existing products via CSV import. Individual modifier options, shared variant options, and shared modifier options can only be created in bulk by using the Catalog API."**

**Key Findings:**
- ✅ **CSV Import:** Supports products, variant options, and **rules** (complex rules?)
- ❌ **CSV Import:** Does NOT support modifier options (individual or shared)
- ⚠️ **Catalog API Required:** For bulk creation of shared modifier options
- ❓ **Unclear:** Does "rules" mean complex rules, or just V2 product rules?

**CRITICAL LIMITATION:** Complex Rules API has NO batch endpoint:
- `POST /v3/catalog/products/{product_id}/complex-rules` - Single product only
- No `/v3/catalog/products/complex-rules` batch endpoint exists

### Potential Solution Paths

#### Option 1: CSV Import (TO TEST)
BigCommerce docs say CSV supports "rules" - need to verify:
1. Export a working product (423 or 281) to CSV
2. Check if complex rules are included in CSV format
3. If yes, bulk import CSV with rules for all products
4. **STATUS:** Needs testing

#### Option 2: Power Automate Bulk Loop
Your updated flow can loop through category 52 products:
1. Get all product IDs in category 52
2. For each product: POST two complex rules (Card YES, Ribbon YES)
3. **BLOCKER:** Requires price adjusters on modifier values first
4. **STATUS:** Blocked by shared modifier API limitation

#### Option 3: GraphQL Catalog API
Test whether GraphQL supports price adjusters:
1. Query shared modifiers via GraphQL
2. Attempt mutation to add price adjusters
3. **STATUS:** Testing in progress

#### Option 4: Manual Admin UI (Last Resort)
Manual UI automatically adds price adjusters when creating rules.
**STATUS:** Not scalable for 1000s of products

### Working Products Comparison

| Product | Config Method | Rules | Result |
|---------|--------------|-------|--------|
| 423 | Manual Admin UI | 2 single-condition | ✅ Works |
| 281 | Manual Admin UI | 2 single-condition | ✅ Works |
| 279 | REST API | 0 (blocked) | ❌ Failed |

---

**Last Updated:** January 4, 2026  
**Status:** Investigating bulk update alternatives to manual admin UI process
