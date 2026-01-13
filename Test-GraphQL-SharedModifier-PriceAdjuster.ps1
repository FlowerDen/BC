# Test BigCommerce GraphQL API for Shared Modifier Price Adjusters
# Goal: Determine if GraphQL supports adding price adjusters to shared modifier option values

$StoreHash = "jxetu2nhyu"
$Token = "4nvlcr3cse4w7d4vis17u8apacl7td5"

$Headers = @{
    "X-Auth-Token" = $Token
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

Write-Host "=== TESTING GRAPHQL API FOR SHARED MODIFIERS ===" -ForegroundColor Cyan

# First, let's query product 423 to see its shared modifier structure in GraphQL
Write-Host "`n1. Querying Product 423 (working product) via GraphQL..." -ForegroundColor Yellow

$GraphQLQuery = @"
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
            isRequired
            ... on CheckboxProductModifier {
              checkedByDefault
              fieldValue
            }
            ... on DropdownProductModifier {
              values {
                id
                label
                isDefault
              }
            }
            ... on RadioButtonsProductModifier {
              values {
                id
                label
                isDefault
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
    query = $GraphQLQuery
} | ConvertTo-Json -Depth 10

try {
    $Result = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/graphql" `
        -Method POST `
        -Headers $Headers `
        -Body $GraphQLBody
    
    Write-Host "GraphQL Query Result:" -ForegroundColor Green
    $Result | ConvertTo-Json -Depth 10
    
    # Try to find the shared modifier ID format
    $SharedMods = $Result.data.store.product.modifiers.edges | Where-Object { $_.node.isShared -eq $true }
    
    if ($SharedMods) {
        Write-Host "`n2. Found Shared Modifiers:" -ForegroundColor Green
        foreach ($mod in $SharedMods) {
            Write-Host "  - ID: $($mod.node.id)" -ForegroundColor Cyan
            Write-Host "    Name: $($mod.node.displayName)" -ForegroundColor Cyan
            Write-Host "    Is Shared: $($mod.node.isShared)" -ForegroundColor Cyan
        }
    }
    
} catch {
    Write-Host "ERROR querying GraphQL:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host "`n3. Now let's query shared modifiers directly..." -ForegroundColor Yellow

$SharedModsQuery = @"
{
  store {
    sharedProductModifiers {
      edges {
        node {
          id
          displayName
          ... on SharedCheckboxProductModifier {
            checkedByDefault
            fieldValue
          }
          ... on SharedDropdownProductModifier {
            values {
              id
              label
              isDefault
            }
          }
          ... on SharedRadioButtonsProductModifier {
            values {
              id
              label
              isDefault
            }
          }
        }
      }
    }
  }
}
"@

$SharedModsBody = @{
    query = $SharedModsQuery
} | ConvertTo-Json -Depth 10

try {
    $SharedResult = Invoke-RestMethod -Uri "https://api.bigcommerce.com/stores/$StoreHash/graphql" `
        -Method POST `
        -Headers $Headers `
        -Body $SharedModsBody
    
    Write-Host "Shared Modifiers Query Result:" -ForegroundColor Green
    $SharedResult | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "ERROR querying shared modifiers:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. Review the GraphQL response structure above" -ForegroundColor White
Write-Host "2. Look for any 'adjuster' or 'price' fields in the modifier values" -ForegroundColor White
Write-Host "3. If found, we can test a mutation to update price adjusters" -ForegroundColor White
Write-Host "4. If NOT found, GraphQL may also be limited for price adjusters" -ForegroundColor White
