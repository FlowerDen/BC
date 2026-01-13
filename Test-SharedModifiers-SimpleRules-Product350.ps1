# Test: Keep Shared Modifiers + Create Simple Rules (like manual admin UI)
# Product 350 - Testing if we can replicate the manual admin UI process

$headers = @{ 
    "X-Auth-Token" = "4nvlcr3cse4w7d4vis17u8apacl7td5"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

$product_id = 350

Write-Host "=== Testing Admin UI Rule Approach on Product $product_id ===" -ForegroundColor Cyan
Write-Host "Strategy: Keep shared modifiers, create simple rules" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check current modifiers
Write-Host "Step 1: Get current modifiers" -ForegroundColor Yellow
$mods = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers" -Method Get -Headers $headers

$customRibbon = $mods.data | Where-Object { $_.display_name -like "*Custom Ribbon*" }
$fullSizeCard = $mods.data | Where-Object { $_.display_name -like "*Full Size Card*" }

if ($customRibbon) {
    Write-Host "  Found: $($customRibbon.display_name) (ID: $($customRibbon.id))" -ForegroundColor Green
    
    # Get values
    $ribbonVals = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($customRibbon.id)/values" -Method Get -Headers $headers
    $ribbonYesValue = $ribbonVals.data | Where-Object { $_.label -eq "Yes" }
    Write-Host "    'Yes' value ID: $($ribbonYesValue.id)" -ForegroundColor White
} else {
    Write-Host "  ❌ Custom Ribbon modifier not found!" -ForegroundColor Red
    exit
}

if ($fullSizeCard) {
    Write-Host "  Found: $($fullSizeCard.display_name) (ID: $($fullSizeCard.id))" -ForegroundColor Green
    
    # Get values
    $cardVals = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($fullSizeCard.id)/values" -Method Get -Headers $headers
    $cardYesValue = $cardVals.data | Where-Object { $_.label -eq "Yes" }
    Write-Host "    'Yes' value ID: $($cardYesValue.id)" -ForegroundColor White
} else {
    Write-Host "  ❌ Full Size Card modifier not found!" -ForegroundColor Red
    exit
}

# Step 2: Delete existing rules (if any)
Write-Host "`nStep 2: Delete existing complex rules" -ForegroundColor Yellow
try {
    $existingRules = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/complex-rules" -Method Get -Headers $headers
    
    if ($existingRules.data.Count -gt 0) {
        foreach ($rule in $existingRules.data) {
            try {
                Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/complex-rules/$($rule.id)" -Method Delete -Headers $headers | Out-Null
                Write-Host "  ✅ Deleted rule $($rule.id)" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠️ Could not delete rule $($rule.id)" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "  No existing rules to delete" -ForegroundColor Gray
    }
} catch {
    Write-Host "  No existing rules" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# Step 3: Create simple rule for Custom Ribbon (like admin UI)
Write-Host "`nStep 3: Create rule - Custom Ribbon = Yes → Add $5" -ForegroundColor Yellow

$ribbonRulePayload = @{
    enabled = $true
    stop = $false
    price_adjuster = @{
        adjuster = "relative"
        adjuster_value = 5
    }
    conditions = @(
        @{
            modifier_id = $customRibbon.id
            modifier_value_id = $ribbonYesValue.id
        }
    )
    sort_order = 1
} | ConvertTo-Json -Depth 5

try {
    $ribbonRule = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/complex-rules" -Method Post -Headers $headers -Body $ribbonRulePayload
    Write-Host "  ✅ Created Custom Ribbon rule (ID: $($ribbonRule.data.id))" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error creating Custom Ribbon rule:" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { 
        $error = $_.ErrorDetails.Message | ConvertFrom-Json
        $error | ConvertTo-Json -Depth 3
    }
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Step 4: Create simple rule for Full Size Card (like admin UI)
Write-Host "`nStep 4: Create rule - Full Size Card = Yes → Add $5" -ForegroundColor Yellow

$cardRulePayload = @{
    enabled = $true
    stop = $false
    price_adjuster = @{
        adjuster = "relative"
        adjuster_value = 5
    }
    conditions = @(
        @{
            modifier_id = $fullSizeCard.id
            modifier_value_id = $cardYesValue.id
        }
    )
    sort_order = 2
} | ConvertTo-Json -Depth 5

try {
    $cardRule = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/complex-rules" -Method Post -Headers $headers -Body $cardRulePayload
    Write-Host "  ✅ Created Full Size Card rule (ID: $($cardRule.data.id))" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error creating Full Size Card rule:" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { 
        $error = $_.ErrorDetails.Message | ConvertFrom-Json
        $error | ConvertTo-Json -Depth 3
    }
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Results ===" -ForegroundColor Cyan
Write-Host "If both rules created successfully:" -ForegroundColor Yellow
Write-Host "  ✅ This approach works!" -ForegroundColor Green
Write-Host "  ✅ Keep shared modifiers" -ForegroundColor Green
Write-Host "  ✅ Just create simple rules via API" -ForegroundColor Green
Write-Host "  ✅ Much simpler than deleting/recreating modifiers!" -ForegroundColor Green
Write-Host ""
Write-Host "Test on storefront to confirm individual checkboxes work!" -ForegroundColor Yellow
