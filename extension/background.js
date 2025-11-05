// Background service worker for mail.tm API integration
const MAILTM_API = 'https://api.mail.tm';
const PASSWORD = 'TdjsCloudPhone0909';

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
      createdAt: Date.now()
    });
    
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

// Function to get full message content
async function getFullMessage(messageId) {
  try {
    const storage = await chrome.storage.local.get(['token']);
    
    if (!storage.token) {
      throw new Error('No active email session');
    }
    
    const message = await getMessage(storage.token, messageId);
    return {
      success: true,
      message: message
    };
  } catch (error) {
    console.error('Error getting message:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createEmail') {
    createNewEmail().then(sendResponse);
    return true; // Will respond asynchronously
  } else if (request.action === 'getEmail') {
    chrome.storage.local.get(['email', 'password', 'token']).then(sendResponse);
    return true;
  } else if (request.action === 'checkInbox') {
    checkInbox().then(sendResponse);
    return true;
  } else if (request.action === 'getMessage') {
    getFullMessage(request.messageId).then(sendResponse);
    return true;
  }
});

console.log('Vsphone Auto Sign-up Extension loaded');
