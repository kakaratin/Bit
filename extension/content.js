// Tdjs-AutoReg - Content script for auto-filling vsphone.com signup form and verification codes

console.log('Tdjs-AutoReg content script loaded');

// Function to wait for element to appear
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);
  });
}

// Function to fill input field
function fillInput(element, value) {
  if (!element) return false;
  
  // Focus the element
  element.focus();
  
  // Set the value
  element.value = value;
  
  // Trigger input events
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
  
  return true;
}

// Function to click element
function clickElement(element) {
  if (!element) return false;
  
  element.click();
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  
  return true;
}

// Function to auto-fill the sign-up form
async function autoFillSignupForm(email, password) {
  try {
    console.log('Starting auto-fill process...');
    
    // Common selectors for email/username input
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[name="username"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email" i]',
      'input[id*="email" i]',
      'input[id*="Email" i]'
    ];
    
    // Common selectors for password input
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[placeholder*="password" i]',
      'input[id*="password" i]'
    ];
    
    // Common selectors for confirm password
    const confirmPasswordSelectors = [
      'input[name="confirm_password"]',
      'input[name="confirmPassword"]',
      'input[name="password_confirmation"]',
      'input[placeholder*="confirm" i]',
      'input[id*="confirm" i]'
    ];
    
    // Try to find and fill email field
    let emailField = null;
    for (const selector of emailSelectors) {
      emailField = document.querySelector(selector);
      if (emailField) {
        console.log(`Found email field with selector: ${selector}`);
        break;
      }
    }
    
    if (!emailField) {
      console.warn('Email field not found');
      return { success: false, error: 'Email field not found' };
    }
    
    // Fill email
    fillInput(emailField, email);
    console.log('Email filled');
    
    // Wait a bit for any dynamic fields to appear
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to find and fill password field
    let passwordField = null;
    for (const selector of passwordSelectors) {
      const fields = document.querySelectorAll(selector);
      // Get the first password field
      if (fields.length > 0) {
        passwordField = fields[0];
        console.log(`Found password field with selector: ${selector}`);
        break;
      }
    }
    
    if (!passwordField) {
      console.warn('Password field not found');
      return { success: false, error: 'Password field not found' };
    }
    
    // Fill password
    fillInput(passwordField, password);
    console.log('Password filled');
    
    // Try to find and fill confirm password field
    let confirmPasswordField = null;
    for (const selector of confirmPasswordSelectors) {
      confirmPasswordField = document.querySelector(selector);
      if (confirmPasswordField) {
        console.log(`Found confirm password field with selector: ${selector}`);
        break;
      }
    }
    
    // If there are multiple password fields, the second one might be confirm password
    const allPasswordFields = document.querySelectorAll('input[type="password"]');
    if (allPasswordFields.length > 1 && !confirmPasswordField) {
      confirmPasswordField = allPasswordFields[1];
      console.log('Using second password field as confirm password');
    }
    
    if (confirmPasswordField) {
      fillInput(confirmPasswordField, password);
      console.log('Confirm password filled');
    }
    
    // Look for checkboxes (terms of service, etc.)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      if (!checkbox.checked) {
        checkbox.click();
        console.log(`Checked checkbox ${index + 1}`);
      }
    });
    
    // Show notification
    showNotification('Form filled successfully!', 'success');
    
    return { success: true };
    
  } catch (error) {
    console.error('Error auto-filling form:', error);
    showNotification('Error filling form: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

// Function to show notification on page
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existing = document.getElementById('vsphone-autofill-notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = 'vsphone-autofill-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 999999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Function to detect verification code input fields
function findVerificationCodeField() {
  // Common selectors for verification/OTP fields
  const selectors = [
    'input[name*="code"]',
    'input[name*="verify"]',
    'input[name*="verification"]',
    'input[name*="otp"]',
    'input[name*="pin"]',
    'input[id*="code"]',
    'input[id*="verify"]',
    'input[id*="verification"]',
    'input[id*="otp"]',
    'input[id*="pin"]',
    'input[placeholder*="code" i]',
    'input[placeholder*="verify" i]',
    'input[placeholder*="verification" i]',
    'input[placeholder*="OTP" i]',
    'input[type="text"][maxlength="6"]',
    'input[type="text"][maxlength="4"]',
    'input[type="number"][maxlength="6"]',
    'input[type="number"][maxlength="4"]'
  ];
  
  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field && field.offsetParent !== null) { // Check if visible
      return field;
    }
  }
  
  return null;
}

// Function to auto-fill verification code
async function autoFillVerificationCode(code) {
  console.log('Attempting to auto-fill verification code:', code);
  
  // Try to find verification code field
  let codeField = findVerificationCodeField();
  
  // If not found immediately, wait for it
  if (!codeField) {
    try {
      await waitForElement('input[name*="code"], input[name*="verify"], input[placeholder*="code" i]', 15000);
      codeField = findVerificationCodeField();
    } catch (error) {
      console.log('Verification code field not found on page');
      return { success: false, message: 'Verification code field not found' };
    }
  }
  
  if (codeField) {
    fillInput(codeField, code);
    showNotification(`✅ Verification code filled: ${code}`, 'success');
    
    // Try to find and click submit/verify button
    setTimeout(() => {
      const submitButtons = [
        'button[type="submit"]',
        'button:contains("Verify")',
        'button:contains("Submit")',
        'button:contains("Confirm")',
        'input[type="submit"]'
      ];
      
      for (const selector of submitButtons) {
        const button = document.querySelector(selector);
        if (button && button.offsetParent !== null) {
          console.log('Found submit button, clicking...');
          button.click();
          break;
        }
      }
    }, 500);
    
    return { success: true, message: 'Verification code filled' };
  }
  
  return { success: false, message: 'Could not find verification code field' };
}

// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    autoFillSignupForm(request.email, request.password).then(sendResponse);
    return true; // Will respond asynchronously
  } else if (request.action === 'detectForm') {
    // Check if we're on a signup/register page
    const hasEmailField = !!document.querySelector('input[type="email"], input[name="email"]');
    const hasPasswordField = !!document.querySelector('input[type="password"]');
    
    sendResponse({
      isSignupPage: hasEmailField && hasPasswordField,
      url: window.location.href
    });
  } else if (request.action === 'verificationCodeReceived') {
    // Automatically fill verification code when received
    console.log('Received verification code from background:', request.code);
    autoFillVerificationCode(request.code).then(sendResponse);
    return true;
  } else if (request.action === 'fillVerificationCode') {
    // Manual verification code fill request
    autoFillVerificationCode(request.code).then(sendResponse);
    return true;
  }
});

// Auto-detect and show helper button on signup pages
function addAutoFillButton() {
  // Check if we're on a signup page
  const hasEmailField = document.querySelector('input[type="email"], input[name="email"]');
  const hasPasswordField = document.querySelector('input[type="password"]');
  
  if (hasEmailField && hasPasswordField && !document.getElementById('vsphone-autofill-btn')) {
    const button = document.createElement('button');
    button.id = 'vsphone-autofill-btn';
    button.textContent = '🚀 Tdjs-AutoReg';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      transition: transform 0.2s, box-shadow 0.2s;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
      button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
    
    button.addEventListener('click', async () => {
      button.disabled = true;
      button.textContent = '⏳ Creating email...';
      
      try {
        // Request new email from background script
        const response = await chrome.runtime.sendMessage({ action: 'createEmail' });
        
        if (response.success) {
          button.textContent = '✅ Filling form...';
          await autoFillSignupForm(response.email, response.password);
          button.textContent = '✅ Done!';
          
          setTimeout(() => {
            button.textContent = '🚀 Tdjs-AutoReg';
            button.disabled = false;
          }, 3000);
        } else {
          throw new Error(response.error || 'Failed to create email');
        }
      } catch (error) {
        console.error('Error:', error);
        showNotification('Error: ' + error.message, 'error');
        button.textContent = '❌ Error';
        setTimeout(() => {
          button.textContent = '🚀 Tdjs-AutoReg';
          button.disabled = false;
        }, 3000);
      }
    });
    
    document.body.appendChild(button);
  }
}

// Wait for page to load and add button
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addAutoFillButton);
} else {
  addAutoFillButton();
}

// Also observe for dynamic content
const observer = new MutationObserver((mutations) => {
  addAutoFillButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
