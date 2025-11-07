# 🚀 Vsphone Auto Sign-up Extension

A powerful browser extension that automatically fills sign-up forms on cloud.vsphone.com using temporary email addresses from Mail.tm.

## ✨ Features

- 📧 **Automatic Email Creation**: Generates temporary email addresses using Mail.tm API
- 🎯 **Auto-fill Forms**: Automatically fills sign-up forms with one click
- 📬 **Inbox Management**: Check and read emails directly from the extension
- 🔄 **Real-time Updates**: Monitor inbox for verification emails
- 📋 **Easy Copy**: Quick copy email and password to clipboard
- 🎨 **Beautiful UI**: Modern, gradient-based interface
- 🔒 **Privacy First**: No data stored on external servers

## 📦 Installation

### Chrome/Edge/Brave

1. **Download the Extension**
   - Clone or download this repository
   - Locate the `extension` folder

2. **Open Extension Settings**
   - Open Chrome/Edge/Brave browser
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `extension` folder
   - The extension icon should appear in your toolbar

### Firefox

1. **Download the Extension**
   - Clone or download this repository
   - Locate the `extension` folder

2. **Open Extension Settings**
   - Open Firefox browser
   - Navigate to `about:debugging#/runtime/this-firefox`

3. **Load the Extension**
   - Click "Load Temporary Add-on"
   - Navigate to the `extension` folder
   - Select the `manifest.json` file

## 🎯 Usage

### Method 1: Using the Extension Popup

1. **Create an Email**
   - Click the extension icon in your toolbar
   - Click "Create New Email"
   - Wait for the email to be generated
   - Your temporary email and password will be displayed

2. **Navigate to Vsphone**
   - Open https://cloud.vsphone.com/
   - Navigate to the sign-up/register page

3. **Auto-fill the Form**
   - Click the extension icon
   - Click "Auto-fill Sign-up Form"
   - The form will be automatically filled with your temporary email and password

4. **Check Inbox**
   - Click "Check Inbox" to view received emails
   - Click on any message to read its full content
   - Look for verification emails from Vsphone

### Method 2: Using the On-Page Button

1. **Navigate to Vsphone Sign-up**
   - Open https://cloud.vsphone.com/
   - Navigate to the sign-up/register page

2. **Use the Auto-fill Button**
   - A floating button "🚀 Auto-fill with Mail.tm" will appear in the bottom-right
   - Click this button
   - The extension will create a new email and automatically fill the form
   - All in one click!

## 📋 Features Breakdown

### 1. Email Creation
- Automatically selects from available Mail.tm domains
- Generates unique email addresses
- Creates account with secure password
- Stores credentials locally in browser

### 2. Form Auto-fill
- Detects email input fields
- Detects password input fields
- Detects confirm password fields
- Automatically checks terms of service checkboxes
- Shows success/error notifications

### 3. Inbox Management
- Lists all received emails
- Displays sender, subject, and date
- Click to view full email content
- Modal view for detailed message reading

### 4. Smart Detection
- Automatically detects sign-up forms
- Shows floating button on signup pages
- Adapts to different form structures
- Handles dynamic content

## 🔧 Technical Details

### Files Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # Content script for page interaction
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── popup.css             # Popup styles
├── icons/                # Extension icons
└── README.md            # This file
```

### API Integration

The extension uses the Mail.tm API (https://api.mail.tm) for:
- Fetching available domains
- Creating temporary email accounts
- Authenticating users
- Retrieving messages
- Reading message content

### Permissions

- `storage`: Store email credentials locally
- `activeTab`: Interact with the current tab
- `scripting`: Inject content scripts
- `https://cloud.vsphone.com/*`: Access Vsphone website
- `https://api.mail.tm/*`: Access Mail.tm API

## 🛠️ Configuration

### Change Default Password

Edit `background.js` and `telegram-mailtm-bot.js`:

```javascript
const PASSWORD = 'YourCustomPassword';
```

### Customize Auto-fill Behavior

Edit `content.js` to modify:
- Form field selectors
- Auto-fill timing
- Notification styles
- Button appearance

## 🔒 Security & Privacy

- ✅ All data stored locally in browser
- ✅ No external servers (except Mail.tm API)
- ✅ No tracking or analytics
- ✅ Temporary emails automatically expire
- ✅ Open source - inspect the code yourself

## 🐛 Troubleshooting

### Extension doesn't load
- Make sure Developer mode is enabled
- Check browser console for errors
- Verify all files are present

### Auto-fill doesn't work
- Ensure you're on the correct page (cloud.vsphone.com)
- Check that form fields are visible
- Try refreshing the page
- Check browser console for errors

### Can't create email
- Check internet connection
- Verify Mail.tm API is accessible
- Try again in a few seconds
- Check browser console for API errors

### Email not showing in inbox
- Allow time for email delivery
- Click "Check Inbox" to refresh
- Verify email was sent to the correct address
- Some emails may take a few minutes

## 📝 Notes

- Temporary emails expire after a certain period
- Mail.tm is a free service and may have rate limits
- Some services may block temporary email providers
- Always check your inbox for verification emails
- The extension works best on standard HTML forms

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available for personal use.

## ⚠️ Disclaimer

This extension is for educational and automation purposes only. Use responsibly and in accordance with the terms of service of the websites you interact with.

## 🔗 Related Projects

- [Telegram Mail.tm Bot](../telegram-mailtm-bot.js) - Telegram bot version of this functionality

## 📞 Support

If you encounter issues:
1. Check this README
2. Review the troubleshooting section
3. Check browser console for errors
4. Open an issue on GitHub

---

Made with ❤️ for automation enthusiasts
