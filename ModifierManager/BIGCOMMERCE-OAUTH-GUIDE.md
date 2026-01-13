# BigCommerce Developer Portal Credentials Explained

## When You Create an App in Developer Portal

After clicking "Create App" and filling in the details, BigCommerce gives you:

### 1. **Client ID**
- Example: `abc123def456ghi789`
- **What it's for:** Identifies your app to BigCommerce
- **Used in:** OAuth authentication flow
- **Public:** Can be shown in frontend code

### 2. **Client Secret**
- Example: `xyz987uvw654rst321`
- **What it's for:** Secret key that proves your app is legit
- **Used in:** Backend OAuth token exchange
- **PRIVATE:** Never expose in frontend, commit to Git, or share

### 3. **Account UUID** (or App ID)
- Example: `f3d12a45-67bc-89de-0123-456789abcdef`
- **What it's for:** Unique identifier for your developer account
- **Used in:** Some API calls, app management

---

## How OAuth Works (vs Current API Token)

### Current Setup (API Token):
```
User manually enters:
├─ Store Hash: jxetu2nhyu
└─ API Token: 4nvlcr3cse4w7d4vis17u8apacl7td5
```

### OAuth Setup (Marketplace App):
```
User clicks "Install App" →
BigCommerce redirects to your app →
Your app exchanges code for token →
Token stored in your database →
User never sees credentials!
```

---

## When to Use Each Credential

### **Client ID & Secret - For OAuth Apps**
Use when:
- ✅ Building marketplace app
- ✅ Multiple stores will use your app
- ✅ Want "Install App" button experience

### **API Token - For Internal Tools**
Use when:
- ✅ Just for your own store
- ✅ Simple standalone tool
- ✅ Don't need marketplace

---

## Your Current App Status

**Right now:** Uses API tokens (simple, works great for you)

**To convert to OAuth:**
1. Create app in Developer Portal → Get Client ID/Secret
2. Deploy to Railway → Get public URL
3. Add OAuth code (I can help with this)
4. Update Developer Portal with callback URLs
5. Test installation flow
6. Submit to marketplace

---

## Do You Need to Convert?

**Keep API Token approach if:**
- Only you use it
- Want to keep it simple
- Don't need marketplace

**Convert to OAuth if:**
- Want to sell on marketplace
- Multiple stores need it
- Want professional "Install App" experience

---

## Next Steps

1. **Deploy to Railway first** (can test with API tokens initially)
2. **Create app in Developer Portal** (get Client ID/Secret)
3. **Decide:** Stay simple or add OAuth?

Let me know when you're ready for the OAuth code!
