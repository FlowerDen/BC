# Test updating shared modifier value with price adjuster
# Testing if we can add price adjusters to shared modifier values via PUT

$store_hash = "jxetu2nhyu"
$token = "4nvlcr3cse4w7d4vis17u8apacl7td5"
$product_id = 279
$modifier_id = 7180  # Custom Ribbon modifier
$value_id = 10      # YES value

$headers = @{
    "X-Auth-Token" = $token
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "=== Test 1: Get Current Modifier Value ===" -ForegroundColor Cyan
$getUrl = "https://api.bigcommerce.com/stores/$store_hash/v3/catalog/products/$product_id/modifiers/$modifier_id/values/$value_id"
try {
    $currentValue = Invoke-RestMethod -Uri $getUrl -Method Get -Headers $headers
    Write-Host "Current value:" -ForegroundColor Green
    $currentValue.data | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error getting value: $_" -ForegroundColor Red
    $_.Exception.Response | ConvertTo-Json
    exit
}

Write-Host "`n=== Test 2: Attempt to Add Price Adjuster ===" -ForegroundColor Cyan

# Try to add price adjuster to the value
$updatePayload = @{
    label = "Yes"
    adjusters = @{
        price = @{
            adjuster = "relative"
            adjuster_value = 5
        }
    }
} | ConvertTo-Json -Depth 5

Write-Host "Payload:" -ForegroundColor Yellow
Write-Host $updatePayload

$putUrl = "https://api.bigcommerce.com/stores/$store_hash/v3/catalog/products/$product_id/modifiers/$modifier_id/values/$value_id"

try {
    $response = Invoke-RestMethod -Uri $putUrl -Method Put -Headers $headers -Body $updatePayload
    Write-Host "`nSUCCESS! Price adjuster added:" -ForegroundColor Green
    $response.data | ConvertTo-Json -Depth 5
    
    Write-Host "`n✅ BREAKTHROUGH: We can add price adjusters to shared modifiers!" -ForegroundColor Green
    Write-Host "This means your Power Automate flow CAN work!" -ForegroundColor Green
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
    
    Write-Host "`nERROR $statusCode - Request failed:" -ForegroundColor Red
    $errorBody | ConvertTo-Json -Depth 5
    
    if ($errorBody.title -like "*shared*") {
        Write-Host "`n❌ CONFIRMED: Cannot modify shared options via product modifier endpoint" -ForegroundColor Red
        Write-Host "Need to find shared options endpoint or use manual admin UI" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Test 3: Check if product-specific modifiers would work ===" -ForegroundColor Cyan
Write-Host "For comparison, products 281 and 423 have product-specific modifiers" -ForegroundColor Gray
Write-Host "They were likely created BY HAND in admin UI with price adjusters already set" -ForegroundColor Gray
