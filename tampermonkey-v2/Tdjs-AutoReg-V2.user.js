// ==UserScript==
// @name         Tdjs-AutoReg V2 - Vsphone Auto Sign-up with Referral System
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  FULLY AUTOMATED: Click referral → 3 accounts created automatically → ReffBuff complete! Floating ball menu. BUGFIX: Delete button now works!
// @author       Tdjs
// @match        https://cloud.vsphone.com/*
// @match        https://www.vsphone.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @connect      api.mail.tm
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 Tdjs-AutoReg V2 loaded');

    // Configuration
    const MAILTM_API = 'https://api.mail.tm';
    const PASSWORD = 'TdjsCloudPhone0909';
    const MAX_ACCOUNTS_PER_REFERRAL = 3;
    const INBOX_CHECK_INTERVAL = 10000; // 10 seconds
    const ACCOUNT_CREATION_DELAY = 5000; // 5 seconds between accounts
    
    // Automation state
    let isAutoCreating = false;
    let currentReferralCode = null;
    let accountsCreatedInBatch = 0;

    // Verification code patterns
    const VERIFICATION_CODE_PATTERNS = [
        /\b(\d{4,8})\b/g,
        /code[:\s]+([0-9]{4,8})/gi,
        /verification[:\s]+([0-9]{4,8})/gi,
        /confirm[:\s]+([0-9]{4,8})/gi,
        /OTP[:\s]+([0-9]{4,8})/gi,
        /pin[:\s]+([0-9]{4,8})/gi,
        /\b([A-Z0-9]{4,8})\b/g
    ];

    // State management
    let currentEmail = GM_getValue('currentEmail', null);
    let currentPassword = GM_getValue('currentPassword', PASSWORD);
    let currentToken = GM_getValue('currentToken', null);
    let verificationCode = GM_getValue('verificationCode', null);
    let monitoringInterval = null;
    let referralLinks = GM_getValue('referralLinks', []);

    // ====================================
    // MAIL.TM API FUNCTIONS
    // ====================================

    async function apiRequest(url, method = 'GET', data = null, token = null) {
        return new Promise((resolve, reject) => {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: data ? JSON.stringify(data) : null,
                onload: (response) => {
                    try {
                        const result = JSON.parse(response.responseText);
                        resolve(result);
                    } catch (e) {
                        resolve(response.responseText);
                    }
                },
                onerror: (error) => reject(error)
            });
        });
    }

    async function getDomains() {
        const data = await apiRequest(`${MAILTM_API}/domains`);
        return data['hydra:member'] || [];
    }

    async function createAccount(address, password) {
        return await apiRequest(`${MAILTM_API}/accounts`, 'POST', {
            address: address,
            password: password
        });
    }

    async function getToken(address, password) {
        const data = await apiRequest(`${MAILTM_API}/token`, 'POST', {
            address: address,
            password: password
        });
        return data.token;
    }

    async function getMessages(token) {
        const data = await apiRequest(`${MAILTM_API}/messages`, 'GET', null, token);
        return data['hydra:member'] || [];
    }

    async function getMessage(token, messageId) {
        return await apiRequest(`${MAILTM_API}/messages/${messageId}`, 'GET', null, token);
    }

    async function createNewEmail() {
        try {
            const domains = await getDomains();
            if (domains.length === 0) throw new Error('No domains available');

            const randomDomain = domains[Math.floor(Math.random() * domains.length)];
            const randomUsername = `user${Date.now()}${Math.floor(Math.random() * 1000)}`;
            const emailAddress = `${randomUsername}@${randomDomain.domain}`;

            const account = await createAccount(emailAddress, PASSWORD);
            const token = await getToken(emailAddress, PASSWORD);

            // Save to GM storage
            GM_setValue('currentEmail', emailAddress);
            GM_setValue('currentPassword', PASSWORD);
            GM_setValue('currentToken', token);
            GM_setValue('lastMessageCount', 0);

            currentEmail = emailAddress;
            currentPassword = PASSWORD;
            currentToken = token;

            startInboxMonitoring();

            return { success: true, email: emailAddress, password: PASSWORD };
        } catch (error) {
            console.error('Error creating email:', error);
            return { success: false, error: error.message };
        }
    }

    // ====================================
    // VERIFICATION CODE FUNCTIONS
    // ====================================

    function extractVerificationCode(text) {
        if (!text) return null;

        for (const pattern of VERIFICATION_CODE_PATTERNS) {
            const matches = text.match(pattern);
            if (matches && matches.length > 0) {
                let code = matches[0];
                if (code.includes(':')) {
                    code = code.split(':')[1].trim();
                }
                if (code.length >= 4 && code.length <= 8) {
                    return code;
                }
            }
        }
        return null;
    }

    async function monitorInboxForVerification() {
        if (!currentToken) return;

        try {
            const messages = await getMessages(currentToken);
            const lastCount = GM_getValue('lastMessageCount', 0);

            GM_setValue('lastMessageCount', messages.length);

            if (messages.length > lastCount && messages.length > 0) {
                console.log('📧 New message detected!');
                const latestMessage = messages[0];
                const fullMessage = await getMessage(currentToken, latestMessage.id);
                const fullText = `${fullMessage.subject || ''} ${fullMessage.intro || ''} ${fullMessage.text || ''}`;
                const code = extractVerificationCode(fullText);

                if (code) {
                    GM_setValue('verificationCode', code);
                    verificationCode = code;
                    console.log('🔐 Verification code detected:', code);
                    showNotification(`Verification code detected: ${code}`, 'success');
                    updateMenuUI();
                    
                    // Auto-fill if verification field exists
                    setTimeout(() => autoFillVerificationCode(code), 1000);
                }
            }
        } catch (error) {
            console.error('Error monitoring inbox:', error);
        }
    }

    function startInboxMonitoring() {
        if (monitoringInterval) clearInterval(monitoringInterval);
        console.log('🔄 Starting inbox monitoring...');
        monitoringInterval = setInterval(monitorInboxForVerification, INBOX_CHECK_INTERVAL);
    }

    // ====================================
    // FORM FILLING FUNCTIONS
    // ====================================

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
        });
    }

    function fillInput(element, value) {
        if (!element) return false;
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        return true;
    }

    async function autoFillSignupForm(email, password, referralCode = null) {
        try {
            // Determine if we're on referral page
            const isReferralPage = window.location.href.includes('/invite/') || referralCode;
            
            console.log('🎯 Starting form fill...', { isReferralPage, referralCode });

            // Email field
            const emailSelectors = [
                'input[type="email"]',
                'input[name="email"]',
                'input[id*="email"]',
                'input[placeholder*="email" i]'
            ];

            let emailField = null;
            for (const selector of emailSelectors) {
                emailField = document.querySelector(selector);
                if (emailField) break;
            }

            if (emailField) {
                fillInput(emailField, email);
                console.log('✅ Email filled');
            }

            // Password fields
            const passwordFields = document.querySelectorAll('input[type="password"]');
            if (passwordFields.length >= 1) {
                fillInput(passwordFields[0], password);
                console.log('✅ Password filled');
            }
            if (passwordFields.length >= 2) {
                fillInput(passwordFields[1], password);
                console.log('✅ Confirm password filled');
            }

            // Terms checkbox
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (!cb.checked) cb.click();
            });

            showNotification('✅ Form filled successfully!', 'success');
            return { success: true };
        } catch (error) {
            console.error('Error filling form:', error);
            showNotification('Error filling form: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    function findVerificationCodeField() {
        const selectors = [
            'input[name*="code"]', 'input[name*="verify"]', 'input[name*="verification"]',
            'input[name*="otp"]', 'input[name*="pin"]',
            'input[id*="code"]', 'input[id*="verify"]', 'input[id*="otp"]',
            'input[placeholder*="code" i]', 'input[placeholder*="verify" i]',
            'input[type="text"][maxlength="6"]', 'input[type="text"][maxlength="4"]'
        ];

        for (const selector of selectors) {
            const field = document.querySelector(selector);
            if (field && field.offsetParent !== null) return field;
        }
        return null;
    }

    async function autoFillVerificationCode(code) {
        let codeField = findVerificationCodeField();

        if (!codeField) {
            try {
                await waitForElement('input[name*="code"], input[placeholder*="code" i]', 15000);
                codeField = findVerificationCodeField();
            } catch (error) {
                console.log('Verification code field not found');
                return;
            }
        }

        if (codeField) {
            fillInput(codeField, code);
            showNotification(`✅ Verification code filled: ${code}`, 'success');

            // Try to click submit
            setTimeout(() => {
                const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
                if (submitButtons.length > 0) {
                    submitButtons[0].click();
                }
            }, 500);
        }
    }

    // ====================================
    // REFERRAL LINK MANAGEMENT
    // ====================================

    function extractReferralCode(url) {
        const match = url.match(/\/invite\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    function addReferralLink(url) {
        const code = extractReferralCode(url);
        if (!code) {
            showNotification('Invalid referral link format', 'error');
            return false;
        }

        let links = GM_getValue('referralLinks', []);
        
        // Check if already exists
        const existing = links.find(l => l.code === code);
        if (existing) {
            showNotification('Referral link already exists', 'error');
            return false;
        }

        links.push({
            code: code,
            url: url,
            accountsCreated: 0,
            addedAt: Date.now()
        });

        GM_setValue('referralLinks', links);
        referralLinks = links;
        updateMenuUI();
        showNotification('✅ Referral link added!', 'success');
        return true;
    }

    function getNextAvailableReferral() {
        const links = GM_getValue('referralLinks', []);
        return links.find(l => l.accountsCreated < MAX_ACCOUNTS_PER_REFERRAL);
    }

    function incrementReferralCount(code) {
        let links = GM_getValue('referralLinks', []);
        const link = links.find(l => l.code === code);
        if (link) {
            link.accountsCreated++;
            GM_setValue('referralLinks', links);
            referralLinks = links;
            updateMenuUI();
        }
    }

    function deleteReferralLink(code) {
        let links = GM_getValue('referralLinks', []);
        links = links.filter(l => l.code !== code);
        GM_setValue('referralLinks', links);
        referralLinks = links;
        updateMenuUI();
        showNotification('Referral link deleted', 'success');
    }

    // ====================================
    // FULL AUTOMATION FUNCTIONS
    // ====================================

    async function createAccountForReferral(referralCode) {
        try {
            console.log(`🚀 Creating account ${accountsCreatedInBatch + 1}/3 for referral: ${referralCode}`);
            
            // Create email
            showNotification(`Creating account ${accountsCreatedInBatch + 1}/3...`, 'info');
            const emailResult = await createNewEmail();
            if (!emailResult.success) {
                throw new Error('Failed to create email');
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            // Fill form
            showNotification('Filling form...', 'info');
            await autoFillSignupForm(emailResult.email, emailResult.password);
            
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Try to find and click submit button
            const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"], button:contains("Sign"), button:contains("Register"), button:contains("Submit")');
            if (submitButtons.length > 0) {
                submitButtons[0].click();
                showNotification('Form submitted! Waiting for verification...', 'info');
            }

            // Wait for verification code (max 90 seconds)
            let codeReceived = false;
            for (let i = 0; i < 9; i++) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                await monitorInboxForVerification();
                
                const code = GM_getValue('verificationCode', null);
                if (code) {
                    codeReceived = true;
                    showNotification(`Code received: ${code}`, 'success');
                    await autoFillVerificationCode(code);
                    break;
                }
            }

            if (!codeReceived) {
                showNotification('Timeout waiting for verification code', 'error');
            }

            // Increment counter
            incrementReferralCount(referralCode);
            accountsCreatedInBatch++;
            
            showNotification(`✅ Account ${accountsCreatedInBatch}/3 created!`, 'success');
            
            return true;
        } catch (error) {
            console.error('Error creating account:', error);
            showNotification('Error: ' + error.message, 'error');
            return false;
        }
    }

    async function autoCreateThreeAccounts(referralCode) {
        if (isAutoCreating) {
            showNotification('Already creating accounts...', 'error');
            return;
        }

        const link = referralLinks.find(l => l.code === referralCode);
        if (!link) {
            showNotification('Referral not found', 'error');
            return;
        }

        if (link.accountsCreated >= MAX_ACCOUNTS_PER_REFERRAL) {
            showNotification('This referral is already at 3/3!', 'error');
            return;
        }

        isAutoCreating = true;
        currentReferralCode = referralCode;
        accountsCreatedInBatch = 0;

        showNotification(`🚀 Starting automated creation for: ${referralCode}`, 'info');
        updateMenuUI();

        const accountsToCreate = MAX_ACCOUNTS_PER_REFERRAL - link.accountsCreated;

        for (let i = 0; i < accountsToCreate; i++) {
            if (!isAutoCreating) break; // User cancelled
            
            const success = await createAccountForReferral(referralCode);
            
            if (!success) {
                showNotification(`Failed on account ${i + 1}. Stopping.`, 'error');
                break;
            }

            // Wait before next account (except on last one)
            if (i < accountsToCreate - 1) {
                showNotification(`Waiting ${ACCOUNT_CREATION_DELAY/1000}s before next account...`, 'info');
                await new Promise(resolve => setTimeout(resolve, ACCOUNT_CREATION_DELAY));
            }
        }

        // Check if we completed all 3
        const updatedLink = GM_getValue('referralLinks', []).find(l => l.code === referralCode);
        if (updatedLink && updatedLink.accountsCreated >= MAX_ACCOUNTS_PER_REFERRAL) {
            showReffBuffComplete(referralCode);
        }

        isAutoCreating = false;
        currentReferralCode = null;
        accountsCreatedInBatch = 0;
        updateMenuUI();
    }

    function showReffBuffComplete(referralCode) {
        // Big celebration notification
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 40px 60px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border-radius: 20px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.5);
            z-index: 9999999;
            font-family: Arial, sans-serif;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            animation: bounceIn 0.5s ease-out;
        `;

        celebration.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
            <div>ReffBuff Complete!</div>
            <div style="font-size: 18px; margin-top: 15px; opacity: 0.9;">${referralCode}</div>
            <div style="font-size: 16px; margin-top: 10px;">3/3 Accounts Created ✅</div>
        `;

        document.body.appendChild(celebration);

        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% { transform: translate(-50%, -50%) scale(0); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            celebration.style.animation = 'bounceOut 0.5s ease-out';
            setTimeout(() => celebration.remove(), 500);
        }, 5000);
    }

    function stopAutomation() {
        isAutoCreating = false;
        currentReferralCode = null;
        accountsCreatedInBatch = 0;
        showNotification('Automation stopped', 'info');
        updateMenuUI();
    }

    // ====================================
    // UI FUNCTIONS
    // ====================================

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    function createFloatingMenu() {
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            .tdjs-menu-btn:hover { transform: scale(1.05); }
            .tdjs-menu-btn:active { transform: scale(0.95); }
            .tdjs-referral-item:hover { background: #f5f5f5; }
        `;
        document.head.appendChild(style);

        // Create floating ball button
        const floatingBall = document.createElement('div');
        floatingBall.id = 'tdjs-floating-ball';
        floatingBall.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
            cursor: pointer;
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            transition: all 0.3s ease;
            animation: float 3s ease-in-out infinite;
        `;
        floatingBall.innerHTML = '🚀';
        floatingBall.title = 'Tdjs-AutoReg V2 - Click to open';

        // Hover effect
        floatingBall.addEventListener('mouseenter', () => {
            floatingBall.style.transform = 'scale(1.1)';
            floatingBall.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.7)';
        });
        floatingBall.addEventListener('mouseleave', () => {
            floatingBall.style.transform = 'scale(1)';
            floatingBall.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
        });

        // Create full menu (hidden by default)
        const menu = document.createElement('div');
        menu.id = 'tdjs-autoreg-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 30px;
            width: 380px;
            max-height: 600px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.3);
            z-index: 999997;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            display: none;
            animation: slideInRight 0.3s ease-out;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: white;
        `;
        header.innerHTML = `
            <div style="font-size: 20px; font-weight: bold;">🚀 Tdjs-AutoReg V2</div>
            <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">Full Automation + Referrals</div>
        `;

        const content = document.createElement('div');
        content.id = 'tdjs-menu-content';
        content.style.cssText = `
            padding: 20px;
            max-height: 500px;
            overflow-y: auto;
            color: #333;
        `;

        menu.appendChild(header);
        menu.appendChild(content);

        // Toggle menu on ball click
        floatingBall.addEventListener('click', () => {
            if (menu.style.display === 'none' || menu.style.display === '') {
                menu.style.display = 'block';
                updateMenuUI();
            } else {
                menu.style.display = 'none';
            }
        });

        // Draggable ball
        let isDragging = false;
        let startX, startY;
        
        floatingBall.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - floatingBall.offsetLeft;
            startY = e.clientY - floatingBall.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                floatingBall.style.left = (e.clientX - startX) + 'px';
                floatingBall.style.top = (e.clientY - startY) + 'px';
                floatingBall.style.right = 'auto';
                floatingBall.style.bottom = 'auto';
                
                // Move menu too
                menu.style.right = 'auto';
                menu.style.bottom = 'auto';
                menu.style.left = (e.clientX - startX) + 'px';
                menu.style.top = (e.clientY - startY - menu.offsetHeight - 20) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.body.appendChild(floatingBall);
        document.body.appendChild(menu);

        updateMenuUI();
    }

    function updateMenuUI() {
        const content = document.getElementById('tdjs-menu-content');
        if (!content) return;

        const links = GM_getValue('referralLinks', []);

        content.innerHTML = `
            <!-- Email Section -->
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-weight: 600; margin-bottom: 10px; color: #667eea;">📧 Email Status</div>
                ${currentEmail ? `
                    <div style="font-size: 12px; word-break: break-all; margin-bottom: 5px;">
                        <strong>Email:</strong> ${currentEmail}
                    </div>
                    <div style="font-size: 12px; margin-bottom: 10px;">
                        <strong>Password:</strong> ${currentPassword}
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button class="tdjs-menu-btn" style="flex: 1; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 11px;" onclick="navigator.clipboard.writeText('${currentEmail}')">📋 Copy Email</button>
                        <button class="tdjs-menu-btn" style="flex: 1; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 11px;" onclick="navigator.clipboard.writeText('${currentPassword}')">🔑 Copy Pass</button>
                    </div>
                ` : '<div style="font-size: 12px; color: #999;">No email created yet</div>'}
            </div>

            <!-- Verification Code Section -->
            ${verificationCode ? `
                <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px; color: white;">
                    <div style="font-weight: 600; margin-bottom: 10px;">🔐 Verification Code</div>
                    <div style="font-size: 28px; font-family: 'Courier New', monospace; letter-spacing: 4px; text-align: center; margin: 10px 0; animation: pulse 1s infinite;">
                        ${verificationCode}
                    </div>
                    <button class="tdjs-menu-btn" id="fill-code-btn" style="width: 100%; padding: 10px; background: white; color: #f5576c; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        Fill Code Now
                    </button>
                </div>
            ` : ''}

            <!-- AddReff Section -->
            <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 10px;">
                <div style="font-weight: 600; margin-bottom: 10px; color: #d84315;">🎁 AddReff - Referral Manager</div>
                <div style="font-size: 11px; margin-bottom: 10px; color: #d84315;">
                    Add referral links (max 3 accounts per link)
                </div>
                <input type="text" id="referral-input" placeholder="https://www.vsphone.com/invite/..." 
                    style="width: 100%; padding: 8px; border: 2px solid #d84315; border-radius: 6px; margin-bottom: 8px; font-size: 12px;">
                <button class="tdjs-menu-btn" id="add-referral-btn" style="width: 100%; padding: 10px; background: #d84315; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    ➕ Add Referral Link
                </button>
            </div>

            <!-- Referral Links List -->
            ${links.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <div style="font-weight: 600; margin-bottom: 10px; color: #667eea;">📋 Active Referrals</div>
                    ${links.map(link => `
                        <div class="tdjs-referral-item" style="padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px; transition: background 0.2s;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div style="font-size: 12px; font-weight: 600; color: #667eea;">
                                    ${link.code}
                                </div>
                                <div style="display: flex; gap: 5px; align-items: center;">
                                    <span style="font-size: 11px; padding: 3px 8px; background: ${link.accountsCreated >= MAX_ACCOUNTS_PER_REFERRAL ? '#f44336' : '#4CAF50'}; color: white; border-radius: 10px;">
                                        ${link.accountsCreated}/${MAX_ACCOUNTS_PER_REFERRAL}
                                    </span>
                                    <button class="tdjs-menu-btn tdjs-delete-btn" data-code="${link.code}" style="padding: 4px 8px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 10px;">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div style="font-size: 10px; color: #999; word-break: break-all;">
                                ${link.url}
                            </div>
                            ${link.accountsCreated < MAX_ACCOUNTS_PER_REFERRAL ? `
                                <button class="tdjs-menu-btn" onclick="window.tdjsAutoCreateAccounts('${link.code}')" 
                                    style="width: 100%; margin-top: 8px; padding: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;"
                                    ${isAutoCreating && currentReferralCode === '${link.code}' ? 'disabled' : ''}>
                                    ${isAutoCreating && currentReferralCode === '${link.code}' ? '⏳ Creating...' : '🚀 AUTO-CREATE 3 ACCOUNTS'}
                                </button>
                            ` : '<div style="font-size: 11px; color: #f44336; text-align: center; margin-top: 8px; font-weight: bold;">🎉 ReffBuff COMPLETE</div>'}
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <!-- Automation Status -->
            ${isAutoCreating ? `
                <div style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white; text-align: center;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">⏳ Automation Running...</div>
                    <div style="font-size: 14px; margin-bottom: 15px;">
                        Creating account ${accountsCreatedInBatch}/3 for: ${currentReferralCode}
                    </div>
                    <button class="tdjs-menu-btn" onclick="window.tdjsStopAutomation()" 
                        style="padding: 10px 20px; background: white; color: #f5576c; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        🛑 Stop Automation
                    </button>
                </div>
            ` : ''}

            <!-- Manual Actions (only show if not automating) -->
            ${!isAutoCreating ? `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="tdjs-menu-btn" id="create-email-btn" style="padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                        ➕ Create New Email
                    </button>
                    <button class="tdjs-menu-btn" id="fill-form-btn" style="padding: 12px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;" ${!currentEmail ? 'disabled' : ''}>
                        🎯 Auto-fill Form
                    </button>
                    <button class="tdjs-menu-btn" id="check-inbox-btn" style="padding: 12px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;" ${!currentEmail ? 'disabled' : ''}>
                        📬 Check Inbox
                    </button>
                </div>
            ` : ''}

            <!-- Stats -->
            <div style="margin-top: 20px; padding: 12px; background: #f8f9fa; border-radius: 8px; font-size: 11px; color: #666; text-align: center;">
                <div><strong>Total Referrals:</strong> ${links.length}</div>
                <div><strong>Total Accounts:</strong> ${links.reduce((sum, l) => sum + l.accountsCreated, 0)}</div>
                <div><strong>Available Slots:</strong> ${links.reduce((sum, l) => sum + (MAX_ACCOUNTS_PER_REFERRAL - l.accountsCreated), 0)}</div>
            </div>
        `;

        // Global stop function
        window.tdjsStopAutomation = stopAutomation;

        // Add delete button listeners (for all delete buttons)
        const deleteButtons = document.querySelectorAll('.tdjs-delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-code') || e.target.closest('button').getAttribute('data-code');
                if (code) {
                    if (confirm(`Delete referral ${code}?`)) {
                        deleteReferralLink(code);
                    }
                }
            });
        });

        // Add event listeners
        const createBtn = document.getElementById('create-email-btn');
        if (createBtn && !isAutoCreating) {
            createBtn.addEventListener('click', async () => {
                createBtn.disabled = true;
                createBtn.textContent = '⏳ Creating...';
                const result = await createNewEmail();
                if (result.success) {
                    showNotification('✅ Email created!', 'success');
                    updateMenuUI();
                } else {
                    showNotification('Error: ' + result.error, 'error');
                }
                createBtn.disabled = false;
                createBtn.textContent = '➕ Create New Email';
            });
        }

        const fillBtn = document.getElementById('fill-form-btn');
        if (fillBtn && currentEmail) {
            fillBtn.addEventListener('click', () => {
                autoFillSignupForm(currentEmail, currentPassword);
            });
        }

        const checkInboxBtn = document.getElementById('check-inbox-btn');
        if (checkInboxBtn && currentToken) {
            checkInboxBtn.addEventListener('click', async () => {
                checkInboxBtn.disabled = true;
                checkInboxBtn.textContent = '⏳ Checking...';
                await monitorInboxForVerification();
                checkInboxBtn.disabled = false;
                checkInboxBtn.textContent = '📬 Check Inbox';
            });
        }

        const addReferralBtn = document.getElementById('add-referral-btn');
        if (addReferralBtn) {
            addReferralBtn.addEventListener('click', () => {
                const input = document.getElementById('referral-input');
                if (input.value.trim()) {
                    addReferralLink(input.value.trim());
                    input.value = '';
                }
            });
        }

        const fillCodeBtn = document.getElementById('fill-code-btn');
        if (fillCodeBtn && verificationCode) {
            fillCodeBtn.addEventListener('click', () => {
                autoFillVerificationCode(verificationCode);
            });
        }
    }

    // Global functions for onclick handlers - Make them REALLY global
    window.tdjsDeleteReferral = (code) => {
        console.log('Delete referral called for:', code);
        if (confirm(`Delete referral ${code}?`)) {
            deleteReferralLink(code);
        }
    };
    
    window.tdjsAutoCreateAccounts = (code) => {
        const links = GM_getValue('referralLinks', []);
        const link = links.find(l => l.code === code);
        if (link && link.accountsCreated < MAX_ACCOUNTS_PER_REFERRAL) {
            // First, navigate to the referral link
            window.location.href = link.url;
            
            // Wait for page load, then start automation
            setTimeout(() => {
                autoCreateThreeAccounts(code);
            }, 3000);
        } else {
            showNotification('This referral is already complete or not found!', 'error');
        }
    };

    // ====================================
    // INITIALIZATION
    // ====================================

    function initialize() {
        // Load saved state
        currentEmail = GM_getValue('currentEmail', null);
        currentPassword = GM_getValue('currentPassword', PASSWORD);
        currentToken = GM_getValue('currentToken', null);
        verificationCode = GM_getValue('verificationCode', null);
        referralLinks = GM_getValue('referralLinks', []);

        // Start monitoring if email exists
        if (currentToken) {
            startInboxMonitoring();
        }

        // Create floating menu
        setTimeout(() => {
            createFloatingMenu();
        }, 1000);

        console.log('✅ Tdjs-AutoReg V2 initialized');
    }

    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
