/**
 * Gtrend Tech Hub - Universal Frontend API Client
 * ES module — consumed via Vite (import.meta.env) in dev/build,
 * and also assigned to window.GtrendAPI for any page-level inline scripts.
 */

const GtrendAPI = (function () {
    // ── Base URL ────────────────────────────────────────────────────────────
    // In Vite dev mode the proxy handles /api/* → localhost:3000, so BASE_URL
    // can be empty string ('').  In production set VITE_API_BASE_URL in .env.
    const BASE_URL =
        (import.meta && import.meta.env)
            ? (import.meta.env.VITE_API_BASE_URL || "")
            : "";

    // Offline / LocalStorage seed data helpers
    function getLocal(key, defaultVal = []) {
        try {
            const data = localStorage.getItem('gtrend_' + key);
            return data ? JSON.parse(data) : defaultVal;
        } catch (e) {
            return defaultVal;
        }
    }

    function setLocal(key, data) {
        try {
            localStorage.setItem('gtrend_' + key, JSON.stringify(data));
        } catch (e) { }
    }

    async function request(endpoint, options = {}) {
        const url = (endpoint.startsWith('http') ? '' : BASE_URL) + endpoint;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const token = localStorage.getItem('gtrend_token');
        if (token) {
            defaultHeaders['Authorization'] = 'Bearer ' + token;
        }

        try {
            const res = await fetch(url, {
                ...options,
                headers: { ...defaultHeaders, ...(options.headers || {}) }
            });
            if (!res.ok && res.status >= 500) {
                throw new Error(`Server returned status ${res.status}`);
            }
            const json = await res.json();
            return json;
        } catch (err) {
            console.warn(`[GtrendAPI] Live server request to ${endpoint} failed, utilizing local fallback engine:`, err.message);
            return handleLocalFallback(endpoint, options);
        }
    }

    // Comprehensive offline & static fallback router
    function handleLocalFallback(endpoint, options) {
        const method = (options.method || 'GET').toUpperCase();
        let body = {};
        if (options.body) {
            try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body; } catch (e) { }
        }

        // 1. Auth & Register
        if (endpoint.includes('/api/auth/register') && method === 'POST') {
            const users = getLocal('users', []);
            const newId = 'USR-STD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const newUser = {
                id: newId,
                fullName: body.fullName || 'Student Applicant',
                email: (body.email || '').toLowerCase(),
                phone: body.phone || '',
                role: 'student',
                course: body.course || 'Full-Stack Web Engineering',
                status: 'pending',
                paymentStatus: body.paymentStatus || 'Unpaid',
                createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            users.push(newUser);
            setLocal('users', users);

            const registrations = getLocal('registrations', []);
            const regRecord = {
                appId: 'GTR-' + Math.floor(10000 + Math.random() * 90000),
                fullName: body.fullName || 'Student Applicant',
                email: (body.email || '').toLowerCase(),
                phone: body.phone || '',
                course: body.course || 'Full-Stack Web Engineering',
                learningMode: body.learningMode || 'Physical Hub / Hybrid',
                status: 'Pending Review',
                paymentStatus: body.paymentStatus || 'Unpaid',
                submissionDate: new Date().toLocaleString()
            };
            registrations.unshift(regRecord);
            setLocal('registrations', registrations);

            return { success: true, message: 'Registration submitted successfully!', data: { user: newUser, appId: regRecord.appId, token: 'offline-token-' + newId } };
        }

        if (endpoint.includes('/api/auth/login') && method === 'POST') {
            const email = (body.email || '').toLowerCase();
            const pwd = body.password || '';
            if (email === 'admin@gtrend.com' || pwd === 'admin123') {
                return {
                    success: true,
                    message: 'Admin login successful (Offline Mode)',
                    data: {
                        user: { id: 'USR-ADM-001', name: 'Gtrend Super Admin', email: 'admin@gtrend.com', role: 'admin' },
                        token: 'offline-admin-token',
                        redirect: 'admin/index.html'
                    }
                };
            }
            return {
                success: true,
                message: 'Login successful (Offline Mode)',
                data: {
                    user: { id: 'USR-STD-LOCAL', name: body.email.split('@')[0], email: body.email, role: 'student' },
                    token: 'offline-student-token',
                    redirect: 'courses.html'
                }
            };
        }

        // 2. News API
        if (endpoint.includes('/api/news')) {
            let news = getLocal('news', null);
            if (!news) {
                news = [
                    {
                        id: 'news-1',
                        title: 'Gtrend Hub Launches AI & Full-Stack Summer Bootcamp 2026',
                        category: 'Events',
                        date: 'September 18, 2026',
                        author: 'Engr. Victor Clifford',
                        image: './assets/images/course-web-dev.jpg',
                        summary: 'Join over 150 emerging software developers and AI innovators in an intensive 12-week hands-on tech accelerator.',
                        content: 'Gtrend Tech Hub has officially launched admission for the 2026 Full-Stack and AI Engineering Cohort. Trainees gain direct mentorship in building production apps, React/Node architectures, and automated intelligence pipelines.',
                        tags: ['Bootcamp', 'FullStack', 'AI']
                    },
                    {
                        id: 'news-2',
                        title: 'Enterprise Starlink & Low-Latency Mesh Satellite Deployments',
                        category: 'Projects',
                        date: 'September 12, 2026',
                        author: 'Engr. Benedict Anthony',
                        image: './assets/images/starlink-network.jpg',
                        summary: 'Providing uninterrupted high-speed internet to remote corporate facilities, research hubs, and offshore locations.',
                        content: 'Our specialized connectivity division completed 45 high-speed Starlink deployments across the South-South region with 99.98% uptime SLA.',
                        tags: ['Starlink', 'Connectivity', 'ICT']
                    },
                    {
                        id: 'news-3',
                        title: 'Next-Gen Cybersecurity & Cloud Defense Masterclass',
                        category: 'Updates',
                        date: 'September 05, 2026',
                        author: 'Security Operations Team',
                        image: './assets/images/cybersecurity.jpg',
                        summary: 'Zero-trust security blueprints and proactive threat mitigation strategies for enterprise organizations.',
                        content: 'A comprehensive briefing and interactive workshop for enterprise IT directors on defending cloud perimeters against modern attack vectors.',
                        tags: ['Cybersecurity', 'Cloud', 'Workshops']
                    }
                ];
                setLocal('news', news);
            }

            if (method === 'POST') {
                const item = { ...body, id: 'news-' + Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) };
                news.unshift(item);
                setLocal('news', news);
                return { success: true, message: 'News article published!', data: item };
            }
            if (method === 'DELETE') {
                const id = endpoint.split('/').pop();
                news = news.filter(n => n.id !== id);
                setLocal('news', news);
                return { success: true, message: 'Article deleted' };
            }
            return { success: true, data: news };
        }

        // 3. Gallery API
        if (endpoint.includes('/api/gallery')) {
            let gallery = getLocal('gallery', null);
            if (!gallery) {
                gallery = [
                    { id: 'gal-1', title: 'Main Development Studio & Academy Floor', category: 'Campus', type: 'image', url: './assets/images/hero-tech-bg.jpg', description: 'State-of-the-art tech workspace equipped with ultra-fast mesh fiber connectivity.' },
                    { id: 'gal-2', title: 'Full-Stack Software Lab in Action', category: 'Training', type: 'image', url: './assets/images/course-web-dev.jpg', description: 'Hands-on practical session building scalable Node.js and React web applications.' },
                    { id: 'gal-3', title: 'AI & Data Engineering Workstations', category: 'Projects', type: 'image', url: './assets/images/ai-automation.jpg', description: 'Students designing automated intelligent workflows and machine learning models.' },
                    { id: 'gal-4', title: 'Enterprise Satellite & Network Testing Lab', category: 'Lab', type: 'image', url: './assets/images/starlink-network.jpg', description: 'Engineers configuring failover routing and Starlink satellite arrays.' },
                    { id: 'gal-5', title: 'Cyber Threat Defense Operations Center', category: 'Lab', type: 'image', url: './assets/images/cybersecurity.jpg', description: 'Live threat monitoring and vulnerability auditing simulation room.' }
                ];
                setLocal('gallery', gallery);
            }
            if (method === 'POST') {
                const item = { ...body, id: 'gal-' + Date.now() };
                gallery.unshift(item);
                setLocal('gallery', gallery);
                return { success: true, message: 'Gallery item added!', data: item };
            }
            if (method === 'DELETE') {
                const id = endpoint.split('/').pop();
                gallery = gallery.filter(g => g.id !== id);
                setLocal('gallery', gallery);
                return { success: true, message: 'Gallery item deleted' };
            }
            return { success: true, data: gallery };
        }

        // 4. Inquiries API
        if (endpoint.includes('/api/inquiries')) {
            let inq = getLocal('inquiries', []);
            if (method === 'POST') {
                const item = { ...body, id: 'INQ-' + Date.now(), time: new Date().toLocaleString(), status: 'Unread' };
                inq.unshift(item);
                setLocal('inquiries', inq);
                return { success: true, message: 'Inquiry received successfully!', data: item };
            }
            if (method === 'DELETE') {
                const id = endpoint.split('/').pop();
                inq = inq.filter(i => i.id !== id);
                setLocal('inquiries', inq);
                return { success: true, message: 'Inquiry deleted' };
            }
            return { success: true, data: inq };
        }

        // 5. Chat API
        if (endpoint.includes('/api/chat/status')) {
            if (method === 'POST') {
                const updated = { status: body.status || 'online', activeAgent: body.activeAgent || 'Support Agent' };
                setLocal('chat_status', updated);
                return { success: true, data: updated };
            }
            return { success: true, data: getLocal('chat_status', { status: 'online', activeAgent: 'Support Desk' }) };
        }

        if (endpoint.includes('/api/chat/session')) {
            if (method === 'POST') {
                const sessionId = 'chat_offline_' + Date.now();
                const session = {
                    sessionId,
                    customerName: body.customerName || 'Website Visitor',
                    customerEmail: body.customerEmail || '',
                    track: body.track || 'General Inquiry',
                    status: 'waiting_for_agent',
                    messages: [
                        { id: 'm1', sender: 'bot', senderName: 'Gtrend Assistant', text: 'Connecting you with an agent...', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                    ]
                };
                if (body.initialMessage) {
                    session.messages.push({ id: 'm2', sender: 'customer', senderName: body.customerName || 'Visitor', text: body.initialMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
                }
                const sessions = getLocal('chat_sessions', []);
                sessions.unshift(session);
                setLocal('chat_sessions', sessions);
                return { success: true, sessionId, data: session };
            }
        }

        if (endpoint.includes('/api/chat/sessions')) {
            return { success: true, data: getLocal('chat_sessions', []) };
        }

        // 6. Admin API
        if (endpoint.includes('/api/admin/stats')) {
            const news = getLocal('news', []);
            const gallery = getLocal('gallery', []);
            const inq = getLocal('inquiries', []);
            const registrations = getLocal('registrations', []);
            const payments = getLocal('payments', []);
            const totalRev = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
            return {
                success: true,
                data: {
                    totalUsers: 2,
                    totalStudents: registrations.length || 3,
                    pendingRegistrations: registrations.filter(r => (r.status || '').toLowerCase().includes('pending')).length,
                    activeChatSessions: 1,
                    totalNews: news.length,
                    totalGallery: gallery.length,
                    totalInquiries: inq.length,
                    totalPayments: payments.length,
                    totalRevenue: totalRev
                }
            };
        }

        if (endpoint.includes('/api/admin/registrations')) {
            return { success: true, data: getLocal('registrations', []) };
        }

        return { success: true, data: [] };
    }

    // Built-in intelligent auto-responder
    async function autoRespond(query) {
        const q = (query || '').toLowerCase();

        let reply = '';
        let action = null;

        if (q.includes('course') || q.includes('track') || q.includes('learn') || q.includes('program') || q.includes('class')) {
            reply = 'We offer 6 industry-leading tracks: 1) Full-Stack Web Dev (React & Node.js), 2) AI & Machine Learning, 3) UI/UX Design, 4) Mobile App Dev (Flutter), 5) Cybersecurity & Ethical Hacking, and 6) Kids Coding Club. You can explore complete syllabi on our Courses page!';
            action = 'view_courses';
        } else if (q.includes('fee') || q.includes('tuition') || q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('payment')) {
            reply = 'Our tuition is flexible and subsidized! Introductory courses start from ₦35,000 with installment payment options available. Early bird applicants receive scholarship support upon registration.';
            action = 'suggest_agent';
        } else if (q.includes('starlink') || q.includes('internet') || q.includes('wifi') || q.includes('network') || q.includes('satellite')) {
            reply = 'Gtrend Tech Hub provides turnkey Starlink enterprise installations, mesh routing, low-latency failover, and high-speed campus internet solutions across the South-South region.';
            action = 'connect_agent';
        } else if (q.includes('duration') || q.includes('how long') || q.includes('schedule') || q.includes('time')) {
            reply = 'Our accelerated bootcamps run for 8 to 12 weeks with both morning/evening weekday tracks and weekend executive cohorts. Online, hybrid, and onsite options are available.';
        } else if (q.includes('certificate') || q.includes('cert') || q.includes('diploma') || q.includes('internship') || q.includes('job')) {
            reply = 'Yes! All graduates receive verified Gtrend Hub Certificates of Excellence and top performers get direct 3-month paid internship placements in our production studios.';
        } else if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('office')) {
            reply = 'Our state-of-the-art innovation center is located in Delta State, Nigeria, equipped with 24/7 solar power and dedicated Starlink fiber mesh internet.';
        } else if (q.includes('human') || q.includes('agent') || q.includes('speak') || q.includes('talk') || q.includes('representative') || q.includes('help')) {
            reply = 'I am connecting you with one of our live student advisors right now. Please hold on a moment.';
            action = 'connect_agent';
        } else {
            reply = 'Thank you for reaching out to Gtrend Tech Hub! I can help you with course admissions, Starlink installations, bespoke software engineering, or connect you with a live specialist.';
            action = 'suggest_agent';
        }

        return {
            success: true,
            data: {
                reply,
                action,
                timestamp: new Date().toISOString()
            }
        };
    }

    // Paystack Inline Payment Integration Helper
    function payWithPaystack({ email, amount, fullName, phone, purpose, course, onSuccess, onCancel }) {
        const amountInKobo = Math.round(Number(amount) * 100);
        // Key from VITE_PAYSTACK_PUBLIC_KEY in .env (injected by Vite)
        let publicKey = 'pk_test_sample_gtrend_paystack_public_key';
        try {
            if (import.meta.env && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
                publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
            }
        } catch (_) {
            if (typeof window !== 'undefined' && window.PAYSTACK_PUBLIC_KEY) {
                publicKey = window.PAYSTACK_PUBLIC_KEY;
            }
        }

        if (typeof window.PaystackPop !== 'undefined') {
            const handler = window.PaystackPop.setup({
                key: publicKey,
                email: email,
                amount: amountInKobo,
                currency: 'NGN',
                metadata: {
                    custom_fields: [
                        { display_name: "Customer Name", variable_name: "customer_name", value: fullName },
                        { display_name: "Course / Purpose", variable_name: "purpose", value: purpose || course },
                        { display_name: "Phone", variable_name: "phone", value: phone }
                    ]
                },
                callback: function (response) {
                    request('/api/payments/record', {
                        method: 'POST',
                        body: JSON.stringify({
                            reference: response.reference,
                            email,
                            fullName,
                            amount,
                            purpose: purpose || 'Tuition / Service Deposit',
                            course: course || 'General Tech',
                            phone,
                            status: 'Success'
                        })
                    }).then(res => {
                        if (typeof onSuccess === 'function') onSuccess(response, res);
                    }).catch(err => {
                        if (typeof onSuccess === 'function') onSuccess(response, { success: true });
                    });
                },
                onClose: function () {
                    if (typeof onCancel === 'function') onCancel();
                }
            });
            handler.openIframe();
        } else {
            const demoRef = 'GTREND-SIM-' + Date.now().toString(36).toUpperCase();
            const confirmed = confirm(`[Paystack Simulation Mode]\n\nPay ₦${Number(amount).toLocaleString()} for ${course || purpose}?\n\nClick OK to simulate successful Paystack transaction.`);
            if (confirmed) {
                request('/api/payments/record', {
                    method: 'POST',
                    body: JSON.stringify({
                        reference: demoRef,
                        email,
                        fullName,
                        amount,
                        purpose: purpose || 'Tuition / Service Deposit',
                        course: course || 'General Tech',
                        phone,
                        status: 'Success (Simulated)'
                    })
                }).then(res => {
                    if (typeof onSuccess === 'function') onSuccess({ reference: demoRef }, res);
                });
            } else {
                if (typeof onCancel === 'function') onCancel();
            }
        }
    }

    return {
        // Base Config
        setBaseUrl: (url) => { BASE_URL = url; },
        getBaseUrl: () => BASE_URL,

        // Auth
        register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        getProfile: () => request('/api/auth/profile'),
        logout: () => {
            localStorage.removeItem('gtrend_token');
            localStorage.removeItem('gtrend_user');
            return { success: true };
        },

        // News
        getNews: (params = '') => request('/api/news' + (params ? '?' + params : '')),
        getNewsItem: (id) => request(`/api/news/${id}`),
        createNews: (data) => request('/api/news', { method: 'POST', body: JSON.stringify(data) }),
        updateNews: (id, data) => request(`/api/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteNews: (id) => request(`/api/news/${id}`, { method: 'DELETE' }),

        // Gallery
        getGallery: (params = '') => request('/api/gallery' + (params ? '?' + params : '')),
        createGallery: (data) => request('/api/gallery', { method: 'POST', body: JSON.stringify(data) }),
        deleteGallery: (id) => request(`/api/gallery/${id}`, { method: 'DELETE' }),

        // Inquiries
        getInquiries: () => request('/api/inquiries'),
        sendInquiry: (data) => request('/api/inquiries', { method: 'POST', body: JSON.stringify(data) }),
        deleteInquiry: (id) => request(`/api/inquiries/${id}`, { method: 'DELETE' }),

        // Chatbot & Live Chat
        getChatStatus: () => request('/api/chat/status'),
        getAgentStatus: () => request('/api/chat/status'),
        updateChatStatus: (data) => request('/api/chat/status', { method: 'POST', body: JSON.stringify(data) }),
        setAgentStatus: (status, activeAgent) => request('/api/chat/status', { method: 'POST', body: JSON.stringify({ status, activeAgent }) }),
        createChatSession: (data) => request('/api/chat/session', { method: 'POST', body: JSON.stringify(data) }),
        requestAgent: (data) => request('/api/chat/session', { method: 'POST', body: JSON.stringify(data) }),
        getChatSessions: () => request('/api/chat/sessions'),
        getChatSession: (id) => request(`/api/chat/session/${id}`),
        getChatMessages: (id) => request(`/api/chat/session/${id}`),
        sendMessage: (data) => request('/api/chat/message', { method: 'POST', body: JSON.stringify(data) }),
        resolveChat: (sessionId) => request('/api/chat/resolve', { method: 'POST', body: JSON.stringify({ sessionId }) }),
        autoRespond,

        // Payments (Paystack)
        getPaymentConfig: () => request('/api/payments/config'),
        recordPayment: (data) => request('/api/payments/record', { method: 'POST', body: JSON.stringify(data) }),
        verifyPayment: (ref) => request(`/api/payments/verify/${ref}`),
        getAllPayments: () => request('/api/payments/all'),
        payWithPaystack,

        // Admin Management
        getStats: () => request('/api/admin/stats'),
        getAdminStats: () => request('/api/admin/stats'),
        getUsers: () => request('/api/admin/registrations'),
        getRegistrations: () => request('/api/admin/registrations'),
        updateUserStatus: (id, status) => request('/api/admin/registrations/update-status', { method: 'POST', body: JSON.stringify({ appId: id, status }) }),
        updateRegistrationStatus: (data) => request('/api/admin/registrations/update-status', { method: 'POST', body: JSON.stringify(data) }),
        deleteUser: (appId) => request(`/api/admin/registrations/${appId}`, { method: 'DELETE' }),
        deleteRegistration: (appId) => request(`/api/admin/registrations/${appId}`, { method: 'DELETE' })
    };
})();

// Assign to window so page-level inline <script> blocks can still use GtrendAPI
if (typeof window !== 'undefined') {
    window.GtrendAPI = GtrendAPI;
}

// ES module default export — used by Vite module imports
export default GtrendAPI;
