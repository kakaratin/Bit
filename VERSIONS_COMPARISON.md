# 📊 Tdjs-AutoReg - Version Comparison

## Overview

Tdjs-AutoReg comes in **two powerful versions**:
- **V1**: Browser Extension (Chrome, Edge, Brave, Firefox)
- **V2**: Tampermonkey Userscript (Universal)

---

## 🆚 Feature Comparison

| Feature | V1 Extension | V2 Tampermonkey |
|---------|--------------|-----------------|
| **Installation** | Load unpacked extension | Install userscript |
| **Platform** | Browser extension | Userscript (any browser) |
| **UI Type** | Popup + On-page button | Floating draggable menu |
| **Email Creation** | ✅ Yes | ✅ Yes |
| **Form Auto-fill** | ✅ Yes | ✅ Yes |
| **Verification Auto-fill** | ✅ Yes | ✅ Yes |
| **Inbox Monitoring** | ✅ Every 10s | ✅ Every 10s |
| **Code Patterns** | ✅ 7+ types | ✅ 7+ types |
| **On-page Notifications** | ✅ Yes | ✅ Yes |
| **Copy Credentials** | ✅ Yes | ✅ Yes |
| | | |
| **🎁 Referral System** | ❌ No | ✅ **NEW!** |
| **Add Referral Links** | ❌ No | ✅ **NEW!** |
| **Track 3 per link** | ❌ No | ✅ **NEW!** |
| **Multiple Referrals** | ❌ No | ✅ **NEW!** |
| **Referral Statistics** | ❌ No | ✅ **NEW!** |
| **Draggable UI** | ❌ No | ✅ **NEW!** |
| **Minimizable Menu** | ❌ No | ✅ **NEW!** |
| **Live Counter** | ❌ No | ✅ **NEW!** |
| **Delete Referrals** | ❌ No | ✅ **NEW!** |

---

## 🎯 Which Version Should You Use?

### Choose V1 (Extension) If:
- ✅ You prefer browser extensions
- ✅ You don't use referral links
- ✅ You want a popup interface
- ✅ You like the on-page button
- ✅ You don't need referral tracking

### Choose V2 (Tampermonkey) If:
- ✅ You use referral links
- ✅ You need to track 3 accounts per link
- ✅ You have multiple referral links
- ✅ You want a floating menu
- ✅ You prefer draggable interfaces
- ✅ You want referral statistics

---

## 💡 Use Both!

**Best of Both Worlds:**
You can install BOTH versions and use them for different purposes:

- **V1 Extension**: Quick sign-ups without referrals
- **V2 Tampermonkey**: When using referral links

They don't conflict with each other!

---

## 📦 Installation Time

| Version | Installation Time | Difficulty |
|---------|------------------|------------|
| **V1 Extension** | 2-3 minutes | Easy |
| **V2 Tampermonkey** | 2 minutes | Very Easy |

---

## 🎨 UI Comparison

### V1 Extension UI
```
┌─────────────────────────────┐
│  Browser Extension Icon     │
│  Click → Popup Opens        │
├─────────────────────────────┤
│  📧 Email Status            │
│  🔐 Verification Code       │
│  ✨ Auto-fill Button        │
│  📬 Inbox Viewer            │
│  📋 Copy Buttons            │
└─────────────────────────────┘

Plus: 🚀 Floating button on page
```

### V2 Tampermonkey UI
```
┌─────────────────────────────┐
│  🚀 Tdjs-AutoReg V2    [−]  │  ← Draggable header
├─────────────────────────────┤
│  📧 Email Status            │
│     Copy buttons            │
│                             │
│  🔐 Verification Code       │
│     (when detected)         │
│                             │
│  🎁 AddReff                 │
│     [Input referral link]   │
│     [➕ Add]                │
│                             │
│  📋 Active Referrals        │
│     • link1 (2/3) 🚀 🗑️    │
│     • link2 (0/3) 🚀 🗑️    │
│                             │
│  [➕ Create Email]          │
│  [🎯 Auto-fill Form]        │
│  [📬 Check Inbox]           │
│                             │
│  📊 Statistics              │
└─────────────────────────────┘
```

---

## 🚀 Automation Level

### V1 Extension
```
User Actions Required: 2 clicks
1. Click "Create Email" or on-page button
2. Click "Submit" on form

Automation Handles:
✅ Email creation
✅ Form filling  
✅ Code detection
✅ Code filling
✅ Inbox monitoring

Time per account: ~1-2 minutes
```

### V2 Tampermonkey
```
User Actions Required: 3-4 clicks
1. Add referral link (once)
2. Click "Use This Referral"
3. Click "Create Email"
4. Click "Submit" on form

Automation Handles:
✅ Email creation
✅ Form filling
✅ Code detection
✅ Code filling
✅ Inbox monitoring
✅ Referral tracking
✅ Account counting

Time per account: ~2 minutes
Time for 3 accounts: ~6 minutes
```

---

## 📊 Storage Comparison

### V1 Extension (chrome.storage)
```javascript
{
  email: "user@domain.com",
  password: "TdjsCloudPhone0909",
  token: "jwt_token",
  verificationCode: "123456",
  lastMessageCount: 0
}
```

### V2 Tampermonkey (GM_storage)
```javascript
{
  currentEmail: "user@domain.com",
  currentPassword: "TdjsCloudPhone0909",
  currentToken: "jwt_token",
  verificationCode: "123456",
  lastMessageCount: 0,
  referralLinks: [
    {
      code: "vsag44ikbs",
      url: "https://www.vsphone.com/invite/vsag44ikbs",
      accountsCreated: 2,
      addedAt: 1699123456789
    }
  ]
}
```

---

## 🔄 Update Frequency

| Version | Updates | Download |
|---------|---------|----------|
| **V1** | Reload extension | Local folder |
| **V2** | Auto-update | Tampermonkey |

---

## 🎯 Use Cases

### V1 Extension: Best For
- Single account creation
- Testing purposes
- No referral links needed
- Quick sign-ups
- Development/debugging

### V2 Tampermonkey: Best For
- Multiple account creation
- Referral link campaigns
- Tracking 3 per link
- Managing multiple referrals
- Batch account creation
- Statistics tracking

---

## 📈 Performance

| Metric | V1 | V2 |
|--------|----|----|
| **Load Time** | < 1s | < 1s |
| **Memory Usage** | Low | Very Low |
| **CPU Usage** | Minimal | Minimal |
| **Monitoring** | 10s intervals | 10s intervals |
| **API Calls** | Same | Same |

---

## 🔐 Security

Both versions:
- ✅ Local storage only
- ✅ No external servers (except Mail.tm)
- ✅ No tracking
- ✅ No analytics
- ✅ Open source code
- ✅ No data collection

---

## 🌟 Unique Features

### V1 Only
- Browser extension architecture
- Chrome Storage API
- Extension popup UI
- On-page floating button
- Content script injection

### V2 Only
- 🎁 **AddReff referral system**
- 📊 **Account limit tracking (3 per link)**
- 🗑️ **Delete referral links**
- 📈 **Statistics dashboard**
- 🎨 **Draggable floating menu**
- 🔽 **Minimizable interface**
- 🎯 **Multiple referral management**

---

## 💰 Cost

| Version | Price | Updates |
|---------|-------|---------|
| **V1** | Free | Free |
| **V2** | Free | Free |

---

## 🎓 Learning Curve

### V1 Extension
- **Beginner**: Install extension → Use
- **Time to Learn**: 5 minutes
- **Documentation**: Comprehensive

### V2 Tampermonkey
- **Beginner**: Install Tampermonkey → Install script → Use
- **Time to Learn**: 5 minutes + understanding referrals
- **Documentation**: Comprehensive

---

## 🔮 Future Plans

### V1 Extension
- Dark theme
- Settings page
- Chrome Web Store
- Firefox Add-ons

### V2 Tampermonkey
- Custom account limits
- Export statistics
- Import referral lists
- Keyboard shortcuts
- Auto-rotation

---

## 📝 Quick Decision Matrix

**Choose V1 if you answer YES to:**
- [ ] I don't use referral links
- [ ] I prefer browser extensions
- [ ] I want a simple popup UI
- [ ] I only need 1-2 accounts

**Choose V2 if you answer YES to:**
- [ ] I have referral links to use
- [ ] I need to create 3+ accounts
- [ ] I want to track multiple referrals
- [ ] I prefer floating menus
- [ ] I need statistics

---

## 🎉 Recommendation

### For Most Users: V2 Tampermonkey
**Why?**
- ✅ More features
- ✅ Referral system
- ✅ Better tracking
- ✅ Statistics
- ✅ Same automation power
- ✅ Plus referral management!

### For Extension Lovers: V1
**Why?**
- ✅ Native extension feel
- ✅ Browser integration
- ✅ Popup UI familiar
- ✅ No userscript manager needed

### For Power Users: BOTH!
**Why?**
- ✅ V1 for quick tasks
- ✅ V2 for referral campaigns
- ✅ Best of both worlds
- ✅ No conflicts

---

**Summary:**

Both versions are excellent! 

**V1 = Automation**
**V2 = Automation + Referral Management**

Choose based on your needs! 🚀
