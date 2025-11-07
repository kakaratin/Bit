// Tdjs-AutoReg - Background service worker for mail.tm API integration
const MAILTM_API = 'https://api.mail.tm';
const PASSWORD = 'TdjsCloudPhone0909';

// Verification code patterns (various formats)
const VERIFICATION_CODE_PATTERNS = [
  /\b(\d{4,8})\b/g,                           // 4-8 digit codes
  /code[:\s]+([0-9]{4,8})/gi,                 // "code: 123456"
  /verification[:\s]+([0-9]{4,8})/gi,         // "verification: 123456"
  /confirm[:\s]+([0-9]{4,8})/gi,              // "confirm: 123456"
  /OTP[:\s]+([0-9]{4,8})/gi,                  // "OTP: 123456"
  /pin[:\s]+([0-9]{4,8})/gi,                  // "pin: 123456"
  /\b([A-Z0-9]{4,8})\b/g,                     // Alphanumeric codes
];

// Helper function to get available domains
async function getDomains() {
  try {
    const response = await fetch(`${MAILTM_API}/domains`);
    const data = await response.json();
    return data['hydra:member'];
  } catch (error) {
    console.error('Error fetching domains:', error);
    return [];
  }
}

// Helper function to create account
async function createAccount(address) {
  try {
    const response = await fetch(`${MAILTM_API}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: address,
        password: PASSWORD
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create account: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

// Helper function to get auth token
async function getToken(address) {
  try {
    const response = await fetch(`${MAILTM_API}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: address,
        password: PASSWORD
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

// Helper function to get messages
async function getMessages(token) {
  try {
    const response = await fetch(`${MAILTM_API}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data['hydra:member'];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Helper function to get full message by ID
async function getMessage(token, messageId) {
  try {
    const response = await fetch(`${MAILTM_API}/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch message: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching message:', error);
    throw error;
  }
}

// Main function to create a new email
async function createNewEmail() {
  try {
    const domains = await getDomains();
    if (domains.length === 0) {
      throw new Error('No domains available');
    }
    
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomUsername = `user${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const emailAddress = `${randomUsername}@${randomDomain.domain}`;
    
    const account = await createAccount(emailAddress);
    const token = await getToken(emailAddress);
    
    // Store email session in chrome storage
    await chrome.storage.local.set({
      email: emailAddress,
      token: token,
      accountId: account.id,
      password: PASSWORD,
      createdAt: Date.now(),
      lastMessageCount: 0
    });
    
    // Start monitoring inbox for verification codes
    startInboxMonitoring();
    
    return {
      success: true,
      email: emailAddress,
      password: PASSWORD,
      token: token
    };
  } catch (error) {
    console.error('Error creating new email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to check inbox
async function checkInbox() {
  try {
    const storage = await chrome.storage.local.get(['token', 'email']);
    
    if (!storage.token) {
      throw new Error('No active email session');
    }
    
    const messages = await getMessages(storage.token);
    return {
      success: true,
      messages: messages,
      email: storage.email
    };
  } catch (error) {
    console.error('Error checking inbox:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to extract verification code from text
function extractVerificationCode(text) {
  if (!text) return null;
  
  // Try each pattern
  for (const pattern of VERIFICATION_CODE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Get the first match and clean it up
      let code = matches[0];
      
      // If it's from a labeled pattern (like "code: 123456"), extract just the number
      if (code.includes(':')) {
        code = code.split(':')[1].trim();
      }
      
      // Verify it's a reasonable verification code (4-8 characters)
      if (code.length >= 4 && code.length <= 8) {
        console.log('Extracted verification code:', code);
        return code;
      }
    }
  }
  
  return null;
}

// Function to get full message content
async function getFullMessage(messageId) {
  try {
    const storage = await chrome.storage.local.get(['token']);
    
    if (!storage.token) {
      throw new Error('No active email session');
    }
    
    const message = await getMessage(storage.token, messageId);
    
    // Extract verification code if present
    const fullText = `${message.subject || ''} ${message.intro || ''} ${message.text || ''}`;
    const verificationCode = extractVerificationCode(fullText);
    
    if (verificationCode) {
      // Store the verification code
      await chrome.storage.local.set({ verificationCode: verificationCode });
      console.log('Verification code stored:', verificationCode);
    }
    
    return {
      success: true,
      message: message,
      verificationCode: verificationCode
    };
  } catch (error) {
    console.error('Error getting message:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to monitor inbox for verification codes
async function monitorInboxForVerification() {
  try {
    const storage = await chrome.storage.local.get(['token', 'lastMessageCount']);
    
    if (!storage.token) {
      return { success: false, error: 'No active email session' };
    }
    
    const messages = await getMessages(storage.token);
    const currentCount = messages.length;
    const lastCount = storage.lastMessageCount || 0;
    
    // Update the message count
    await chrome.storage.local.set({ lastMessageCount: currentCount });
    
    // Check if there are new messages
    if (currentCount > lastCount) {
      console.log('New message(s) detected!');
      
      // Get the latest message
      const latestMessage = messages[0];
      if (latestMessage) {
        const fullMessage = await getMessage(storage.token, latestMessage.id);
        const fullText = `${fullMessage.subject || ''} ${fullMessage.intro || ''} ${fullMessage.text || ''}`;
        const verificationCode = extractVerificationCode(fullText);
        
        if (verificationCode) {
          // Store verification code and notify
          await chrome.storage.local.set({ 
            verificationCode: verificationCode,
            verificationCodeTimestamp: Date.now()
          });
          
          // Notify all tabs
          chrome.tabs.query({ url: 'https://cloud.vsphone.com/*' }, (tabs) => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, {
                action: 'verificationCodeReceived',
                code: verificationCode
              }).catch(() => {
                // Tab might not have content script loaded, ignore error
              });
            });
          });
          
          return {
            success: true,
            verificationCode: verificationCode,
            newMessages: true
          };
        }
      }
    }
    
    return {
      success: true,
      newMessages: false
    };
  } catch (error) {
    console.error('Error monitoring inbox:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Start periodic inbox monitoring when email is created
let monitoringInterval = null;

function startInboxMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
  
  console.log('Starting inbox monitoring for verification codes...');
  
  // Check every 10 seconds
  monitoringInterval = setInterval(() => {
    monitorInboxForVerification();
  }, 10000);
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createEmail') {
    createNewEmail().then(sendResponse);
    return true; // Will respond asynchronously
  } else if (request.action === 'getEmail') {
    chrome.storage.local.get(['email', 'password', 'token', 'verificationCode']).then(sendResponse);
    return true;
  } else if (request.action === 'checkInbox') {
    checkInbox().then(sendResponse);
    return true;
  } else if (request.action === 'getMessage') {
    getFullMessage(request.messageId).then(sendResponse);
    return true;
  } else if (request.action === 'monitorInbox') {
    monitorInboxForVerification().then(sendResponse);
    return true;
  } else if (request.action === 'startMonitoring') {
    startInboxMonitoring();
    sendResponse({ success: true });
    return true;
  } else if (request.action === 'getVerificationCode') {
    chrome.storage.local.get(['verificationCode']).then(sendResponse);
    return true;
  }
});

// Auto-start monitoring if there's an active email session
chrome.storage.local.get(['email', 'token'], (storage) => {
  if (storage.email && storage.token) {
    console.log('Tdjs-AutoReg: Resuming inbox monitoring for existing session');
    startInboxMonitoring();
  }
});

console.log('Tdjs-AutoReg Extension loaded');
