/**
 * Gtrend Tech Hub - Multi-Tier Chatbot & Live Chat Widget Engine
 * Workflow:
 * CUSTOMER -> CHAT WIDGET ("How can we help?")
 *          -> AUTO RESPONDER (FAQs / AI / Rules)
 *          -> LIVE AGENT REQUEST ("Connect to Agent")
 *          -> AGENT DASHBOARD (🟢 Online, 🔴 Offline, 🟡 Busy)
 *          -> REAL-TIME 2-WAY CHAT
 */

(function () {
    let chatSessionId = localStorage.getItem('gtrend_active_chat_session') || '';
    let customerName = localStorage.getItem('gtrend_customer_name') || '';
    let isLiveAgentMode = localStorage.getItem('gtrend_chat_is_live') === 'true';
    let pollInterval = null;
    let agentStatus = 'online';

    // Inject Widget HTML & Styles into document
    function injectWidget() {
        if (document.getElementById('gtrendChatWidget')) return;

        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'gtrendChatWidget';
        widgetContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto font-sans text-xs';

        widgetContainer.innerHTML = `
            <!-- Chat Trigger Button -->
            <button id="chatTriggerBtn" onclick="toggleChatWindow()"
                class="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-white shadow-2xl hover:scale-105 transition-transform duration-300 border-2 border-amber-300/40 focus:outline-none">
                <span class="absolute -top-1 -right-1 flex h-4 w-4">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-slate-900"></span>
                </span>
                <i id="chatTriggerIcon" class="fa-solid fa-comments text-2xl transition-transform duration-200"></i>
            </button>

            <!-- Chat Window Panel -->
            <div id="chatWindowPanel"
                class="hidden w-[92vw] sm:w-96 max-h-[85vh] h-[540px] rounded-3xl overflow-hidden glass-panel border border-amber-500/40 shadow-2xl flex-col mt-3 bg-slate-950/95 text-slate-100 backdrop-blur-xl transition-all duration-300">
                
                <!-- Chat Header -->
                <div class="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/70 border-b border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg shadow-inner">
                                <i class="fa-solid fa-robot" id="chatHeaderIcon"></i>
                            </div>
                            <span id="agentStatusDot" class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Agent Online"></span>
                        </div>
                        <div>
                            <h4 id="chatHeaderTitle" class="font-black text-sm text-white flex items-center gap-1.5 leading-tight">
                                Gtrend Assistant
                            </h4>
                            <p id="chatHeaderSubtitle" class="text-[10px] text-slate-400 flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Auto-Responder & Live Support
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-1 text-slate-400">
                        <button onclick="requestLiveAgentPrompt()" id="btnRequestAgentHeader" title="Connect to Live Human Agent"
                            class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-400 border border-amber-500/30 text-[10px] font-bold transition flex items-center gap-1">
                            <i class="fa-solid fa-headset"></i> Live Agent
                        </button>
                        <button onclick="toggleChatWindow()" title="Close chat"
                            class="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition">
                            <i class="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Agent Status Notification Banner -->
                <div id="chatAgentBanner" class="px-4 py-1.5 bg-emerald-950/60 border-b border-emerald-800/40 text-[10px] text-emerald-300 flex items-center justify-between hidden">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check"></i> Connected with Live Support Agent</span>
                    <button onclick="endLiveChatSession()" class="underline hover:text-white">End Session</button>
                </div>

                <!-- Messages Feed -->
                <div id="chatMessagesList" class="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
                    <!-- Default Bot Greeting -->
                    <div class="flex items-start gap-2 max-w-[88%]">
                        <div class="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div class="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-sm text-slate-200 leading-relaxed shadow-sm space-y-2">
                            <p class="font-medium">👋 Hello! Welcome to <strong>Gtrend Tech Hub</strong>. How can we help you today?</p>
                            <p class="text-[11px] text-slate-400">Ask any question or pick a quick topic below:</p>
                        </div>
                    </div>

                    <!-- Quick FAQ Action Chips -->
                    <div id="quickFaqChips" class="grid grid-cols-2 gap-1.5 pt-1">
                        <button onclick="sendQuickPrompt('Tell me about your Courses and Training')"
                            class="p-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left text-slate-300 hover:text-amber-400 transition">
                            <i class="fa-solid fa-graduation-cap accent-text mr-1"></i> Courses & Fees
                        </button>
                        <button onclick="sendQuickPrompt('I need Starlink & Internet Solutions')"
                            class="p-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left text-slate-300 hover:text-amber-400 transition">
                            <i class="fa-solid fa-satellite-dish text-cyan-400 mr-1"></i> Starlink Setup
                        </button>
                        <button onclick="sendQuickPrompt('What digital services do you offer?')"
                            class="p-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left text-slate-300 hover:text-amber-400 transition">
                            <i class="fa-solid fa-laptop-code text-blue-400 mr-1"></i> Tech Services
                        </button>
                        <button onclick="requestLiveAgentPrompt()"
                            class="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-left text-amber-300 font-bold transition">
                            <i class="fa-solid fa-headset mr-1"></i> Connect to Agent
                        </button>
                    </div>
                </div>

                <!-- Connect Live Agent Modal Form (Overlay inside widget) -->
                <div id="agentConnectModal" class="hidden absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-center text-center z-20">
                    <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto mb-3 border border-amber-500/40">
                        <i class="fa-solid fa-headset"></i>
                    </div>
                    <h3 class="text-base font-black text-white">Connect with a Live Agent</h3>
                    <p class="text-slate-400 text-xs mt-1 mb-4">Please provide your name so our support team can assist you directly.</p>

                    <form onsubmit="handleLiveAgentSubmit(event)" class="space-y-3 text-left">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Your Name *</label>
                            <input type="text" id="liveCustomerName" required placeholder="e.g. David Mark"
                                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email / WhatsApp (Optional)</label>
                            <input type="text" id="liveCustomerContact" placeholder="e.g. david@gmail.com"
                                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500">
                        </div>
                        <div class="flex items-center gap-2 pt-2">
                            <button type="submit" class="flex-1 py-3 rounded-xl accent-bg text-white font-bold hover:opacity-90 transition">
                                Start Live Chat &rarr;
                            </button>
                            <button type="button" onclick="hideAgentConnectModal()" class="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Chat Input Footer -->
                <div class="p-3 bg-slate-900/90 border-t border-slate-800">
                    <form onsubmit="handleChatSubmit(event)" class="flex items-center gap-2">
                        <input type="text" id="chatInputMessage" placeholder="Type a message or question..." autocomplete="off"
                            class="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition">
                        <button type="submit"
                            class="w-10 h-10 rounded-xl accent-bg text-white flex items-center justify-center hover:opacity-90 transition shadow-md flex-shrink-0">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(widgetContainer);

        // Check agent status on load
        checkLiveAgentStatus();
        if (isLiveAgentMode && chatSessionId) {
            startPollingLiveChat();
        }
    }

    // Toggle Chat Window Open / Close
    window.toggleChatWindow = function () {
        const panel = document.getElementById('chatWindowPanel');
        const icon = document.getElementById('chatTriggerIcon');
        if (!panel) return;

        const isHidden = panel.classList.contains('hidden');
        if (isHidden) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            icon.className = 'fa-solid fa-chevron-down text-2xl';
            document.getElementById('chatInputMessage')?.focus();
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
            icon.className = 'fa-solid fa-comments text-2xl';
        }
    };

    // Check Live Agent status from API
    async function checkLiveAgentStatus() {
        try {
            const res = await GtrendAPI.getAgentStatus();
            if (res && res.data) {
                agentStatus = res.data.agentStatus || 'online';
                const dot = document.getElementById('agentStatusDot');
                const sub = document.getElementById('chatHeaderSubtitle');
                if (dot) {
                    dot.className = `absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        agentStatus === 'online' ? 'bg-emerald-500' : (agentStatus === 'busy' ? 'bg-amber-500' : 'bg-red-500')
                    }`;
                }
                if (sub && !isLiveAgentMode) {
                    sub.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${agentStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}"></span> Agent ${agentStatus.toUpperCase()} • Instant Auto-Reply`;
                }
            }
        } catch (e) {}
    }

    // Send Quick Preset Question
    window.sendQuickPrompt = function (text) {
        const input = document.getElementById('chatInputMessage');
        if (input) {
            input.value = text;
            handleChatSubmit(new Event('submit'));
        }
    };

    // User submits chat message
    window.handleChatSubmit = async function (e) {
        if (e && e.preventDefault) e.preventDefault();
        const input = document.getElementById('chatInputMessage');
        const text = input ? input.value.trim() : '';
        if (!text) return;

        input.value = '';
        appendMessageUI('customer', text, customerName || 'You');

        // IF LIVE AGENT MODE ACTIVE -> Send to live server session
        if (isLiveAgentMode && chatSessionId) {
            try {
                await GtrendAPI.sendMessage({
                    sessionId: chatSessionId,
                    sender: 'customer',
                    senderName: customerName || 'Website Visitor',
                    text: text
                });
            } catch (err) {
                console.error('Error sending message to live agent:', err);
            }
            return;
        }

        // OTHERWISE -> Send to Auto-Responder
        appendTypingIndicator();
        try {
            const res = await GtrendAPI.autoRespond(text);
            removeTypingIndicator();

            if (res && res.data) {
                appendMessageUI('bot', res.data.reply, 'Gtrend Assistant');
                if (res.data.action === 'connect_agent' || res.data.action === 'suggest_agent') {
                    showAgentPromptChip();
                }
            }
        } catch (err) {
            removeTypingIndicator();
            appendMessageUI('bot', 'I can help you explore our Courses, Starlink internet services, or connect you with a live agent.', 'Gtrend Assistant');
        }
    };

    // Show request agent form modal
    window.requestLiveAgentPrompt = function () {
        const modal = document.getElementById('agentConnectModal');
        const nameInput = document.getElementById('liveCustomerName');
        if (modal) {
            if (nameInput && customerName) nameInput.value = customerName;
            modal.classList.remove('hidden');
        }
    };

    window.hideAgentConnectModal = function () {
        const modal = document.getElementById('agentConnectModal');
        if (modal) modal.classList.add('hidden');
    };

    // Handle Live Agent request submission
    window.handleLiveAgentSubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById('liveCustomerName').value.trim();
        const contact = document.getElementById('liveCustomerContact').value.trim();
        if (!name) return;

        customerName = name;
        localStorage.setItem('gtrend_customer_name', name);
        hideAgentConnectModal();

        chatSessionId = 'CHAT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        localStorage.setItem('gtrend_active_chat_session', chatSessionId);
        isLiveAgentMode = true;
        localStorage.setItem('gtrend_chat_is_live', 'true');

        appendMessageUI('system', `🔔 Connecting ${name} to Live Agent Queue...`, 'System');

        try {
            const res = await GtrendAPI.requestAgent({
                sessionId: chatSessionId,
                customerName: name,
                customerEmail: contact,
                initialMessage: 'Customer initiated live chat from website.'
            });

            const headerTitle = document.getElementById('chatHeaderTitle');
            const headerSubtitle = document.getElementById('chatHeaderSubtitle');
            const headerIcon = document.getElementById('chatHeaderIcon');
            const banner = document.getElementById('chatAgentBanner');

            if (headerTitle) headerTitle.textContent = 'Live Agent Support';
            if (headerSubtitle) headerSubtitle.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Human Representative Connected';
            if (headerIcon) headerIcon.className = 'fa-solid fa-headset text-amber-400';
            if (banner) banner.classList.remove('hidden');

            appendMessageUI('agent', `Hello ${name}! I am Sarah from Gtrend Tech Hub. How can I assist you today?`, 'Agent Sarah');
            startPollingLiveChat();
        } catch (err) {
            console.error('Live agent connect failed:', err);
        }
    };

    // End Live Chat Session
    window.endLiveChatSession = function () {
        if (confirm('End this live chat session?')) {
            isLiveAgentMode = false;
            localStorage.removeItem('gtrend_chat_is_live');
            if (pollInterval) clearInterval(pollInterval);

            const banner = document.getElementById('chatAgentBanner');
            if (banner) banner.classList.add('hidden');
            const headerTitle = document.getElementById('chatHeaderTitle');
            if (headerTitle) headerTitle.textContent = 'Gtrend Assistant';

            appendMessageUI('system', 'Live chat session ended. Auto-responder active.', 'System');
        }
    };

    // Start Real-Time Chat Polling
    function startPollingLiveChat() {
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(async () => {
            if (!chatSessionId || !isLiveAgentMode) return;
            try {
                const res = await GtrendAPI.getChatMessages(chatSessionId);
                if (res && res.data && res.data.messages) {
                    syncMessages(res.data.messages);
                }
            } catch (e) {}
        }, 3000);
    }

    let renderedMsgIds = new Set();

    function syncMessages(messages) {
        messages.forEach(msg => {
            const key = msg.id || `${msg.sender}-${msg.time}-${msg.text}`;
            if (!renderedMsgIds.has(key)) {
                renderedMsgIds.add(key);
                if (msg.sender !== 'customer') {
                    appendMessageUI(msg.sender, msg.text, msg.senderName || (msg.sender === 'agent' ? 'Support Agent' : 'System'));
                    playChime();
                }
            }
        });
    }

    // Append Message to UI Feed
    function appendMessageUI(sender, text, authorName) {
        const feed = document.getElementById('chatMessagesList');
        if (!feed) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const div = document.createElement('div');

        if (sender === 'customer') {
            div.className = 'flex items-start justify-end gap-2 max-w-[88%] ml-auto';
            div.innerHTML = `
                <div class="bg-gradient-to-r from-amber-600 to-amber-500 p-3 rounded-2xl rounded-tr-sm text-white leading-relaxed shadow-md">
                    <p>${escapeHTML(text)}</p>
                    <span class="block text-[9px] text-amber-100/70 text-right mt-1 font-mono">${timeStr}</span>
                </div>
            `;
        } else if (sender === 'system') {
            div.className = 'text-center my-2';
            div.innerHTML = `
                <span class="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    ${escapeHTML(text)}
                </span>
            `;
        } else {
            // bot or agent
            const isAgent = sender === 'agent';
            div.className = 'flex items-start gap-2 max-w-[88%]';
            div.innerHTML = `
                <div class="w-7 h-7 rounded-xl ${isAgent ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'} flex items-center justify-center flex-shrink-0 text-xs">
                    <i class="${isAgent ? 'fa-solid fa-headset' : 'fa-solid fa-robot'}"></i>
                </div>
                <div class="bg-slate-900 border ${isAgent ? 'border-emerald-500/30' : 'border-slate-800'} p-3 rounded-2xl rounded-tl-sm text-slate-200 leading-relaxed shadow-sm">
                    <div class="flex items-center justify-between gap-4 mb-1">
                        <span class="text-[10px] font-bold ${isAgent ? 'text-emerald-400' : 'accent-text'}">${escapeHTML(authorName || 'Agent')}</span>
                        <span class="text-[9px] text-slate-500 font-mono">${timeStr}</span>
                    </div>
                    <p class="whitespace-pre-line">${escapeHTML(text)}</p>
                </div>
            `;
        }

        feed.appendChild(div);
        feed.scrollTop = feed.scrollHeight;
    }

    function showAgentPromptChip() {
        const feed = document.getElementById('chatMessagesList');
        if (!feed) return;
        const chip = document.createElement('div');
        chip.className = 'pt-1 flex justify-start';
        chip.innerHTML = `
            <button onclick="requestLiveAgentPrompt()" class="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 border border-amber-500/50 text-amber-300 hover:text-white font-bold transition flex items-center gap-1.5 shadow-md">
                <i class="fa-solid fa-headset"></i> Chat with a Live Support Agent Now
            </button>
        `;
        feed.appendChild(chip);
        feed.scrollTop = feed.scrollHeight;
    }

    function appendTypingIndicator() {
        const feed = document.getElementById('chatMessagesList');
        if (!feed) return;
        const typing = document.createElement('div');
        typing.id = 'chatTypingIndicator';
        typing.className = 'flex items-center gap-1.5 p-2 text-slate-400 text-[11px] italic';
        typing.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 0.2s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 0.4s"></span>
            <span class="ml-1">Assistant is typing...</span>
        `;
        feed.appendChild(typing);
        feed.scrollTop = feed.scrollHeight;
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('chatTypingIndicator');
        if (typing) typing.remove();
    }

    function playChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Auto initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWidget);
    } else {
        injectWidget();
    }
})();
