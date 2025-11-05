// Popup script for extension UI
document.addEventListener('DOMContentLoaded', async () => {
  const createEmailBtn = document.getElementById('createEmailBtn');
  const autoFillBtn = document.getElementById('autoFillBtn');
  const checkInboxBtn = document.getElementById('checkInboxBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyPasswordBtn = document.getElementById('copyPasswordBtn');
  const emailStatus = document.getElementById('emailStatus');
  const inboxContainer = document.getElementById('inboxContainer');
  
  // Load existing email if any
  loadEmailStatus();
  
  // Create Email button
  createEmailBtn.addEventListener('click', async () => {
    createEmailBtn.disabled = true;
    createEmailBtn.innerHTML = '<span class="btn-icon">⏳</span> Creating...';
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'createEmail' });
      
      if (response.success) {
        showStatus(
          `✅ Email: ${response.email}<br>🔑 Password: ${response.password}`,
          'success'
        );
        
        // Enable buttons
        autoFillBtn.disabled = false;
        checkInboxBtn.disabled = false;
        copyEmailBtn.disabled = false;
        copyPasswordBtn.disabled = false;
        
        // Show success message
        showNotification('Email created successfully!');
      } else {
        showStatus(`❌ Error: ${response.error}`, 'error');
      }
    } catch (error) {
      showStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
      createEmailBtn.disabled = false;
      createEmailBtn.innerHTML = '<span class="btn-icon">➕</span> Create New Email';
    }
  });
  
  // Auto-fill button
  autoFillBtn.addEventListener('click', async () => {
    autoFillBtn.disabled = true;
    autoFillBtn.innerHTML = '<span class="btn-icon">⏳</span> Filling...';
    
    try {
      // Get current email
      const storage = await chrome.storage.local.get(['email', 'password']);
      
      if (!storage.email || !storage.password) {
        showNotification('Please create an email first', 'error');
        return;
      }
      
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we're on vsphone.com
      if (!tab.url.includes('vsphone.com')) {
        showNotification('Please navigate to cloud.vsphone.com signup page first', 'error');
        return;
      }
      
      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        email: storage.email,
        password: storage.password
      });
      
      if (response.success) {
        showNotification('Form filled successfully!');
      } else {
        showNotification('Error filling form: ' + response.error, 'error');
      }
    } catch (error) {
      showNotification('Error: ' + error.message, 'error');
    } finally {
      autoFillBtn.disabled = false;
      autoFillBtn.innerHTML = '<span class="btn-icon">🎯</span> Auto-fill Sign-up Form';
    }
  });
  
  // Check Inbox button
  checkInboxBtn.addEventListener('click', async () => {
    checkInboxBtn.disabled = true;
    checkInboxBtn.innerHTML = '<span class="btn-icon">⏳</span> Checking...';
    inboxContainer.innerHTML = '<div class="loading">Loading inbox</div>';
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'checkInbox' });
      
      if (response.success) {
        if (response.messages.length === 0) {
          inboxContainer.innerHTML = '<p class="info-text">📭 No messages yet</p>';
        } else {
          displayMessages(response.messages);
        }
        showNotification(`Found ${response.messages.length} message(s)`);
      } else {
        inboxContainer.innerHTML = `<p class="info-text">❌ ${response.error}</p>`;
      }
    } catch (error) {
      inboxContainer.innerHTML = `<p class="info-text">❌ Error: ${error.message}</p>`;
    } finally {
      checkInboxBtn.disabled = false;
      checkInboxBtn.innerHTML = '<span class="btn-icon">🔄</span> Check Inbox';
    }
  });
  
  // Copy Email button
  copyEmailBtn.addEventListener('click', async () => {
    const storage = await chrome.storage.local.get(['email']);
    if (storage.email) {
      await navigator.clipboard.writeText(storage.email);
      showNotification('Email copied to clipboard!');
    }
  });
  
  // Copy Password button
  copyPasswordBtn.addEventListener('click', async () => {
    const storage = await chrome.storage.local.get(['password']);
    if (storage.password) {
      await navigator.clipboard.writeText(storage.password);
      showNotification('Password copied to clipboard!');
    }
  });
  
  // Helper functions
  async function loadEmailStatus() {
    const storage = await chrome.storage.local.get(['email', 'password', 'token']);
    
    if (storage.email) {
      showStatus(
        `✅ Email: ${storage.email}<br>🔑 Password: ${storage.password}`,
        'success'
      );
      
      // Enable buttons
      autoFillBtn.disabled = false;
      checkInboxBtn.disabled = false;
      copyEmailBtn.disabled = false;
      copyPasswordBtn.disabled = false;
    }
  }
  
  function showStatus(message, type = '') {
    emailStatus.innerHTML = `<p class="status-text">${message}</p>`;
    emailStatus.className = 'status-box';
    if (type) {
      emailStatus.classList.add(type);
    }
  }
  
  function displayMessages(messages) {
    if (messages.length === 0) {
      inboxContainer.innerHTML = '<p class="info-text">📭 No messages yet</p>';
      return;
    }
    
    inboxContainer.innerHTML = '';
    
    messages.forEach((message, index) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message-item';
      
      const from = message.from?.address || 'Unknown';
      const subject = message.subject || '(No subject)';
      const date = new Date(message.createdAt).toLocaleString();
      
      messageDiv.innerHTML = `
        <div class="message-from">📧 ${from}</div>
        <div class="message-subject">${subject}</div>
        <div class="message-date">🕒 ${date}</div>
      `;
      
      messageDiv.addEventListener('click', async () => {
        try {
          const response = await chrome.runtime.sendMessage({
            action: 'getMessage',
            messageId: message.id
          });
          
          if (response.success) {
            showMessageDetails(response.message);
          }
        } catch (error) {
          showNotification('Error loading message: ' + error.message, 'error');
        }
      });
      
      inboxContainer.appendChild(messageDiv);
    });
  }
  
  function showMessageDetails(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 20px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    `;
    
    content.innerHTML = `
      <h3 style="margin-bottom: 15px; color: #333;">📧 ${message.subject || '(No subject)'}</h3>
      <p style="font-size: 12px; color: #666; margin-bottom: 10px;"><strong>From:</strong> ${message.from.address}</p>
      <p style="font-size: 12px; color: #666; margin-bottom: 10px;"><strong>To:</strong> ${message.to[0].address}</p>
      <p style="font-size: 12px; color: #666; margin-bottom: 15px;"><strong>Date:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
      <div style="border-top: 1px solid #eee; padding-top: 15px; font-size: 13px; line-height: 1.6;">
        ${message.html || message.text || '(No content)'}
      </div>
      <button id="closeModal" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">Close</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    content.querySelector('#closeModal').addEventListener('click', () => {
      modal.remove();
    });
  }
  
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 12px 20px;
      background: ${type === 'error' ? '#f44336' : '#4CAF50'};
      color: white;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});
