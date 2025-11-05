// ==UserScript==
// @name         Tdjs-AutoReg V3.1 - Mobile Optimized
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Mobile-friendly floating ball UI! Clean, cool & doesn't block forms!
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

    console.log('🚀 Tdjs-AutoReg V3.1 Mobile loaded!');

    // Configuration
    const MAILTM_API = 'https://api.mail.tm';
    const PASSWORD = 'TdjsCloudPhone0909';
    const INBOX_CHECK_INTERVAL = 10000;

    // Current session
    let currentEmail = GM_getValue('email', null);
    let currentToken = GM_getValue('token', null);
    let currentPassword = GM_getValue('password', PASSWORD);
    let menuOpen = false;

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
            showToast('Creating email...', '⏳');
            
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

            showToast('Email created! ✅', '🎉');
            updateMenuUI();
            startInboxMonitoring();

            return { success: true, email: emailAddress, password: PASSWORD, token: token };
        } catch (error) {
            console.error('Error creating email:', error);
            showToast('Failed to create email!', '❌');
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
                        showToast(`Code: ${code}`, '🔐');
                        updateMenuUI();
                        
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
            showToast('Filling form...', '✍️');

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

            showToast('Form filled! ✅', '🎯');
            
        } catch (error) {
            console.error('Error filling form:', error);
            showToast('Error filling form!', '❌');
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
            showToast(`Filling code: ${code}`, '🔐');

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
                showToast('Code submitted! ✅', '🎉');
            }
        } catch (error) {
            console.error('Error filling verification code:', error);
        }
    }

    // ====================================
    // TOAST NOTIFICATION
    // ====================================

    function showToast(message, emoji = '✨') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            background: rgba(0,0,0,0.9);
            color: white;
            border-radius: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            z-index: 99999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: toastIn 0.3s ease-out;
        `;
        toast.innerHTML = `<span style="font-size: 18px;">${emoji}</span> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ====================================
    // FLOATING BALL UI
    // ====================================

    function createUI() {
        // Add global styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
            @keyframes toastIn {
                from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes toastOut {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            }
            .tdjs-btn-mobile {
                width: 100%;
                padding: 16px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                margin-bottom: 12px;
            }
            .tdjs-btn-mobile:active {
                transform: scale(0.95);
            }
            .tdjs-btn-mobile:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);

        // Create floating ball
        const ball = document.createElement('div');
        ball.id = 'tdjs-ball';
        ball.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
            cursor: pointer;
            z-index: 9999998;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            animation: float 3s ease-in-out infinite;
            transition: all 0.3s ease;
        `;
        ball.textContent = '🚀';
        document.body.appendChild(ball);

        // Create menu (bottom sheet style)
        const menu = document.createElement('div');
        menu.id = 'tdjs-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 80vh;
            background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
            border-radius: 25px 25px 0 0;
            box-shadow: 0 -5px 30px rgba(0,0,0,0.3);
            z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            display: none;
            overflow-y: auto;
            padding-bottom: env(safe-area-inset-bottom);
        `;

        menu.innerHTML = `
            <div style="padding: 20px;">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 40px; height: 4px; background: #ddd; border-radius: 2px; margin: 0 auto 15px;"></div>
                    <h1 style="margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; font-weight: 900;">
                        Tdjs-AutoReg
                    </h1>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px; font-weight: 600;">
                        Clean Automation 🚀
                    </p>
                </div>

                <!-- Content -->
                <div id="tdjs-menu-content"></div>
            </div>
        `;

        document.body.appendChild(menu);

        // Toggle menu
        ball.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                menu.style.display = 'block';
                menu.style.animation = 'slideUp 0.3s ease-out';
                ball.style.transform = 'scale(0.9)';
            } else {
                menu.style.animation = 'slideDown 0.3s ease-out';
                setTimeout(() => {
                    menu.style.display = 'none';
                    ball.style.transform = 'scale(1)';
                }, 300);
            }
        });

        // Close on background tap
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                ball.click();
            }
        });

        updateMenuUI();
    }

    function updateMenuUI() {
        const content = document.getElementById('tdjs-menu-content');
        if (!content) return;

        const verificationCode = GM_getValue('verificationCode', null);

        content.innerHTML = `
            <!-- Email Section -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 20px; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                <div style="color: white; font-weight: 700; font-size: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 24px;">📧</span>
                    <span>Email</span>
                </div>
                ${currentEmail ? `
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 12px; backdrop-filter: blur(10px);">
                        <div style="color: white; font-size: 13px; word-break: break-all; font-family: monospace; margin-bottom: 8px; font-weight: 600;">
                            ${currentEmail}
                        </div>
                        <div style="color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 600;">
                            🔒 ${currentPassword}
                        </div>
                    </div>
                ` : `
                    <div style="color: rgba(255,255,255,0.8); font-size: 14px; text-align: center; padding: 10px;">
                        No email yet
                    </div>
                `}
            </div>

            <!-- Verification Code Section -->
            ${verificationCode ? `
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 20px; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3); animation: pulse 2s infinite;">
                    <div style="color: white; font-weight: 700; font-size: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 24px;">🔐</span>
                        <span>Code</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 12px; text-align: center; backdrop-filter: blur(10px);">
                        <div style="color: white; font-size: 36px; font-family: 'Courier New', monospace; letter-spacing: 8px; font-weight: 900; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                            ${verificationCode}
                        </div>
                    </div>
                    <button class="tdjs-btn-mobile" id="fill-code-btn" style="background: white; color: #f5576c; margin-top: 15px;">
                        🎯 Fill Code Now
                    </button>
                </div>
            ` : ''}

            <!-- Action Buttons -->
            <div style="margin-bottom: 15px;">
                <button class="tdjs-btn-mobile" id="create-email-btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    ➕ Create Email
                </button>
                
                <button class="tdjs-btn-mobile" id="fill-form-btn" ${!currentEmail ? 'disabled' : ''} style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    🎯 Fill Form
                </button>
                
                <button class="tdjs-btn-mobile" id="check-inbox-btn" ${!currentEmail ? 'disabled' : ''} style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    📬 Check Inbox
                </button>
            </div>

            <!-- Instructions -->
            <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 20px; box-shadow: 0 4px 15px rgba(252, 182, 159, 0.3);">
                <div style="color: #d84315; font-weight: 700; font-size: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 24px;">💡</span>
                    <span>How to Use</span>
                </div>
                <div style="color: #d84315; font-size: 14px; line-height: 1.8; font-weight: 600;">
                    <div style="margin-bottom: 8px;">1️⃣ Create email</div>
                    <div style="margin-bottom: 8px;">2️⃣ Fill form</div>
                    <div style="margin-bottom: 8px;">3️⃣ <strong>Solve captcha</strong> 👆</div>
                    <div style="margin-bottom: 8px;">4️⃣ Submit</div>
                    <div>5️⃣ Code auto-fills! ✅</div>
                </div>
            </div>
        `;

        // Add event listeners
        const createEmailBtn = document.getElementById('create-email-btn');
        if (createEmailBtn) {
            createEmailBtn.addEventListener('click', async () => {
                await createNewEmail();
            });
        }

        const fillFormBtn = document.getElementById('fill-form-btn');
        if (fillFormBtn && currentEmail) {
            fillFormBtn.addEventListener('click', () => {
                autoFillSignupForm(currentEmail, currentPassword);
            });
        }

        const checkInboxBtn = document.getElementById('check-inbox-btn');
        if (checkInboxBtn && currentEmail) {
            checkInboxBtn.addEventListener('click', () => {
                monitorInboxForVerification();
                showToast('Checking inbox...', '📬');
            });
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        setTimeout(createUI, 1000);
    }

    if (currentEmail && currentToken) {
        console.log('📧 Resuming inbox monitoring');
        startInboxMonitoring();
    }

    console.log('✅ Tdjs-AutoReg V3.1 Mobile ready!');

})();
