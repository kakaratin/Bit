# 🚀 Tdjs-AutoReg - Automated Sign-up Tool

**Automated sign-up tool for vsphone.com using temporary emails from mail.tm**

---

## 🎉 Latest Version: V3.0 - CLEAN & DRAGGABLE! 🎨

### ✨ What's New in V3:
- 🖱️ **FULLY DRAGGABLE UI** - Move anywhere on screen!
- 🎨 **Beautiful card-based design** with smooth animations
- 📦 **Minimizable window** - Save screen space
- ⚡ **Clean & simple** - No complicated features
- 🔐 **Auto verification codes** - Fills automatically when received
- 👆 **Manual captcha** - You solve the puzzle (takes 2 seconds)

---

## 📦 What's Included:

### Version 1: Browser Extension (V1.1.0)
- Chrome/Edge/Brave extension
- Automatic email creation
- Form auto-fill
- Verification code detection
- Browser action popup UI

📁 Location: `/workspace/extension/`

### Version 3: Tampermonkey Userscript (V3.0) ⭐ RECOMMENDED
- **FULLY DRAGGABLE interface**
- Beautiful modern design
- Card-based layout
- Smooth animations
- Manual captcha solving
- Auto verification codes

📁 Location: `/workspace/tampermonkey-v2/Tdjs-AutoReg-V3-Final.user.js`

---

## 🚀 Quick Start (V3 - Recommended)

### 1. Install Tampermonkey
- [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 2. Install Script
1. Click Tampermonkey icon
2. Create new script
3. Copy `Tdjs-AutoReg-V3-Final.user.js`
4. Paste and save (Ctrl+S)

### 3. Use It!
1. Go to `https://cloud.vsphone.com/`
2. Drag the purple window anywhere you want
3. Click "Create New Email"
4. Click "Auto-fill Form"
5. Solve captcha manually (2 seconds)
6. Submit form
7. Verification code fills automatically!
8. Done! 🎉

---

## 🎨 V3 Features:

### 🖱️ Draggable Interface
```
Grab the header → Drag anywhere → Release!
Perfect positioning every time!
```

### 📦 Minimizable
```
Click "─" → Minimizes to header
Click "□" → Restores full window
```

### 🎯 Card-Based Design
- **Email Card** - Shows temp email & password
- **Verification Code Card** - Pulses when code arrives!
- **Actions Card** - All buttons in one place
- **Instructions Card** - Step-by-step guide
- **Stats Card** - Feature summary

### ⚡ One-Click Actions
- Create Email
- Auto-fill Form
- Check Inbox
- Fill Verification Code

---

## 📖 Documentation:

### V3 (Current):
- `INSTALL_V3.md` - Installation guide
- `V3_FINAL_RELEASE.md` - Full feature documentation

### V1 (Browser Extension):
- `INSTALLATION.md` - Extension installation
- `GETTING_STARTED.md` - Quick start guide
- `PROJECT_SUMMARY.md` - Technical details

---

## 🎯 How It Works:

```
1. Creates temporary email (mail.tm)
   ↓
2. Fills email & password in form
   ↓
3. YOU solve the captcha puzzle (2 seconds)
   ↓
4. YOU submit the form
   ↓
5. Script monitors inbox for verification email
   ↓
6. Extracts verification code
   ↓
7. Auto-fills code in verification field
   ↓
8. Account created! ✅
```

---

## 🔥 Why V3?

| Feature | V1 Extension | V3 Userscript |
|---------|-------------|---------------|
| Installation | Complex | Simple |
| UI | Fixed popup | Draggable window |
| Design | Basic | Beautiful |
| Captcha | None | Manual (easy) |
| Updates | Reload extension | Instant |
| Flexibility | Limited | High |

**V3 = Best of everything!** 🎉

---

## 💡 Pro Tips:

### Positioning:
- **Top-right**: Out of the way
- **Left side**: Better for some sites
- **Center**: Easy access

### Workflow:
1. Position window once
2. Minimize when not needed
3. Expand to create accounts
4. Code fills automatically!

### Multiple Accounts:
1. Create account #1
2. Wait for "Account created!"
3. Click "Create New Email" again
4. Repeat!

---

## 🐛 Troubleshooting:

### Script not showing?
- Refresh page
- Check Tampermonkey is enabled
- Check console (F12) for errors

### Can't drag?
- Make sure you grab the HEADER (purple area)
- Not the white cards!

### Form not filling?
- Ensure email is created first
- Some sites have custom fields
- May need minor manual adjustment

### Code not auto-filling?
- Wait 10-20 seconds (checks every 10s)
- Click "Check Inbox" manually
- Or click "Fill Code Now" button

---

## 📊 Features Comparison:

### What V3 Does:
- ✅ Create temporary emails
- ✅ Auto-fill forms
- ✅ Auto-fill verification codes
- ✅ Beautiful draggable UI
- ✅ Smooth animations
- ✅ Minimizable window
- 👆 Manual captcha (you do this)

### What V3 Doesn't Do:
- ❌ Auto-solve captchas (impossible for puzzle captchas)
- ❌ Buff accounts (removed for simplicity)
- ❌ Referral management (removed for simplicity)
- ❌ Auto-submit forms (to avoid detection)

---

## 🎨 UI Preview:

```
┌───────────────────────────────────┐
│ 🚀 Tdjs-AutoReg             [─]  │ ← Drag here!
│ Clean & Simple Automation         │
├───────────────────────────────────┤
│                                   │
│  📧 Temporary Email               │
│  ┌─────────────────────────────┐ │
│  │ tdjs123@mail.tm             │ │
│  │ 🔒 Password: TdjsCl...      │ │
│  └─────────────────────────────┘ │
│                                   │
│  🔐 Verification Code             │
│  ┌─────────────────────────────┐ │
│  │      1 2 3 4 5 6            │ │ ← Pulses!
│  └─────────────────────────────┘ │
│  [🎯 Fill Code Now]               │
│                                   │
│  ⚡ Quick Actions                 │
│  [➕ Create New Email]            │
│  [🎯 Auto-fill Form]              │
│  [📬 Check Inbox]                 │
│                                   │
│  💡 How to Use                    │
│  1️⃣ Create temp email             │
│  2️⃣ Auto-fill form                │
│  3️⃣ Solve captcha manually 👆     │
│  4️⃣ Submit form                   │
│  5️⃣ Code fills automatically! ✅  │
│                                   │
└───────────────────────────────────┘
```

---

## 🚀 Version History:

- **V3.0** - Clean & draggable UI, removed complexity
- **V2.2** - ReffBuff system (removed in V3)
- **V2.1** - Floating ball UI (replaced in V3)
- **V2.0** - Tampermonkey version
- **V1.1** - Verification codes
- **V1.0** - Initial browser extension

---

## 📁 File Structure:

```
/workspace/
├── extension/              # V1 Browser Extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html/js/css
│   └── icons/
│
├── tampermonkey-v2/        # V3 Userscript
│   ├── Tdjs-AutoReg-V3-Final.user.js  ⭐ USE THIS!
│   ├── INSTALL_V3.md
│   └── V3_FINAL_RELEASE.md
│
└── README.md              # This file
```

---

## 🎯 Best Practices:

1. **One account at a time** - Wait for completion
2. **Position the window** - Drag to comfortable spot
3. **Minimize when idle** - Saves screen space
4. **Check notifications** - Top-right corner
5. **Manual captcha** - Takes 2 seconds, no stress!

---

## 🔒 Privacy:

- ✅ **No data collection** - Everything local
- ✅ **No external servers** - Only mail.tm API
- ✅ **No tracking** - Zero analytics
- ✅ **Open source** - Read the code!

---

## 🎉 Summary:

**Tdjs-AutoReg V3 = The perfect balance!**

- 🎨 Beautiful & modern
- 🖱️ Fully draggable
- ⚡ Fast & efficient
- 🧹 Clean & simple
- 💪 Gets the job done!

**No more complexity, just smooth automation with a gorgeous UI!**

---

## 🚀 Get Started:

1. Read `INSTALL_V3.md`
2. Install Tampermonkey
3. Copy the script
4. Create accounts!

**That's it! Enjoy! 🔥**

---

Made with ❤️ by Tdjs
