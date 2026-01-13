# Test: Can we modify price adjusters on shared modifier values?
# Product 196 - Testing delete/re-add approach

$headers = @{ 
    "X-Auth-Token" = "4nvlcr3cse4w7d4vis17u8apacl7td5"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "=== Product 196: Testing Price Adjuster Modification ===" -ForegroundColor Cyan
Write-Host ""

# Get current state
Write-Host "Step 1: Get current Full Size Card modifier values" -ForegroundColor Yellow
$currentValues = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/196/modifiers/6837/values" -Method Get -Headers $headers

Write-Host "Current 'Yes' value (ID 990):" -ForegroundColor Green
$yesValue = $currentValues.data | Where-Object { $_.label -eq "Yes" }
$yesValue | ConvertTo-Json -Depth 5

Write-Host "`n=== Test 1: Remove price adjuster (set to null) ===" -ForegroundColor Yellow
$removePayload = @{
    label = "Yes"
    sort_order = 0
    value_data = @{
        checked_value = $true
    }
    adjusters = @{
        price = $null
    }
} | ConvertTo-Json -Depth 5

Write-Host "Payload:" -ForegroundColor Gray
Write-Host $removePayload

try {
    $removeResponse = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/196/modifiers/6837/values/990" -Method Put -Headers $headers -Body $removePayload
    
    Write-Host "`n✅ SUCCESS! Price adjuster removed:" -ForegroundColor Green
    $removeResponse.data | ConvertTo-Json -Depth 5
    
    Write-Host "`n=== Test 2: Re-add price adjuster ===" -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    
    $addPayload = @{
        label = "Yes"
        sort_order = 0
        value_data = @{
            checked_value = $true
        }
        adjusters = @{
            price = @{
                adjuster = "relative"
                adjuster_value = 5
            }
        }
    } | ConvertTo-Json -Depth 5
    
    try {
        $addResponse = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/jxetu2nhyu/v3/catalog/products/196/modifiers/6837/values/990" -Method Put -Headers $headers -Body $addPayload
        
        Write-Host "✅ SUCCESS! Price adjuster re-added:" -ForegroundColor Green
        $addResponse.data | ConvertTo-Json -Depth 5
        
        Write-Host "`n🎉 BREAKTHROUGH! Your delete/re-add approach WORKS!" -ForegroundColor Green
        Write-Host "This means you can:" -ForegroundColor Yellow
        Write-Host "  1. Get all products in category 52" -ForegroundColor White
        Write-Host "  2. For each product:" -ForegroundColor White
        Write-Host "     a. Remove price adjuster from shared modifier values" -ForegroundColor White
        Write-Host "     b. Re-add price adjuster" -ForegroundColor White
        Write-Host "     c. Create complex rules" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Error re-adding price adjuster:" -ForegroundColor Red
        Write-Host $_.Exception.Message
        if ($_.ErrorDetails.Message) {
            $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5
        }
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "`n❌ ERROR $statusCode - Cannot modify shared modifier value" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorDetail = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "`nError Details:" -ForegroundColor Red
        $errorDetail | ConvertTo-Json -Depth 5
        
        if ($errorDetail.detail -like "*shared*" -or $errorDetail.title -like "*shared*") {
            Write-Host "`n⚠️  CONFIRMED: BigCommerce blocks modifications to shared modifier values" -ForegroundColor Red
            Write-Host "Your delete/re-add approach will NOT work via API" -ForegroundColor Red
            Write-Host ""
            Write-Host "Only solution: Manually update shared options in admin UI once" -ForegroundColor Yellow
            Write-Host "  Store Setup → Product Options → Custom Ribbon → Edit 'Yes' value → Add +$5 adjuster" -ForegroundColor Gray
        }
    } else {
        Write-Host "No detailed error message available" -ForegroundColor Gray
    }
}
