// ==UserScript==
// @name         Tdjs-AutoReg V3 - Clean & Draggable
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Clean auto sign-up with draggable UI! Email → Form → Manual Captcha → Auto Verification!
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

    console.log('🚀 Tdjs-AutoReg V3 loaded - Clean & Draggable!');

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

            showNotification(`✅ Email created!`, 'success');
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
                        showNotification(`🔐 Code received: ${code}`, 'success');
                        updateMenuUI();
                        
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

            showNotification('✅ Form filled! Now solve the captcha manually 👆', 'success');
            
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
    // NOTIFICATION SYSTEM
    // ====================================

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            error: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${colors[type]};
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 9999999;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ====================================
    // DRAGGABLE UI
    // ====================================

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            handle.style.cursor = 'grabbing';
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            handle.style.cursor = 'grab';
        }
    }

    function createUI() {
        // Add global styles
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
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            .tdjs-btn {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                border: none;
                font-weight: 600;
                font-size: 14px;
            }
            .tdjs-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            }
            .tdjs-btn:active {
                transform: translateY(0);
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            }
            .tdjs-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
            }
            .tdjs-card {
                background: white;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }
            .tdjs-card:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .tdjs-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .tdjs-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            .tdjs-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
            }
            .tdjs-scrollbar::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }
        `;
        document.head.appendChild(style);

        // Create main container
        const container = document.createElement('div');
        container.id = 'tdjs-container';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 380px;
            max-height: 90vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.4);
            z-index: 999999;
            font-family: 'Segoe UI', Arial, sans-serif;
            overflow: hidden;
            animation: fadeIn 0.4s ease-out;
        `;

        // Create header (draggable handle)
        const header = document.createElement('div');
        header.id = 'tdjs-header';
        header.style.cssText = `
            padding: 20px;
            cursor: grab;
            user-select: none;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.2);
        `;
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                        🚀 Tdjs-AutoReg
                    </h1>
                    <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 500;">
                        Clean & Simple Automation
                    </p>
                </div>
                <button id="tdjs-minimize" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 18px; transition: all 0.3s;">
                    ─
                </button>
            </div>
        `;

        // Create content area
        const content = document.createElement('div');
        content.id = 'tdjs-content';
        content.className = 'tdjs-scrollbar';
        content.style.cssText = `
            max-height: calc(90vh - 100px);
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        `;

        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);

        // Make draggable
        makeDraggable(container, header);

        // Minimize functionality
        const minimizeBtn = document.getElementById('tdjs-minimize');
        minimizeBtn.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                container.style.width = '380px';
                minimizeBtn.textContent = '─';
            } else {
                content.style.display = 'none';
                container.style.width = 'auto';
                minimizeBtn.textContent = '□';
            }
        });

        minimizeBtn.addEventListener('mouseenter', () => {
            minimizeBtn.style.background = 'rgba(255,255,255,0.3)';
            minimizeBtn.style.transform = 'scale(1.1)';
        });
        minimizeBtn.addEventListener('mouseleave', () => {
            minimizeBtn.style.background = 'rgba(255,255,255,0.2)';
            minimizeBtn.style.transform = 'scale(1)';
        });

        updateMenuUI();
    }

    function updateMenuUI() {
        const content = document.getElementById('tdjs-content');
        if (!content) return;

        const verificationCode = GM_getValue('verificationCode', null);

        content.innerHTML = `
            <!-- Email Card -->
            <div class="tdjs-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="font-size: 24px; margin-right: 10px;">📧</div>
                    <div style="font-weight: 600; font-size: 16px;">Temporary Email</div>
                </div>
                ${currentEmail ? `
                    <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 10px;">
                        <div style="font-size: 13px; word-break: break-all; font-family: monospace; margin-bottom: 8px;">
                            ${currentEmail}
                        </div>
                        <div style="font-size: 12px; opacity: 0.9;">
                            🔒 Password: <span style="font-family: monospace;">${currentPassword}</span>
                        </div>
                    </div>
                ` : `
                    <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 10px; text-align: center; opacity: 0.9;">
                        No email created yet
                    </div>
                `}
            </div>

            <!-- Verification Code Card -->
            ${verificationCode ? `
                <div class="tdjs-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; animation: pulse 2s infinite;">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 24px; margin-right: 10px;">🔐</div>
                        <div style="font-weight: 600; font-size: 16px;">Verification Code</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px; margin-top: 10px; text-align: center;">
                        <div style="font-size: 32px; font-family: 'Courier New', monospace; letter-spacing: 8px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                            ${verificationCode}
                        </div>
                    </div>
                    <button class="tdjs-btn" id="fill-code-btn" style="width: 100%; padding: 12px; background: white; color: #f5576c; border-radius: 8px; margin-top: 12px; font-size: 14px;">
                        🎯 Fill Code Now
                    </button>
                </div>
            ` : ''}

            <!-- Actions Card -->
            <div class="tdjs-card">
                <div style="color: #333; font-weight: 600; font-size: 16px; margin-bottom: 12px; display: flex; align-items: center;">
                    <div style="font-size: 24px; margin-right: 10px;">⚡</div>
                    Quick Actions
                </div>
                
                <button class="tdjs-btn" id="create-email-btn" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin-bottom: 10px;">
                    ➕ Create New Email
                </button>
                
                <button class="tdjs-btn" id="fill-form-btn" ${!currentEmail ? 'disabled' : ''} style="width: 100%; padding: 14px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 10px; margin-bottom: 10px;">
                    🎯 Auto-fill Form
                </button>
                
                <button class="tdjs-btn" id="check-inbox-btn" ${!currentEmail ? 'disabled' : ''} style="width: 100%; padding: 14px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 10px;">
                    📬 Check Inbox
                </button>
            </div>

            <!-- Instructions Card -->
            <div class="tdjs-card" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);">
                <div style="color: #d84315; font-weight: 600; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center;">
                    <div style="font-size: 20px; margin-right: 8px;">💡</div>
                    How to Use
                </div>
                <div style="color: #d84315; font-size: 13px; line-height: 1.6;">
                    <div style="margin-bottom: 6px;">1️⃣ Create temp email</div>
                    <div style="margin-bottom: 6px;">2️⃣ Auto-fill form</div>
                    <div style="margin-bottom: 6px;">3️⃣ <strong>Solve captcha manually</strong> 👆</div>
                    <div style="margin-bottom: 6px;">4️⃣ Submit form</div>
                    <div>5️⃣ Code fills automatically! ✅</div>
                </div>
            </div>

            <!-- Stats Card -->
            <div class="tdjs-card" style="background: #f8f9fa; border: 2px dashed #dee2e6;">
                <div style="text-align: center; color: #666; font-size: 12px; line-height: 1.6;">
                    <div style="margin-bottom: 6px;">✅ Auto email creation</div>
                    <div style="margin-bottom: 6px;">✅ Auto form filling</div>
                    <div style="margin-bottom: 6px;">👆 Manual captcha (2 seconds)</div>
                    <div>✅ Auto verification code</div>
                </div>
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
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        setTimeout(createUI, 1000);
    }

    // Resume monitoring if there's an existing session
    if (currentEmail && currentToken) {
        console.log('📧 Resuming inbox monitoring for:', currentEmail);
        startInboxMonitoring();
    }

    console.log('✅ Tdjs-AutoReg V3 ready! Drag the window anywhere you want!');

})();
