# 🚀 Tdjs-AutoReg - Complete Automation Suite

This repository contains powerful automation tools for working with temporary email services and cloud phone platforms.

## 📦 Two Powerful Versions

### 🎯 Version 1: Browser Extension
**Location**: `/extension/`
**Platform**: Chrome, Edge, Brave, Firefox

A browser extension that automatically fills sign-up forms on cloud.vsphone.com using temporary email addresses from Mail.tm, **including automatic verification code detection and filling**.

### 🎁 Version 2: Tampermonkey Userscript (NEW!)
**Location**: `/tampermonkey-v2/`
**Platform**: Universal (any browser with Tampermonkey)

**ALL V1 features PLUS:**
- 🎁 **AddReff System**: Manage referral links
- 📊 **3-Account Tracking**: Per referral link
- 🎨 **Floating Menu**: Draggable interface
- 📈 **Statistics Dashboard**: Live counts
- 🗑️ **Referral Management**: Add/delete links

---

## ✨ Core Features (Both Versions)

**✨ Key Features**:
- 📧 Automatic temporary email creation via Mail.tm API
- 🎯 One-click form auto-fill
- 🔐 **NEW: Automatic verification code extraction**
- ⚡ **NEW: Auto-fill verification codes**
- 📬 Built-in inbox viewer
- 🔄 Real-time email monitoring (every 10 seconds)
- 📋 Quick copy credentials
- 🎨 Beautiful, modern UI with branding

**V1 Quick Start**:
1. Navigate to the `extension/` folder
2. Follow the installation instructions in `extension/README.md`
3. Load the extension in your browser
4. Visit cloud.vsphone.com and click the auto-fill button!

**V2 Quick Start**:
1. Install Tampermonkey extension
2. Install the script from `tampermonkey-v2/Tdjs-AutoReg-V2.user.js`
3. Visit cloud.vsphone.com
4. Floating menu appears automatically!

[📖 Read V1 documentation →](extension/README.md)
[📖 Read V2 documentation →](tampermonkey-v2/README.md)
[🆚 Compare Versions →](VERSIONS_COMPARISON.md)

### 2. Telegram Bot - Mail.tm Integration
**Location**: `telegram-mailtm-bot.js`

A Telegram bot that integrates with Mail.tm and meows.io.vn for automated cloud phone operations.

## 🛠️ Tech Stack

- **Browser Extension**: Manifest V3, Vanilla JavaScript
- **Telegram Bot**: Node.js, Axios
- **Email Service**: Mail.tm API
- **Icons**: Generated with Sharp + Node.js Canvas

## 📝 Status

✅ Browser Extension - **Complete and ready to use**
- All core files implemented
- PNG icons generated
- Full documentation
- Ready for browser installation

✅ Telegram Bot - **Functional**

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## ⚠️ Disclaimer

These tools are for educational and automation purposes only. Use responsibly and in accordance with the terms of service of the platforms you interact with.

## 📄 License

Open source - available for personal use.