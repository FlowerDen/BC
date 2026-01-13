# Test: Create Product-Specific (Non-Shared) Modifiers with Price Adjusters
# Product 196 - Testing alternative approach

$headers = @{ 
    "X-Auth-Token" = "4nvlcr3cse4w7d4vis17u8apacl7td5"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

$product_id = 196

Write-Host "=== Product-Specific Modifier Test (Product $product_id) ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Strategy: Create NEW product-specific modifiers with price adjusters" -ForegroundColor Yellow
Write-Host "This bypasses the shared modifier limitation" -ForegroundColor Gray
Write-Host ""

# Step 1: Check current modifiers
Write-Host "Step 1: Get current modifiers" -ForegroundColor Yellow
$currentMods = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers" -Method Get -Headers $headers

Write-Host "Current modifiers:" -ForegroundColor Green
foreach ($mod in $currentMods.data) {
    $sharedStatus = if ($mod.shared_option_id) { "SHARED (ID: $($mod.shared_option_id))" } else { "Product-specific" }
    Write-Host "  - $($mod.display_name) (ID: $($mod.id)) - $sharedStatus"
}

# Step 2: Create new product-specific modifier with price adjuster
Write-Host "`nStep 2: Create NEW product-specific 'Test Custom Ribbon' modifier" -ForegroundColor Yellow

$newModifierPayload = @{
    type = "checkbox"
    required = $false
    display_name = "Test Custom Ribbon (Product-Specific)"
    config = @{
        checked_by_default = $false
    }
} | ConvertTo-Json -Depth 5

Write-Host "Creating modifier..." -ForegroundColor Gray

try {
    $newMod = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers" -Method Post -Headers $headers -Body $newModifierPayload
    
    Write-Host "✅ Modifier created! ID: $($newMod.data.id)" -ForegroundColor Green
    $modifierId = $newMod.data.id
    
    Write-Host "`nStep 3: Get the auto-created modifier values" -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    
    $modValues = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$modifierId/values" -Method Get -Headers $headers
    
    Write-Host "Values created:" -ForegroundColor Green
    foreach ($val in $modValues.data) {
        Write-Host "  - $($val.label) (ID: $($val.id))"
    }
    
    # Step 4: Add price adjuster to "Yes" value
    Write-Host "`nStep 4: Add +$5 price adjuster to 'Yes' value" -ForegroundColor Yellow
    
    $yesValue = $modValues.data | Where-Object { $_.label -eq "Yes" }
    if (!$yesValue) {
        $yesValue = $modValues.data[0]  # Use first value if "Yes" not found
    }
    
    $updateValuePayload = @{
        label = $yesValue.label
        sort_order = $yesValue.sort_order
        value_data = $yesValue.value_data
        adjusters = @{
            price = @{
                adjuster = "relative"
                adjuster_value = 5
            }
        }
    } | ConvertTo-Json -Depth 5
    
    Write-Host "Updating value $($yesValue.id) with price adjuster..." -ForegroundColor Gray
    
    try {
        $updatedValue = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/modifiers/$modifierId/values/$($yesValue.id)" -Method Put -Headers $headers -Body $updateValuePayload
        
        Write-Host "✅ Price adjuster added successfully!" -ForegroundColor Green
        Write-Host "`nUpdated value:" -ForegroundColor Green
        $updatedValue.data | ConvertTo-Json -Depth 5
        
        # Step 5: Create complex rule
        Write-Host "`nStep 5: Create complex rule for this modifier" -ForegroundColor Yellow
        
        $rulePayload = @{
            enabled = $true
            stop = $false
            conditions = @(
                @{
                    modifier_id = $modifierId
                    modifier_value_id = $yesValue.id
                }
            )
            sort_order = 99
        } | ConvertTo-Json -Depth 5
        
        Write-Host "Creating rule..." -ForegroundColor Gray
        
        try {
            $rule = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/$product_id/complex-rules" -Method Post -Headers $headers -Body $rulePayload
            
            Write-Host "✅ Complex rule created successfully!" -ForegroundColor Green
            Write-Host "`nRule details:" -ForegroundColor Green
            $rule.data | ConvertTo-Json -Depth 5
            
            Write-Host "`n🎉 SUCCESS! Product-specific modifier approach WORKS!" -ForegroundColor Green
            Write-Host ""
            Write-Host "This means you CAN automate via Power Automate by:" -ForegroundColor Yellow
            Write-Host "  1. Delete shared modifiers from each product" -ForegroundColor White
            Write-Host "  2. Create new product-specific modifiers with price adjusters" -ForegroundColor White
            Write-Host "  3. Create complex rules" -ForegroundColor White
            Write-Host ""
            Write-Host "⚠️  Trade-off: Loses benefits of shared modifiers (bulk updates)" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Cleanup: Delete test modifier ID $modifierId when done testing" -ForegroundColor Gray
            
        } catch {
            Write-Host "❌ Error creating complex rule:" -ForegroundColor Red
            if ($_.ErrorDetails.Message) {
                $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5
            } else {
                Write-Host $_.Exception.Message
            }
        }
        
    } catch {
        Write-Host "❌ Error adding price adjuster:" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5
        } else {
            Write-Host $_.Exception.Message
        }
    }
    
} catch {
    Write-Host "❌ Error creating modifier:" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5
    } else {
        Write-Host $_.Exception.Message
    }
}
