# 🚀 Quick Installation Guide - Vsphone Auto Sign-up Extension

This guide will help you install and use the browser extension in under 5 minutes.

## ⚡ Quick Install (Chrome/Edge/Brave)

1. **Open Extension Management**
   ```
   Chrome: chrome://extensions/
   Edge:   edge://extensions/
   Brave:  brave://extensions/
   ```

2. **Enable Developer Mode**
   - Look for the toggle in the top-right corner
   - Turn it **ON**

3. **Load the Extension**
   - Click **"Load unpacked"**
   - Navigate to the `extension` folder in this repository
   - Select the folder
   - Done! 🎉

## 🦊 Quick Install (Firefox)

1. **Open Temporary Extensions Page**
   ```
   about:debugging#/runtime/this-firefox
   ```

2. **Load the Extension**
   - Click **"Load Temporary Add-on"**
   - Navigate to the `extension` folder
   - Select `manifest.json`
   - Done! 🎉

> **Note**: In Firefox, temporary add-ons are removed when you close the browser. For permanent installation, you'd need to sign the extension.

## 🎯 How to Use

### Option 1: One-Click Auto-fill (Easiest!)

1. Go to https://cloud.vsphone.com/
2. Navigate to the sign-up/register page
3. Look for the **🚀 Auto-fill with Mail.tm** button (bottom-right)
4. Click it!
5. Form is filled automatically ✨

### Option 2: Manual Control via Popup

1. Click the extension icon in your toolbar
2. Click **"Create New Email"**
3. Wait for email generation
4. Go to https://cloud.vsphone.com/signup
5. Click the extension icon again
6. Click **"Auto-fill Sign-up Form"**
7. Form is filled! ✨

## 📬 Checking Your Inbox

1. Click the extension icon
2. Click **"Check Inbox"**
3. View all received emails
4. Click any message to read it
5. Look for verification emails from Vsphone

## 📋 Copying Credentials

Click the **📋 Copy** buttons in the extension popup to copy:
- Email address
- Password

Useful for manual form filling or storing credentials.

## 🎨 Features at a Glance

| Feature | Description |
|---------|-------------|
| 📧 Auto Email | Generates temporary Mail.tm addresses |
| 🎯 Auto-fill | Fills forms with one click |
| 📬 Inbox | View emails directly in extension |
| 🔄 Real-time | Live inbox updates |
| 📋 Copy | Quick copy email/password |
| 🎨 UI | Modern gradient interface |
| 🔒 Privacy | All data stored locally |

## ❓ Troubleshooting

### Extension doesn't appear
- Make sure Developer Mode is enabled
- Check that you selected the correct folder
- Look for error messages in the extensions page

### Auto-fill doesn't work
- Ensure you're on cloud.vsphone.com
- Refresh the page
- Check browser console (F12) for errors
- Try creating a new email first

### Can't create email
- Check your internet connection
- Verify Mail.tm API is accessible (https://api.mail.tm)
- Wait a few seconds and try again

### No emails in inbox
- Allow time for delivery (30 seconds - 2 minutes)
- Click "Check Inbox" to refresh
- Verify the email was sent to the correct address

## 🔧 Advanced Configuration

### Change Default Password

Edit `extension/background.js`:
```javascript
const PASSWORD = 'YourCustomPassword123!';
```

### Customize Button Position

Edit `extension/content.js` to change the auto-fill button style and position.

## 📊 File Structure

```
extension/
├── manifest.json       # Extension config (REQUIRED)
├── background.js       # Mail.tm API handler (REQUIRED)
├── content.js          # Page interaction (REQUIRED)
├── popup.html          # UI structure (REQUIRED)
├── popup.js            # UI logic (REQUIRED)
├── popup.css           # UI styles (REQUIRED)
├── icons/              # Extension icons (REQUIRED)
│   ├── icon16.png      # Toolbar icon
│   ├── icon48.png      # Extensions page
│   └── icon128.png     # Chrome Web Store
└── README.md           # Full documentation
```

## ✅ What's Included

- ✅ Full source code
- ✅ All required icons (PNG)
- ✅ Complete documentation
- ✅ Ready to use - no build step needed

## 🚀 Next Steps

1. ✅ Install the extension (you're here!)
2. 🌐 Visit cloud.vsphone.com
3. 📝 Auto-fill a sign-up form
4. 📬 Check your inbox
5. ✨ Enjoy automated sign-ups!

## 📞 Need Help?

- Read the full [README.md](extension/README.md)
- Check browser console (F12) for errors
- Verify all files are present in the extension folder
- Ensure you have an internet connection

---

**Estimated Install Time**: 2-3 minutes ⚡
**Difficulty**: Beginner-friendly ⭐

Made with ❤️ for automation enthusiasts
