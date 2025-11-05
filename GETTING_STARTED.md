# 🚀 Getting Started - Vsphone Auto Sign-up Extension

Welcome! This guide will get you up and running in **under 5 minutes**.

---

## 📋 What You're About to Install

A browser extension that **automatically creates temporary email addresses** and **fills sign-up forms** on cloud.vsphone.com with one click.

No more:
- ❌ Manually creating email addresses
- ❌ Typing passwords twice
- ❌ Switching between tabs to check inbox
- ❌ Copying and pasting credentials

Instead:
- ✅ One-click auto-fill
- ✅ Automatic email creation
- ✅ Built-in inbox viewer
- ✅ Instant credential copying

---

## ⚡ 3-Step Installation

### Step 1: Open Extensions Page

**Chrome/Edge/Brave:**
1. Click the three dots menu (⋮)
2. Go to: **More tools** → **Extensions**
3. Or just paste this in your address bar:
   ```
   chrome://extensions/
   ```

**Firefox:**
1. Type in address bar:
   ```
   about:debugging#/runtime/this-firefox
   ```

### Step 2: Enable Developer Mode

**Chrome/Edge/Brave:**
- Look for a toggle switch labeled **"Developer mode"** in the top-right
- Turn it **ON** (blue)

**Firefox:**
- No developer mode needed!

### Step 3: Load the Extension

**Chrome/Edge/Brave:**
1. Click **"Load unpacked"** button
2. Navigate to where you downloaded this repository
3. Select the **`extension`** folder (the folder itself, not a file inside it)
4. Click **"Select Folder"**

**Firefox:**
1. Click **"Load Temporary Add-on"**
2. Navigate to the **`extension`** folder
3. Select the **`manifest.json`** file
4. Click **"Open"**

---

## 🎯 Your First Auto-Fill (60 seconds)

### The Easy Way: On-Page Button

1. **Go to Vsphone**
   ```
   https://cloud.vsphone.com/
   ```

2. **Navigate to Sign-up**
   - Look for Register, Sign-up, or Create Account
   - You'll see the form with email and password fields

3. **Click the Magic Button**
   - A purple button appears in the bottom-right: **🚀 Auto-fill with Mail.tm**
   - Click it
   - Watch the magic happen!

That's it! The extension will:
- Create a temporary email
- Fill the form automatically
- Show you a success message

---

## 🎨 Using the Extension Popup

Click the extension icon in your toolbar to access:

### 📧 Create New Email
- Generates a fresh temporary email address
- Shows email and password
- Stores credentials securely

### 🎯 Auto-fill Form
- Fills the current page's form
- Works on any vsphone.com page
- One-click operation

### 📬 Check Inbox
- View all received emails
- Click any message to read it
- Perfect for finding verification emails

### 📋 Copy Credentials
- Quick copy email address
- Quick copy password
- Paste anywhere you need

---

## 🔍 What Each Button Does

| Button | Function | When to Use |
|--------|----------|-------------|
| **Create New Email** | Makes a new temp email | Before signing up |
| **Auto-fill Form** | Fills the page form | When on signup page |
| **Check Inbox** | Shows received emails | To find verification emails |
| **Copy Email** | Copies email to clipboard | For manual entry |
| **Copy Password** | Copies password to clipboard | For manual entry |
| **🚀 On-page Button** | Creates email + auto-fills | One-click everything! |

---

## 💡 Pro Tips

### Tip 1: Use the On-Page Button
The floating **🚀 Auto-fill with Mail.tm** button is the fastest way:
- No need to click the extension icon
- One click does everything
- Appears automatically on sign-up pages

### Tip 2: Keep the Popup Open
When checking for verification emails:
- Keep the extension popup open
- Click "Check Inbox" multiple times
- Wait 30-60 seconds between checks

### Tip 3: Copy Before Closing
If you need the credentials later:
- Copy both email and password
- Paste into a text file
- Or take a screenshot

### Tip 4: Refresh If Needed
If the auto-fill button doesn't appear:
- Refresh the page (F5)
- Make sure you're on the right page
- Look for sign-up forms

---

## 🎬 Complete Workflow Example

Here's a real-world usage scenario:

1. **Install Extension** (one-time, 2 minutes)
   - Follow the 3-step installation above
   - Extension icon appears in toolbar

2. **Navigate to Vsphone** (10 seconds)
   - Open: https://cloud.vsphone.com/
   - Find the sign-up/register page

3. **Click the Magic Button** (5 seconds)
   - Click: **🚀 Auto-fill with Mail.tm**
   - Form fills automatically
   - Success notification appears

4. **Submit the Form** (5 seconds)
   - Review the filled information
   - Check any terms of service boxes (if needed)
   - Click the submit button

5. **Check for Verification Email** (1-2 minutes)
   - Click extension icon
   - Click **"Check Inbox"**
   - Wait for email to arrive
   - Click the email to read it

6. **Click Verification Link** (10 seconds)
   - Find the verification link in email
   - Click it to verify account
   - Account is now active!

**Total Time: 3-4 minutes** ⚡

---

## ❓ Quick Troubleshooting

### "Extension won't load"
- ✅ Make sure Developer Mode is ON
- ✅ Select the `extension` **folder**, not a file inside it
- ✅ Check for error messages in red

### "Auto-fill button doesn't appear"
- ✅ Make sure you're on cloud.vsphone.com
- ✅ Make sure you're on a sign-up/register page
- ✅ Try refreshing the page (F5)
- ✅ Use the popup method instead

### "Can't create email"
- ✅ Check your internet connection
- ✅ Wait a few seconds and try again
- ✅ Check browser console (F12) for errors

### "No emails in inbox"
- ✅ Wait 30-60 seconds for delivery
- ✅ Click "Check Inbox" to refresh
- ✅ Make sure the form was actually submitted

### "Form didn't fill"
- ✅ Make sure you created an email first
- ✅ Try clicking the on-page button instead
- ✅ Refresh the page and try again

---

## 📊 What Happens Behind the Scenes

When you click the auto-fill button:

1. **Email Creation** (5 seconds)
   - Extension contacts Mail.tm API
   - Generates unique email address
   - Creates account with secure password
   - Stores credentials locally

2. **Form Detection** (instant)
   - Scans page for email fields
   - Finds password fields
   - Locates confirm password fields
   - Identifies checkboxes

3. **Auto-Fill** (instant)
   - Fills email field
   - Fills password field
   - Fills confirm password field
   - Checks terms of service boxes
   - Shows success notification

4. **Inbox Monitoring** (ongoing)
   - You can check anytime
   - Retrieves new messages
   - Displays in popup
   - Click to read full content

---

## 🔒 Privacy & Security

### What Gets Stored
- ✅ Email address (in your browser only)
- ✅ Password (in your browser only)
- ✅ Auth token (in your browser only)

### What Does NOT Get Stored
- ❌ No external servers (except Mail.tm API)
- ❌ No analytics or tracking
- ❌ No data sent to third parties
- ❌ No browsing history

### How It's Stored
- Local browser storage only
- Not synced across devices
- Cleared when you clear browser data
- Can view in: chrome://extensions/ → Extension details → Storage

---

## 🎯 Next Steps

Now that you're set up:

1. **Try it out!**
   - Go to cloud.vsphone.com
   - Click the auto-fill button
   - See it work

2. **Check your inbox**
   - Wait for verification email
   - Click extension icon → Check Inbox
   - Read the message

3. **Use it regularly**
   - Create new accounts easily
   - No more manual typing
   - Save time on every signup

4. **Explore features**
   - Try the popup interface
   - Copy credentials
   - Read emails
   - Experiment!

---

## 📚 More Resources

| Document | Purpose |
|----------|---------|
| **INSTALLATION.md** | Detailed installation guide |
| **extension/README.md** | Complete feature documentation |
| **PROJECT_SUMMARY.md** | Technical overview |
| **README.md** | Project information |

---

## 🎉 You're Ready!

Everything you need is now installed and ready to use.

**Go try it:**
1. Visit: https://cloud.vsphone.com/
2. Click: **🚀 Auto-fill with Mail.tm**
3. Enjoy! ✨

---

## 💬 Need Help?

If something doesn't work:
1. Read the troubleshooting section above
2. Check the browser console (F12 → Console)
3. Review the full documentation in `extension/README.md`
4. Make sure you're on the right website

---

**Happy automating!** 🚀

Made with ❤️ for people who value their time
