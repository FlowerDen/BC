# Apply Complete Solution to Product 196
# Delete shared Custom Ribbon and Full Size Card
# Create product-specific versions with price adjusters

$headers = @{ 
    "X-Auth-Token" = "4nvlcr3cse4w7d4vis17u8apacl7td5"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

$product_id = 196

Write-Host "=== Applying Complete Solution to Product $product_id ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get current modifiers
Write-Host "Step 1: Current modifiers" -ForegroundColor Yellow
$mods = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers" -Method Get -Headers $headers

$customRibbonShared = $mods.data | Where-Object { $_.display_name -eq "Custom Ribbon (+5)" }
$fullSizeCardShared = $mods.data | Where-Object { $_.display_name -eq "Full Size Card (+5)" }
$testMod = $mods.data | Where-Object { $_.display_name -like "*Test*" }

Write-Host "  Custom Ribbon (+5) - ID: $($customRibbonShared.id) (will delete)" -ForegroundColor Red
Write-Host "  Full Size Card (+5) - ID: $($fullSizeCardShared.id) (will delete)" -ForegroundColor Red
Write-Host "  Test Custom Ribbon - ID: $($testMod.id) (will delete)" -ForegroundColor Red

# Step 2: Delete shared modifiers
Write-Host "`nStep 2: Deleting shared and test modifiers..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($customRibbonShared.id)" -Method Delete -Headers $headers | Out-Null
    Write-Host "  ✅ Deleted Custom Ribbon (+5)" -ForegroundColor Green
} catch { Write-Host "  ❌ Error deleting Custom Ribbon: $($_.Exception.Message)" -ForegroundColor Red }

try {
    Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($fullSizeCardShared.id)" -Method Delete -Headers $headers | Out-Null
    Write-Host "  ✅ Deleted Full Size Card (+5)" -ForegroundColor Green
} catch { Write-Host "  ❌ Error deleting Full Size Card: $($_.Exception.Message)" -ForegroundColor Red }

try {
    Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($testMod.id)" -Method Delete -Headers $headers | Out-Null
    Write-Host "  ✅ Deleted Test Custom Ribbon" -ForegroundColor Green
} catch { Write-Host "  ❌ Error deleting Test modifier: $($_.Exception.Message)" -ForegroundColor Red }

Start-Sleep -Seconds 1

# Step 3: Create product-specific Custom Ribbon
Write-Host "`nStep 3: Creating product-specific 'Custom Ribbon' modifier..." -ForegroundColor Yellow

$customRibbonPayload = @{
    type = "checkbox"
    required = $false
    display_name = "Custom Ribbon"
    config = @{
        checked_by_default = $false
    }
} | ConvertTo-Json -Depth 5

try {
    $newRibbon = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers" -Method Post -Headers $headers -Body $customRibbonPayload
    Write-Host "  ✅ Created Custom Ribbon modifier (ID: $($newRibbon.data.id))" -ForegroundColor Green
    
    Start-Sleep -Seconds 1
    
    # Get values
    $ribbonValues = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($newRibbon.data.id)/values" -Method Get -Headers $headers
    $yesValue = $ribbonValues.data | Where-Object { $_.label -eq "Yes" }
    
    # Add price adjuster to Yes value
    $updatePayload = @{
        label = "Yes"
        sort_order = $yesValue.sort_order
        value_data = $yesValue.value_data
        adjusters = @{
            price = @{
                adjuster = "relative"
                adjuster_value = 5
            }
        }
    } | ConvertTo-Json -Depth 5
    
    $updated = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($newRibbon.data.id)/values/$($yesValue.id)" -Method Put -Headers $headers -Body $updatePayload
    Write-Host "  ✅ Added +$5 price adjuster to 'Yes' value" -ForegroundColor Green
    
} catch {
    Write-Host "  ❌ Error creating Custom Ribbon: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
}

Start-Sleep -Seconds 1

# Step 4: Create product-specific Full Size Card
Write-Host "`nStep 4: Creating product-specific 'Full Size Card' modifier..." -ForegroundColor Yellow

$fullSizeCardPayload = @{
    type = "checkbox"
    required = $false
    display_name = "Full Size Card"
    config = @{
        checked_by_default = $false
    }
} | ConvertTo-Json -Depth 5

try {
    $newCard = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers" -Method Post -Headers $headers -Body $fullSizeCardPayload
    Write-Host "  ✅ Created Full Size Card modifier (ID: $($newCard.data.id))" -ForegroundColor Green
    
    Start-Sleep -Seconds 1
    
    # Get values
    $cardValues = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($newCard.data.id)/values" -Method Get -Headers $headers
    $yesValue = $cardValues.data | Where-Object { $_.label -eq "Yes" }
    
    # Add price adjuster to Yes value
    $updatePayload = @{
        label = "Yes"
        sort_order = $yesValue.sort_order
        value_data = $yesValue.value_data
        adjusters = @{
            price = @{
                adjuster = "relative"
                adjuster_value = 5
            }
        }
    } | ConvertTo-Json -Depth 5
    
    $updated = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$($newCard.data.id)/values/$($yesValue.id)" -Method Put -Headers $headers -Body $updatePayload
    Write-Host "  ✅ Added +$5 price adjuster to 'Yes' value" -ForegroundColor Green
    
} catch {
    Write-Host "  ❌ Error creating Full Size Card: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message }
}

# Step 5: Verify final configuration
Write-Host "`n=== Final Configuration ===" -ForegroundColor Cyan
$finalMods = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers" -Method Get -Headers $headers

Write-Host "Product $product_id now has $($finalMods.data.Count) modifiers:" -ForegroundColor Green
foreach ($mod in $finalMods.data) {
    $sharedStatus = if ($mod.shared_option_id) { "SHARED" } else { "Product-Specific" }
    Write-Host "  - $($mod.display_name) ($sharedStatus)" -ForegroundColor White
}

Write-Host "`n🎉 COMPLETE! Test on storefront:" -ForegroundColor Green
Write-Host "  1. Check ONLY Custom Ribbon → Should add +$5" -ForegroundColor Yellow
Write-Host "  2. Check ONLY Full Size Card → Should add +$5" -ForegroundColor Yellow
Write-Host "  3. Check BOTH → Should add +$10" -ForegroundColor Yellow
Write-Host "  4. Custom Ribbon should reveal text field" -ForegroundColor Yellow
