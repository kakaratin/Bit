// ==UserScript==
// @name         Tdjs-AutoReg V2.3 - Simple with Slide Captcha Solver
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  Simple auto sign-up with SLIDE CAPTCHA SOLVER! No buff nonsense, just clean automation.
// @author       Tdjs
// @match        https://cloud.vsphone.com/*
// @match        https://www.vsphone.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.mail.tm
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 Tdjs-AutoReg V2.3 loaded - Simple & Clean!');

    // Configuration
    const MAILTM_API = 'https://api.mail.tm';
    const PASSWORD = 'TdjsCloudPhone0909';
    const INBOX_CHECK_INTERVAL = 10000; // 10 seconds

    // Current session
    let currentEmail = GM_getValue('email', null);
    let currentToken = GM_getValue('token', null);
    let currentPassword = GM_getValue('password', PASSWORD);

    // Verification code patterns
    const VERIFICATION_CODE_PATTERNS = [
        /\b(\d{4,8})\b/g,
        /code[:\s]+([0-9]{4,8})/gi,
        /verification[:\s]+([0-9]{4,8})/gi,
        /confirm[:\s]+([0-9]{4,8})/gi,
        /OTP[:\s]+([0-9]{4,8})/gi,
        /pin[:\s]+([0-9]{4,8})/gi,
        /\b([A-Z0-9]{4,8})\b/g,
    ];

    // ====================================
    // MAIL.TM API FUNCTIONS
    // ====================================

    function getDomains() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${MAILTM_API}/domains`,
                headers: { 'Content-Type': 'application/json' },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data['hydra:member'] || []);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    function createAccount(email, password) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${MAILTM_API}/accounts`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ address: email, password: password }),
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    function getToken(email, password) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${MAILTM_API}/token`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ address: email, password: password }),
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.token);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    function getMessages(token) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${MAILTM_API}/messages`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data['hydra:member'] || []);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    function getMessage(messageId, token) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${MAILTM_API}/messages/${messageId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    // ====================================
    // EMAIL & VERIFICATION FUNCTIONS
    // ====================================

    async function createNewEmail() {
        try {
            showNotification('Creating temporary email...', 'info');
            
            const domains = await getDomains();
            if (!domains || domains.length === 0) {
                throw new Error('No domains available');
            }

            const domain = domains[0].domain;
            const username = 'tdjs' + Math.random().toString(36).substring(2, 10);
            const emailAddress = `${username}@${domain}`;

            const account = await createAccount(emailAddress, PASSWORD);
            const token = await getToken(emailAddress, PASSWORD);

            GM_setValue('email', emailAddress);
            GM_setValue('token', token);
            GM_setValue('password', PASSWORD);
            GM_setValue('accountId', account.id);
            GM_setValue('lastMessageCount', 0);

            currentEmail = emailAddress;
            currentToken = token;
            currentPassword = PASSWORD;

            showNotification(`✅ Email created: ${emailAddress}`, 'success');
            updateMenuUI();
            startInboxMonitoring();

            return { success: true, email: emailAddress, password: PASSWORD, token: token };
        } catch (error) {
            console.error('Error creating email:', error);
            showNotification('Failed to create email: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    function extractVerificationCode(text) {
        for (const pattern of VERIFICATION_CODE_PATTERNS) {
            const matches = text.match(pattern);
            if (matches && matches.length > 0) {
                const code = matches[0].replace(/[^0-9A-Z]/gi, '');
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

            if (messages.length > lastCount) {
                const newMessages = messages.slice(0, messages.length - lastCount);
                
                for (const msg of newMessages) {
                    const fullMessage = await getMessage(msg.id, currentToken);
                    const fullText = `${fullMessage.subject || ''} ${fullMessage.intro || ''} ${fullMessage.text || ''}`;
                    const code = extractVerificationCode(fullText);
                    
                    if (code) {
                        GM_setValue('verificationCode', code);
                        GM_setValue('verificationCodeTimestamp', Date.now());
                        showNotification(`🔐 Verification code received: ${code}`, 'success');
                        
                        // Auto-fill the code
                        setTimeout(() => {
                            autoFillVerificationCode(code);
                        }, 1000);
                        break;
                    }
                }

                GM_setValue('lastMessageCount', messages.length);
            }
        } catch (error) {
            console.error('Error monitoring inbox:', error);
        }
    }

    function startInboxMonitoring() {
        setInterval(monitorInboxForVerification, INBOX_CHECK_INTERVAL);
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

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Element not found: ' + selector));
            }, timeout);
        });
    }

    function fillInput(element, value) {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function autoFillSignupForm(email, password) {
        try {
            showNotification('Filling signup form...', 'info');

            const emailSelectors = [
                'input[type="email"]',
                'input[name="email"]',
                'input[placeholder*="email" i]',
                '#email'
            ];

            const passwordSelectors = [
                'input[type="password"]',
                'input[name="password"]',
                'input[placeholder*="password" i]',
                '#password'
            ];

            let emailInput = null;
            for (const selector of emailSelectors) {
                emailInput = document.querySelector(selector);
                if (emailInput) break;
            }

            if (!emailInput) {
                throw new Error('Email field not found');
            }

            fillInput(emailInput, email);
            await new Promise(resolve => setTimeout(resolve, 500));

            const passwordInputs = document.querySelectorAll(passwordSelectors.join(','));
            passwordInputs.forEach(input => {
                fillInput(input, password);
            });

            showNotification('✅ Form filled!', 'success');
            
            // Try to solve captcha if present
            setTimeout(solveSlideCaptcha, 1000);
            
        } catch (error) {
            console.error('Error filling form:', error);
            showNotification('Error filling form: ' + error.message, 'error');
        }
    }

    function findVerificationCodeField() {
        const selectors = [
            'input[type="text"][placeholder*="code" i]',
            'input[type="text"][placeholder*="verification" i]',
            'input[name*="code" i]',
            'input[name*="verify" i]',
            'input[id*="code" i]',
            'input[id*="verify" i]',
            'input[autocomplete="one-time-code"]',
            'input[inputmode="numeric"]',
            'input[pattern*="[0-9]"]',
            'input[maxlength="4"]',
            'input[maxlength="6"]',
            'input[maxlength="8"]'
        ];

        for (const selector of selectors) {
            const field = document.querySelector(selector);
            if (field && !field.value) {
                return field;
            }
        }
        return null;
    }

    async function autoFillVerificationCode(code) {
        try {
            showNotification(`Filling verification code: ${code}`, 'info');

            const codeField = findVerificationCodeField();
            if (!codeField) {
                console.log('Verification code field not found yet');
                return;
            }

            fillInput(codeField, code);
            await new Promise(resolve => setTimeout(resolve, 500));

            const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"], button:contains("Verify"), button:contains("Confirm"), button:contains("Submit")');
            if (submitButtons.length > 0) {
                submitButtons[0].click();
                showNotification('✅ Verification code submitted!', 'success');
            }
        } catch (error) {
            console.error('Error filling verification code:', error);
        }
    }

    // ====================================
    // SLIDE CAPTCHA SOLVER
    // ====================================

    async function solveSlideCaptcha() {
        try {
            console.log('🔍 Looking for slide captcha...');

            // Common slide captcha selectors
            const captchaSelectors = [
                '.slider-button',
                '.slider-btn',
                '.slide-verify-slider',
                '.slide-track',
                '.captcha-slider',
                '.slider-handle',
                '[class*="slider"]',
                '[class*="captcha"] button',
                '[class*="slide"] button',
                'div[role="slider"]'
            ];

            let slider = null;
            for (const selector of captchaSelectors) {
                slider = document.querySelector(selector);
                if (slider) {
                    console.log(`✅ Found slider: ${selector}`);
                    break;
                }
            }

            if (!slider) {
                console.log('No slide captcha found');
                return false;
            }

            showNotification('🔧 Solving slide captcha...', 'info');

            // Get slider container
            const container = slider.parentElement || slider;
            const containerWidth = container.offsetWidth || 300;
            const sliderWidth = slider.offsetWidth || 40;
            const dragDistance = containerWidth - sliderWidth - 10;

            console.log(`Container width: ${containerWidth}, Slider width: ${sliderWidth}, Drag distance: ${dragDistance}`);

            // Simulate realistic mouse drag
            const rect = slider.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            const endX = startX + dragDistance;

            // Mouse down
            slider.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: startX,
                clientY: startY,
                button: 0
            }));

            // Simulate human-like drag (with slight variations)
            const steps = 20;
            const stepDelay = 10;
            
            for (let i = 0; i <= steps; i++) {
                await new Promise(resolve => setTimeout(resolve, stepDelay));
                
                // Add some randomness to make it look human
                const variation = (Math.random() - 0.5) * 5;
                const currentX = startX + (dragDistance * i / steps) + variation;
                
                slider.dispatchEvent(new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: currentX,
                    clientY: startY + variation,
                    button: 0
                }));

                // Update slider position if possible
                if (slider.style) {
                    slider.style.left = `${(dragDistance * i / steps)}px`;
                    slider.style.transform = `translateX(${(dragDistance * i / steps)}px)`;
                }
            }

            // Mouse up
            slider.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: endX,
                clientY: startY,
                button: 0
            }));

            // Try touch events too (for mobile-style captchas)
            const touch = new Touch({
                identifier: Date.now(),
                target: slider,
                clientX: endX,
                clientY: startY,
                radiusX: 2.5,
                radiusY: 2.5,
                rotationAngle: 0,
                force: 1
            });

            slider.dispatchEvent(new TouchEvent('touchstart', {
                bubbles: true,
                cancelable: true,
                touches: [touch],
                targetTouches: [touch],
                changedTouches: [touch]
            }));

            slider.dispatchEvent(new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true,
                touches: [],
                targetTouches: [],
                changedTouches: [touch]
            }));

            // Try drag events
            slider.dispatchEvent(new DragEvent('dragstart', {
                bubbles: true,
                cancelable: true,
                clientX: startX,
                clientY: startY
            }));

            slider.dispatchEvent(new DragEvent('drag', {
                bubbles: true,
                cancelable: true,
                clientX: endX,
                clientY: startY
            }));

            slider.dispatchEvent(new DragEvent('dragend', {
                bubbles: true,
                cancelable: true,
                clientX: endX,
                clientY: startY
            }));

            showNotification('✅ Captcha solved!', 'success');
            console.log('✅ Slide captcha solved!');
            
            return true;
        } catch (error) {
            console.error('Error solving captcha:', error);
            showNotification('❌ Captcha solving failed (try manually)', 'error');
            return false;
        }
    }

    // ====================================
    // NOTIFICATION SYSTEM
    // ====================================

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                         type === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                         'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 9999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ====================================
    // UI FUNCTIONS
    // ====================================

    function createFloatingMenu() {
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            .tdjs-menu-btn:hover { transform: scale(1.05); }
            .tdjs-menu-btn:active { transform: scale(0.95); }
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
            animation: float 3s ease-in-out infinite;
            transition: all 0.3s ease;
        `;
        floatingBall.textContent = '🚀';
        document.body.appendChild(floatingBall);

        // Create menu container (hidden by default)
        const menuContainer = document.createElement('div');
        menuContainer.id = 'tdjs-menu-container';
        menuContainer.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 380px;
            max-height: 90vh;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            overflow-y: auto;
            display: none;
        `;

        menuContainer.innerHTML = `
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #667eea; font-size: 24px;">🚀 Tdjs-AutoReg</h2>
                    <button id="tdjs-close-menu" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">✕</button>
                </div>
                <div id="tdjs-menu-content"></div>
            </div>
        `;

        document.body.appendChild(menuContainer);

        // Toggle menu
        floatingBall.addEventListener('click', () => {
            const isVisible = menuContainer.style.display !== 'none';
            menuContainer.style.display = isVisible ? 'none' : 'block';
            floatingBall.style.transform = isVisible ? 'scale(1)' : 'scale(0.8)';
        });

        document.getElementById('tdjs-close-menu').addEventListener('click', () => {
            menuContainer.style.display = 'none';
            floatingBall.style.transform = 'scale(1)';
        });

        updateMenuUI();
    }

    function updateMenuUI() {
        const content = document.getElementById('tdjs-menu-content');
        if (!content) return;

        content.innerHTML = `
            <!-- Email Section -->
            <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
                <div style="font-weight: 600; margin-bottom: 10px;">📧 Temporary Email</div>
                ${currentEmail ? `
                    <div style="font-size: 13px; word-break: break-all; margin-bottom: 5px;">${currentEmail}</div>
                    <div style="font-size: 11px; opacity: 0.9;">Password: ${currentPassword}</div>
                ` : '<div style="font-size: 13px;">No email created yet</div>'}
            </div>

            <!-- Verification Code Section -->
            ${GM_getValue('verificationCode') ? `
                <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px; color: white;">
                    <div style="font-weight: 600; margin-bottom: 10px;">🔐 Verification Code</div>
                    <div style="font-size: 24px; font-family: monospace; letter-spacing: 3px; margin-bottom: 10px;">
                        ${GM_getValue('verificationCode')}
                    </div>
                    <button class="tdjs-menu-btn" id="fill-code-btn"
                        style="width: 100%; padding: 10px; background: white; color: #f5576c; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        🔐 Fill Code Now
                    </button>
                </div>
            ` : ''}

            <!-- Action Buttons -->
            <div style="margin-bottom: 20px;">
                <button class="tdjs-menu-btn" id="create-email-btn" 
                    style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-bottom: 10px;">
                    ➕ Create New Email
                </button>
                <button class="tdjs-menu-btn" id="fill-form-btn" ${!currentEmail ? 'disabled' : ''}
                    style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-bottom: 10px; ${!currentEmail ? 'opacity: 0.5;' : ''}">
                    🎯 Auto-fill Form
                </button>
                <button class="tdjs-menu-btn" id="solve-captcha-btn"
                    style="width: 100%; padding: 12px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-bottom: 10px;">
                    🔧 Solve Slide Captcha
                </button>
                <button class="tdjs-menu-btn" id="check-inbox-btn" ${!currentEmail ? 'disabled' : ''}
                    style="width: 100%; padding: 12px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; ${!currentEmail ? 'opacity: 0.5;' : ''}">
                    📬 Check Inbox
                </button>
            </div>

            <!-- Info -->
            <div style="padding: 15px; background: #f5f5f5; border-radius: 10px; font-size: 12px; color: #666;">
                <div style="margin-bottom: 5px;">✅ Auto email creation</div>
                <div style="margin-bottom: 5px;">✅ Auto form filling</div>
                <div style="margin-bottom: 5px;">✅ Auto verification code</div>
                <div>✅ Auto slide captcha solver</div>
            </div>
        `;

        // Add event listeners
        const createEmailBtn = document.getElementById('create-email-btn');
        if (createEmailBtn) {
            createEmailBtn.addEventListener('click', createNewEmail);
        }

        const fillFormBtn = document.getElementById('fill-form-btn');
        if (fillFormBtn && currentEmail) {
            fillFormBtn.addEventListener('click', () => {
                autoFillSignupForm(currentEmail, currentPassword);
            });
        }

        const solveCaptchaBtn = document.getElementById('solve-captcha-btn');
        if (solveCaptchaBtn) {
            solveCaptchaBtn.addEventListener('click', solveSlideCaptcha);
        }

        const checkInboxBtn = document.getElementById('check-inbox-btn');
        if (checkInboxBtn && currentEmail) {
            checkInboxBtn.addEventListener('click', monitorInboxForVerification);
        }

        const fillCodeBtn = document.getElementById('fill-code-btn');
        if (fillCodeBtn) {
            fillCodeBtn.addEventListener('click', () => {
                const code = GM_getValue('verificationCode');
                if (code) {
                    autoFillVerificationCode(code);
                }
            });
        }
    }

    // ====================================
    // INITIALIZATION
    // ====================================

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingMenu);
    } else {
        createFloatingMenu();
    }

    // Resume monitoring if there's an existing session
    if (currentEmail && currentToken) {
        console.log('📧 Resuming inbox monitoring for:', currentEmail);
        startInboxMonitoring();
    }

    console.log('✅ Tdjs-AutoReg V2.3 ready!');

})();
