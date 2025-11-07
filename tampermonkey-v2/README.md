# 🚀 Tdjs-AutoReg V2 - Tampermonkey Edition

## ✨ What's New in V2?

### 🎁 **AddReff - Referral System**
The killer feature! Manage multiple referral links with automatic tracking:
- ➕ Add unlimited referral links
- 📊 Track usage (3 accounts per referral link)
- 🎯 One-click to use specific referral
- 🗑️ Delete exhausted referrals
- 📈 Live statistics dashboard

### 🎨 **Floating Menu**
- 📌 Draggable interface
- 📍 Stays on top of page
- 🔽 Minimizable for compact view
- 🎭 Beautiful gradient design
- 💫 Smooth animations

### 🔄 **All V1 Features Included**
- ✅ Automatic email creation (Mail.tm)
- ✅ Form auto-fill
- ✅ Verification code detection & auto-fill
- ✅ Real-time inbox monitoring
- ✅ Beautiful notifications

---

## 📦 Installation

### Step 1: Install Tampermonkey
1. Install Tampermonkey for your browser:
   - **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - **Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### Step 2: Install Script
1. Click on Tampermonkey icon
2. Select "Create a new script"
3. Delete all the default code
4. Copy the entire content of `Tdjs-AutoReg-V2.user.js`
5. Paste it into the editor
6. Press **Ctrl+S** (or Cmd+S on Mac) to save
7. Done! 🎉

### Step 3: Use It
1. Go to `https://cloud.vsphone.com/` or `https://www.vsphone.com/`
2. The floating menu will appear automatically
3. Start automating!

---

## 🎯 How to Use

### Basic Workflow (No Referral)
```
1. Click "➕ Create New Email"
   ↓ (5 seconds)
   
2. Click "🎯 Auto-fill Form"
   ↓ (instant)
   
3. Submit the form manually
   ↓ (30-60 seconds)
   
4. Verification code fills automatically! ✅
```

### AddReff Workflow (With Referral)
```
1. Add referral link in "AddReff" section
   → Paste: https://www.vsphone.com/invite/vsag44ikbs
   → Click "➕ Add Referral Link"
   
2. Click "🚀 Use This Referral" on your link
   → Opens in new tab
   
3. Back to original tab, click "➕ Create New Email"
   
4. Click "🎯 Auto-fill Form"
   
5. Submit the form
   
6. Verification code fills automatically
   
7. Account created! Counter goes 1/3 → 2/3 → 3/3
   
8. Repeat for 2 more accounts (3 total per link)
   
9. When 3/3, link is marked complete
```

---

## 🎁 AddReff Feature Details

### How It Works

**1. Add Referral Links**
- Paste any vsphone.com invite link
- Format: `https://www.vsphone.com/invite/CODE`
- Example: `https://www.vsphone.com/invite/vsag44ikbs`
- Extracts the referral code automatically

**2. Track Account Creation**
- Shows counter: `0/3`, `1/3`, `2/3`, `3/3`
- Green badge when slots available
- Red badge when limit reached (3/3)
- Can't use exhausted referrals

**3. Manage Multiple Referrals**
- Add as many as you want
- See all active referrals in one list
- Delete with 🗑️ button
- Statistics at bottom:
  - Total Referrals
  - Total Accounts Created
  - Available Slots

**4. Use Specific Referral**
- Click "🚀 Use This Referral"
- Opens referral link in new tab
- Create account in that tab
- Counter increments automatically

### Referral Link Requirements
- ✅ Must contain `/invite/`
- ✅ Must have referral code after `/invite/`
- ✅ Can be from `vsphone.com` or `cloud.vsphone.com`
- ✅ Examples:
  - `https://www.vsphone.com/invite/vsag44ikbs`
  - `https://cloud.vsphone.com/invite/abc123xyz`

---

## 🎨 Floating Menu Features

### Draggable
- Click and hold the header (top bar)
- Drag anywhere on screen
- Position saves automatically

### Minimizable
- Click the **−** button to minimize
- Click the **+** button to expand
- Saves space when not in use

### Sections

**1. 📧 Email Status**
- Shows current email
- Shows password
- Copy buttons for both

**2. 🔐 Verification Code** (appears when detected)
- Large, pulsing display
- Shows extracted code
- "Fill Code Now" button
- Auto-fills automatically

**3. 🎁 AddReff - Referral Manager**
- Input field for new referrals
- Add button
- Instructions

**4. 📋 Active Referrals**
- List of all referrals
- Shows code and counter
- "Use This Referral" button
- Delete button

**5. Main Actions**
- Create New Email
- Auto-fill Form
- Check Inbox

**6. 📊 Statistics**
- Total Referrals
- Total Accounts Created
- Available Slots

---

## 💡 Pro Tips

### Tip 1: Prepare Referrals First
Add all your referral links before starting. Then use them one by one!

### Tip 2: Open in New Tab
"Use This Referral" opens in new tab. Switch back to original tab to continue.

### Tip 3: Watch the Counter
Green (0-2/3) = Available
Red (3/3) = Exhausted

### Tip 4: Delete Exhausted
Clean up by deleting 3/3 referrals to keep list tidy.

### Tip 5: Batch Creation
Create 3 accounts at once:
1. Use referral → Create account
2. Use referral → Create account
3. Use referral → Create account
Done! Move to next referral.

---

## 🔧 Advanced Usage

### Multiple Referral Strategy
```
Referral A: vsag44ikbs (0/3)
Referral B: xyz123abc (0/3)
Referral C: ref456def (0/3)

Day 1: Use A → 3 accounts → (3/3)
Day 2: Use B → 3 accounts → (3/3)
Day 3: Use C → 3 accounts → (3/3)

Total: 9 accounts created!
```

### Keyboard Shortcuts
Currently none, but you can:
- Tab through inputs
- Enter to submit
- Click buttons

### Storage Management
All data stored in Tampermonkey's GM_storage:
- Referral links
- Account counters
- Current email
- Verification codes

To reset:
1. Open Tampermonkey dashboard
2. Find "Tdjs-AutoReg V2"
3. Click "Storage" tab
4. Clear values

---

## 🆚 V1 vs V2 Comparison

| Feature | V1 (Extension) | V2 (Tampermonkey) |
|---------|----------------|-------------------|
| **Installation** | Load unpacked | Install script |
| **Platform** | Browser extension | Userscript |
| **Email Creation** | ✅ | ✅ |
| **Form Auto-fill** | ✅ | ✅ |
| **Verification Auto-fill** | ✅ | ✅ |
| **Inbox Monitoring** | ✅ | ✅ |
| **UI Type** | Popup + Button | Floating Menu |
| **Draggable UI** | ❌ | ✅ NEW |
| **Referral System** | ❌ | ✅ NEW |
| **Multi-referral Tracking** | ❌ | ✅ NEW |
| **Account Limits** | ❌ | ✅ 3 per link |
| **Statistics** | ❌ | ✅ NEW |

---

## 📊 Technical Details

### Data Stored (GM_storage)
```javascript
{
  currentEmail: "user123@domain.com",
  currentPassword: "TdjsCloudPhone0909",
  currentToken: "jwt_token_here",
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

### API Requests
- Mail.tm API: `https://api.mail.tm`
- Methods: GET, POST
- Authentication: Bearer token
- Check interval: 10 seconds

### Permissions Used
- `GM_xmlhttpRequest`: API calls to Mail.tm
- `GM_setValue/getValue`: Data storage
- `GM_deleteValue`: Clear data
- `@connect api.mail.tm`: Allow API access

---

## 🐛 Troubleshooting

### Script Not Loading
→ Check Tampermonkey is enabled
→ Check script is enabled in dashboard
→ Refresh the page

### Menu Not Appearing
→ Wait 1 second after page load
→ Check browser console (F12)
→ Disable other conflicting scripts

### Referral Not Working
→ Check link format
→ Must contain `/invite/`
→ Try copying link again

### Counter Not Incrementing
→ Must complete full sign-up
→ Verification must succeed
→ Check if account was created

### Code Not Auto-filling
→ Wait for email (30-60 seconds)
→ Check "Check Inbox" manually
→ Look for code field on page

---

## 🔐 Security & Privacy

### What's Stored
- ✅ Referral links (local only)
- ✅ Account counters (local only)
- ✅ Email credentials (local only)
- ✅ Verification codes (local only)

### What's NOT Stored
- ❌ No personal data
- ❌ No browsing history
- ❌ No form data from other sites

### External Connections
- Only to Mail.tm API (https://api.mail.tm)
- No other external services

---

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Initial Tampermonkey release
- ✅ Floating draggable menu
- ✅ AddReff referral system
- ✅ 3-account limit tracking
- ✅ Multiple referral management
- ✅ Statistics dashboard
- ✅ All V1 features included
- ✅ Beautiful gradient UI
- ✅ Smooth animations

---

## 🤝 Contributing

Ideas for future versions:
- [ ] Custom account limit per referral
- [ ] Export referral statistics
- [ ] Import referral links from file
- [ ] Keyboard shortcuts
- [ ] Dark theme option
- [ ] Sound notifications
- [ ] Auto-rotation between referrals

---

## 📞 Support

**Issues?**
1. Check Tampermonkey dashboard
2. Check browser console (F12)
3. Try disabling other scripts
4. Reload the page

**Feature Requests?**
Submit your ideas! We're always improving.

---

## ⚠️ Important Notes

### Referral Limits
- **Maximum**: 3 accounts per referral link
- **Enforced**: By the script (can't bypass)
- **Counter**: Automatic (increments on signup)
- **Purpose**: Follow vsphone.com rules

### Best Practices
1. Don't spam referrals
2. Wait between account creations
3. Use legitimate email addresses
4. Follow vsphone.com terms of service

### Legal
- For educational purposes
- Use responsibly
- Respect platform rules
- Don't abuse the system

---

**Tdjs-AutoReg V2** - Complete automation with referral management! 🚀

Made with ❤️ for smart automation

*Now with AddReff - because why do it manually when you can automate? 😉*
