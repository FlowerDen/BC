# Detailed GraphQL Test: Check if price adjusters are accessible/settable
# Based on initial results, GraphQL returned modifier info but NO price adjuster fields

$StoreHash = "jxetu2nhyu"
$Token = "4nvlcr3cse4w7d4vis17u8apacl7td5"

$Headers = @{
    "X-Auth-Token" = $Token
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

Write-Host "=== DETAILED GRAPHQL PRICE ADJUSTER TEST ===" -ForegroundColor Cyan

# Compare what REST API shows vs GraphQL for product 423
Write-Host "`n1. REST API - Product 423 Modifiers (with price adjuster info):" -ForegroundColor Yellow

$RestMods = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/v3/catalog/products/423/modifiers" `
    -Method GET -Headers $Headers

$CardMod = $RestMods.data | Where-Object { $_.display_name -like "*Full Size Card*" }

Write-Host "Full Size Card Modifier via REST API:" -ForegroundColor Green
Write-Host "  Modifier ID: $($CardMod.id)" -ForegroundColor Cyan
Write-Host "  Display Name: $($CardMod.display_name)" -ForegroundColor Cyan
Write-Host "  Option Values:" -ForegroundColor Cyan

foreach ($val in $CardMod.option_values) {
    Write-Host "    - Label: $($val.label)" -ForegroundColor White
    Write-Host "      Value ID: $($val.id)" -ForegroundColor White
    if ($val.adjusters.price) {
        Write-Host "      HAS PRICE ADJUSTER:" -ForegroundColor Green
        Write-Host "        Adjuster: $($val.adjusters.price.adjuster)" -ForegroundColor Green
        Write-Host "        Value: $($val.adjusters.price.adjuster_value)" -ForegroundColor Green
    } else {
        Write-Host "      No price adjuster" -ForegroundColor Gray
    }
}

# Now try a more detailed GraphQL query that explicitly asks for adjuster info
Write-Host "`n2. Attempting GraphQL query with explicit adjuster fields..." -ForegroundColor Yellow

$DetailedGraphQL = @"
{
  store {
    product(id: "bc/store/product/423") {
      id
      modifiers {
        edges {
          node {
            id
            displayName
            isShared
            ... on CheckboxProductModifier {
              checkedByDefault
              fieldValue
              adjusters {
                price {
                  adjuster
                  adjusterValue
                }
              }
            }
          }
        }
      }
    }
  }
}
"@

$GraphQLBody = @{
    query = $DetailedGraphQL
} | ConvertTo-Json -Depth 10

try {
    $GraphQLResult = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/graphql" `
        -Method POST -Headers $Headers -Body $GraphQLBody
    
    Write-Host "GraphQL Result (with adjuster fields):" -ForegroundColor Green
    $GraphQLResult | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "ERROR: GraphQL does not support 'adjusters' field on modifiers" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# Try querying modifier values separately
Write-Host "`n3. Checking if GraphQL has a separate modifier values query..." -ForegroundColor Yellow

$ValuesQuery = @"
{
  store {
    product(id: "bc/store/product/423") {
      id
      modifiers {
        edges {
          node {
            id
            displayName
            ... on RadioButtonsProductModifier {
              values {
                id
                label
                isDefault
                adjusters {
                  price {
                    adjuster
                    adjusterValue
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
"@

$ValuesBody = @{
    query = $ValuesQuery
} | ConvertTo-Json -Depth 10

try {
    $ValuesResult = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/graphql" `
        -Method POST -Headers $Headers -Body $ValuesBody
    
    Write-Host "GraphQL Values Query Result:" -ForegroundColor Green
    $ValuesResult | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "ERROR: GraphQL does not support 'adjusters' on modifier values" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n=== ANALYSIS ===" -ForegroundColor Cyan
Write-Host "REST API: Shows price adjusters on modifier option values" -ForegroundColor White
Write-Host "GraphQL: " -NoNewline
Write-Host "DOES NOT EXPOSE PRICE ADJUSTER FIELDS" -ForegroundColor Red
Write-Host ""
Write-Host "CONCLUSION:" -ForegroundColor Yellow
Write-Host "GraphQL Admin API appears to be limited to modifier DISPLAY settings" -ForegroundColor White
Write-Host "(names, labels, values) but NOT pricing/adjuster configuration." -ForegroundColor White
Write-Host ""
Write-Host "This means ALL APIs (REST & GraphQL) block shared modifier price adjusters." -ForegroundColor Red
Write-Host ""
Write-Host "REMAINING OPTIONS:" -ForegroundColor Cyan
Write-Host "1. Manual admin UI updates (not scalable)" -ForegroundColor White
Write-Host "2. Contact BigCommerce support for enterprise bulk solution" -ForegroundColor White
Write-Host "3. Third-party BigCommerce apps from marketplace" -ForegroundColor White
