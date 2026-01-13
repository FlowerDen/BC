const express = require('express');
const axios = require('axios');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'bigcommerce-modifier-manager-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Helper function to get API config from session
function getApiConfig(req) {
    return {
        storeHash: req.session.storeHash || 'jxetu2nhyu',
        accessToken: req.session.accessToken || '4nvlcr3cse4w7d4vis17u8apacl7td5'
    };
}

// Helper function to get headers
function getHeaders(req) {
    const config = getApiConfig(req);
    return {
        'X-Auth-Token': config.accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}

// Save API credentials
app.post('/api/settings', (req, res) => {
    const { storeHash, accessToken } = req.body;
    
    if (!storeHash || !accessToken) {
        return res.status(400).json({ error: 'Store hash and access token are required' });
    }
    
    req.session.storeHash = storeHash;
    req.session.accessToken = accessToken;
    
    res.json({ success: true, message: 'Settings saved successfully' });
});

// Get current settings
app.get('/api/settings', (req, res) => {
    const config = getApiConfig(req);
    res.json({
        storeHash: config.storeHash,
        hasToken: !!config.accessToken,
        tokenPreview: config.accessToken ? config.accessToken.substring(0, 8) + '...' : null
    });
});

// Get products by category
app.get('/api/products/category/:categoryId', async (req, res) => {
    try {
        const config = getApiConfig(req);
        const response = await axios.get(`https://api.bigcommerce.com/stores/${config.storeHash}/v3/catalog/products`, {
            headers: getHeaders(req),
            params: {
                'categories:in': req.params.categoryId,
                limit: 250
            }
        });
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single product
app.get('/api/products/:productId', async (req, res) => {
    try {
        const config = getApiConfig(req);
        const response = await axios.get(`https://api.bigcommerce.com/stores/${config.storeHash}/v3/catalog/products/${req.params.productId}`, {
            headers: getHeaders(req)
        });
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Apply modifier configuration to a product
app.post('/api/products/:productId/apply-modifiers', async (req, res) => {
    const productId = req.params.productId;
    const { modifierConfig } = req.body;
    const config = getApiConfig(req);
    const headers = getHeaders(req);
    const API_BASE = `https://api.bigcommerce.com/stores/${config.storeHash}/v3`;
    
    try {
        // Step 1: Get existing modifiers
        const modsResponse = await axios.get(`${API_BASE}/catalog/products/${productId}/modifiers`, {
            headers
        });
        
        const existingModifiers = modsResponse.data.data;
        const results = {
            productId,
            deleted: [],
            created: [],
            errors: []
        };
        
        // Step 2: Delete old Custom Ribbon and Full Size Card modifiers
        for (const mod of existingModifiers) {
            if (mod.display_name.includes('Custom Ribbon') && !mod.display_name.includes('Text')) {
                try {
                    await axios.delete(`${API_BASE}/catalog/products/${productId}/modifiers/${mod.id}`, {
                        headers
                    });
                    results.deleted.push(`Custom Ribbon (${mod.id})`);
                } catch (error) {
                    results.errors.push(`Failed to delete Custom Ribbon: ${error.message}`);
                }
            }
            
            if (mod.display_name.includes('Full Size Card')) {
                try {
                    await axios.delete(`${API_BASE}/catalog/products/${productId}/modifiers/${mod.id}`, {
                        headers
                    });
                    results.deleted.push(`Full Size Card (${mod.id})`);
                } catch (error) {
                    results.errors.push(`Failed to delete Full Size Card: ${error.message}`);
                }
            }
        }
        
        // Step 3: Create new modifiers with specified configuration
        for (const config of modifierConfig) {
            try {
                // Create the modifier
                const createResponse = await axios.post(
                    `${API_BASE}/catalog/products/${productId}/modifiers`,
                    {
                        type: config.type,
                        required: config.required || false,
                        display_name: config.display_name,
                        config: config.config || {}
                    },
                    { headers }
                );
                
                const modifierId = createResponse.data.data.id;
                results.created.push(`${config.display_name} (${modifierId})`);
                
                // If there's a price adjuster, apply it to the "Yes" value
                if (config.price_adjuster && config.type === 'checkbox') {
                    const valuesResponse = await axios.get(
                        `${API_BASE}/catalog/products/${productId}/modifiers/${modifierId}/values`,
                        { headers }
                    );
                    
                    const yesValue = valuesResponse.data.data.find(v => v.label === 'Yes');
                    
                    if (yesValue) {
                        await axios.put(
                            `${API_BASE}/catalog/products/${productId}/modifiers/${modifierId}/values/${yesValue.id}`,
                            {
                                adjusters: {
                                    price: {
                                        adjuster: 'relative',
                                        adjuster_value: config.price_adjuster
                                    }
                                }
                            },
                            { headers }
                        );
                        results.created[results.created.length - 1] += ` with +$${config.price_adjuster}`;
                    }
                }
                
                // Update sort order if specified
                if (config.sort_order) {
                    await axios.put(
                        `${API_BASE}/catalog/products/${productId}/modifiers/${modifierId}`,
                        { sort_order: config.sort_order },
                        { headers }
                    );
                }
                
            } catch (error) {
                results.errors.push(`Failed to create ${config.display_name}: ${error.message}`);
            }
        }
        
        res.json(results);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk apply to multiple products
app.post('/api/bulk-apply', async (req, res) => {
    const { productIds, modifierConfig } = req.body;
    const results = [];
    
    for (const productId of productIds) {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/products/${productId}/apply-modifiers`,
                { modifierConfig }
            );
            results.push(response.data);
        } catch (error) {
            results.push({
                productId,
                error: error.message
            });
        }
    }
    
    res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BigCommerce Modifier Manager running on http://localhost:${PORT}`);
});
