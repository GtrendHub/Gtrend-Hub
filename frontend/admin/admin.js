/**
 * Gtrend Tech Hub - Admin Dashboard & Live Agent Console Script
 */

let allStudents = [];
let allNews = [];
let allGallery = [];
let allInquiries = [];
let activeChatSessionId = null;
let chatPollingInterval = null;
let currentAgentStatus = 'online';

document.addEventListener('DOMContentLoaded', () => {
    // Initial data load
    loadDashboardStats();
    loadStudents();
    loadNews();
    loadGallery();
    loadInquiries();
    loadAdminChatSessions();
    loadAgentStatus();

    // Polling for live chat sessions queue
    setInterval(() => {
        loadAdminChatSessions(true);
        if (activeChatSessionId) {
            fetchActiveChatMessages(true);
        }
    }, 3000);
});

// Tab Navigation
window.switchAdminTab = function (tabId) {
    const tabs = ['overview', 'students', 'news', 'gallery', 'chat', 'inquiries'];
    tabs.forEach(t => {
        const btn = document.getElementById('tab-' + t);
        const pane = document.getElementById('pane-' + t);
        if (btn) btn.classList.toggle('active', t === tabId);
        if (pane) pane.classList.toggle('hidden', t !== tabId);
    });

    const titles = {
        overview: 'Dashboard Overview',
        students: 'Student Applications & Registrations',
        news: 'News, Events & Project Updates Manager',
        gallery: 'Media & Video Gallery Manager',
        chat: 'Live Agent Real-Time Chat Console',
        inquiries: 'Customer Contact Inquiries'
    };
    document.getElementById('pageHeading').textContent = titles[tabId] || 'Dashboard';
};

// 1. STATS & OVERVIEW
async function loadDashboardStats() {
    try {
        const res = await GtrendAPI.getStats();
        if (res && res.data) {
            const d = res.data;
            document.getElementById('kpiTotalStudents').textContent = d.totalStudents || 0;
            document.getElementById('kpiPendingStudents').textContent = d.pendingRegistrations || 0;
            document.getElementById('kpiActiveChats').textContent = d.activeChatSessions || 0;
            document.getElementById('kpiNewsCount').textContent = (d.totalNews || 0) + (d.totalGallery || 0);

            const badgePending = document.getElementById('badgePendingStudents');
            if (badgePending) {
                if (d.pendingRegistrations > 0) {
                    badgePending.textContent = d.pendingRegistrations;
                    badgePending.classList.remove('hidden');
                } else {
                    badgePending.classList.add('hidden');
                }
            }
        }
    } catch (e) {
        console.error('Stats load error:', e);
    }
}

// 2. STUDENTS MANAGEMENT
async function loadStudents() {
    try {
        const res = await GtrendAPI.getUsers('role=student');
        if (res && res.data) {
            allStudents = res.data;
            renderOverviewStudentsTable();
            renderStudentsTable();
        }
    } catch (e) {
        console.error('Students load error:', e);
    }
}

function renderOverviewStudentsTable() {
    const tbody = document.getElementById('overviewStudentsTable');
    if (!tbody) return;

    const recent = allStudents.slice(0, 5);
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-slate-500">No student registrations recorded yet.</td></tr>';
        return;
    }

    tbody.innerHTML = recent.map(s => `
        <tr class="hover:bg-slate-800/30 transition">
            <td class="py-3 px-3">
                <div class="font-bold text-white">${escapeHTML(s.fullName)}</div>
                <div class="text-[10px] text-slate-400 font-mono">${escapeHTML(s.email)}</div>
            </td>
            <td class="py-3 px-3 text-slate-300">${escapeHTML(s.course || 'General')}</td>
            <td class="py-3 px-3 text-slate-400">${escapeHTML(s.learningMode || 'Onsite')}</td>
            <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(s.status)}">
                    ${escapeHTML(s.status || 'pending')}
                </span>
            </td>
            <td class="py-3 px-3 text-right">
                <button onclick="viewStudentDetails('${s.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold">
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

function renderStudentsTable() {
    const tbody = document.getElementById('allStudentsTable');
    if (!tbody) return;

    const search = (document.getElementById('studentSearchInput')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('studentStatusFilter')?.value || '';

    let filtered = allStudents;
    if (statusFilter) {
        filtered = filtered.filter(s => s.status === statusFilter);
    }
    if (search) {
        filtered = filtered.filter(s =>
            (s.fullName || '').toLowerCase().includes(search) ||
            (s.email || '').toLowerCase().includes(search) ||
            (s.course || '').toLowerCase().includes(search) ||
            (s.phone || '').includes(search)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-slate-500">No matching student registrations found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(s => `
        <tr class="hover:bg-slate-800/30 transition">
            <td class="py-3 px-3">
                <div class="font-bold text-white text-sm">${escapeHTML(s.fullName)}</div>
                <div class="text-[10px] text-slate-400 font-mono">${escapeHTML(s.email)} • ${escapeHTML(s.phone || '')}</div>
            </td>
            <td class="py-3 px-3 font-semibold text-slate-200">${escapeHTML(s.course || 'Full-Stack Web Dev')}</td>
            <td class="py-3 px-3 text-slate-400">${escapeHTML(s.learningMode || 'Physical Onsite')}</td>
            <td class="py-3 px-3 text-slate-400 font-mono text-[10px]">${escapeHTML((s.createdAt || '').substring(0, 10))}</td>
            <td class="py-3 px-3">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(s.status)}">
                    ${escapeHTML(s.status || 'pending')}
                </span>
            </td>
            <td class="py-3 px-3 text-right">
                <div class="flex items-center justify-end gap-1.5">
                    <button onclick="viewStudentDetails('${s.id}')" title="View details"
                        class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    ${s.status !== 'approved' && s.status !== 'enrolled' ? `
                        <button onclick="updateStudentStatus('${s.id}', 'approved')" title="Approve application"
                            class="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white text-xs font-bold transition">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    ` : `
                        <button onclick="updateStudentStatus('${s.id}', 'enrolled')" title="Mark as enrolled student"
                            class="px-2.5 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white text-xs font-bold transition">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </button>
                    `}
                    <button onclick="deleteStudent('${s.id}')" title="Delete application"
                        class="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'approved': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
        case 'enrolled': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
        case 'rejected': return 'bg-red-500/15 text-red-400 border border-red-500/30';
        default: return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    }
}

window.updateStudentStatus = async function (id, newStatus) {
    try {
        const res = await GtrendAPI.updateUserStatus(id, newStatus);
        if (res && res.success) {
            loadStudents();
            loadDashboardStats();
        }
    } catch (e) {
        console.error('Update status failed:', e);
    }
};

window.deleteStudent = async function (id) {
    if (confirm('Delete this registration record permanently?')) {
        try {
            await GtrendAPI.deleteUser(id);
            loadStudents();
            loadDashboardStats();
        } catch (e) {}
    }
};

window.viewStudentDetails = function (id) {
    const s = allStudents.find(item => item.id === id);
    if (!s) return;

    document.getElementById('modalStudentName').textContent = s.fullName;
    document.getElementById('modalStudentID').textContent = 'ID: ' + s.id + ' • ' + (s.status || 'pending').toUpperCase();

    const details = document.getElementById('modalStudentDetails');
    details.innerHTML = `
        <div class="grid grid-cols-2 gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div><span class="text-slate-500">Email:</span> <span class="text-white font-bold">${escapeHTML(s.email)}</span></div>
            <div><span class="text-slate-500">Phone:</span> <span class="text-white font-bold">${escapeHTML(s.phone)}</span></div>
            <div><span class="text-slate-500">Course:</span> <span class="text-amber-400 font-bold">${escapeHTML(s.course)}</span></div>
            <div><span class="text-slate-500">Learning Mode:</span> <span class="text-white">${escapeHTML(s.learningMode || 'Onsite')}</span></div>
            <div><span class="text-slate-500">Age Bracket:</span> <span class="text-white">${escapeHTML(s.ageBracket || 'N/A')}</span></div>
            <div><span class="text-slate-500">Laptop:</span> <span class="text-white">${escapeHTML(s.laptopStatus || 'Yes')} (${escapeHTML(s.laptopOS || 'Win')})</span></div>
            <div class="col-span-2"><span class="text-slate-500">Address:</span> <span class="text-white">${escapeHTML(s.address || 'N/A')}</span></div>
        </div>
        <div>
            <span class="block text-slate-500 font-bold uppercase text-[10px] mb-1">Reason / Motivation:</span>
            <p class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">${escapeHTML(s.reason || 'No statement provided.')}</p>
        </div>
        <div class="flex items-center gap-2 pt-2">
            <button onclick="updateStudentStatus('${s.id}', 'approved'); closeStudentModal();" class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition">
                <i class="fa-solid fa-check mr-1"></i> Approve Application
            </button>
            <button onclick="updateStudentStatus('${s.id}', 'rejected'); closeStudentModal();" class="px-4 py-3 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold transition">
                Reject
            </button>
        </div>
    `;

    document.getElementById('studentModal').classList.remove('hidden');
};

window.closeStudentModal = function () {
    document.getElementById('studentModal').classList.add('hidden');
};

window.exportStudentsCSV = function () {
    if (allStudents.length === 0) return alert('No students to export.');
    let csv = 'ID,Full Name,Email,Phone,Course,Learning Mode,Status,Date\n';
    allStudents.forEach(s => {
        csv += `"${s.id}","${s.fullName}","${s.email}","${s.phone}","${s.course}","${s.learningMode}","${s.status}","${s.createdAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gtrend_Students_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
};

// 3. NEWS MANAGER
async function loadNews() {
    try {
        const res = await GtrendAPI.getNews();
        if (res && res.data) {
            allNews = res.data;
            renderAdminNews();
        }
    } catch (e) {}
}

function renderAdminNews() {
    const container = document.getElementById('adminNewsList');
    if (!container) return;

    if (allNews.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-slate-500 text-xs">No news articles published yet.</div>';
        return;
    }

    container.innerHTML = allNews.map(item => `
        <div class="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <img src="${escapeHTML(item.image || '../assets/images/hero.jpg')}" alt="" class="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0">
                <div>
                    <span class="text-[10px] font-bold accent-text uppercase">${escapeHTML(item.category || 'News')} • ${escapeHTML(item.date || '')}</span>
                    <h4 class="font-bold text-sm text-white">${escapeHTML(item.title)}</h4>
                    <p class="text-xs text-slate-400 line-clamp-1">${escapeHTML(item.summary || item.content || '')}</p>
                </div>
            </div>
            <button onclick="deleteNewsItem('${item.id}')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition flex-shrink-0">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.handleCreateNews = async function (e) {
    e.preventDefault();
    const title = document.getElementById('newsTitle').value.trim();
    const category = document.getElementById('newsCategory').value;
    const summary = document.getElementById('newsSummary').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    const image = document.getElementById('newsImage').value.trim();
    const tags = document.getElementById('newsTags').value.trim();

    try {
        const res = await GtrendAPI.createNews({ title, category, summary, content, image, tags });
        if (res && res.success) {
            e.target.reset();
            loadNews();
            loadDashboardStats();
            alert('News article published successfully!');
        }
    } catch (err) {}
};

window.deleteNewsItem = async function (id) {
    if (confirm('Delete this news post?')) {
        await GtrendAPI.deleteNews(id);
        loadNews();
        loadDashboardStats();
    }
};

// 4. GALLERY MANAGER
async function loadGallery() {
    try {
        const res = await GtrendAPI.getGallery();
        if (res && res.data) {
            allGallery = res.data;
            renderAdminGallery();
        }
    } catch (e) {}
}

function renderAdminGallery() {
    const grid = document.getElementById('adminGalleryGrid');
    if (!grid) return;

    if (allGallery.length === 0) {
        grid.innerHTML = '<div class="p-6 text-center text-slate-500 text-xs col-span-3">No gallery items uploaded yet.</div>';
        return;
    }

    grid.innerHTML = allGallery.map(item => `
        <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden relative group">
            <img src="${escapeHTML(item.type === 'video' ? (item.thumbnail || '../assets/images/hero.jpg') : item.src)}" alt="" class="w-full h-36 object-cover">
            <div class="p-3">
                <span class="text-[10px] font-bold accent-text uppercase">${escapeHTML(item.category || item.type)}</span>
                <h5 class="font-bold text-xs text-white line-clamp-1">${escapeHTML(item.title)}</h5>
            </div>
            <button onclick="deleteGalleryItem('${item.id}')" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center text-xs transition">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.handleCreateGallery = async function (e) {
    e.preventDefault();
    const title = document.getElementById('galTitle').value.trim();
    const category = document.getElementById('galCategory').value;
    const type = document.getElementById('galType').value;
    const src = document.getElementById('galSrc').value.trim();
    const description = document.getElementById('galDesc').value.trim();

    try {
        const res = await GtrendAPI.createGallery({ title, category, type, src, description });
        if (res && res.success) {
            e.target.reset();
            loadGallery();
            loadDashboardStats();
            alert('Media showcase added!');
        }
    } catch (err) {}
};

window.deleteGalleryItem = async function (id) {
    if (confirm('Delete this gallery item?')) {
        await GtrendAPI.deleteGallery(id);
        loadGallery();
        loadDashboardStats();
    }
};

// 5. LIVE AGENT CHAT CONSOLE
async function loadAgentStatus() {
    try {
        const res = await GtrendAPI.getAgentStatus();
        if (res && res.data) {
            currentAgentStatus = res.data.agentStatus || 'online';
            const select = document.getElementById('agentStatusSelect');
            if (select) select.value = currentAgentStatus;
        }
    } catch (e) {}
}

window.handleAgentStatusChange = async function (newStatus) {
    currentAgentStatus = newStatus;
    try {
        await GtrendAPI.setAgentStatus(newStatus, 'Support Agent Sarah');
    } catch (e) {}
};

async function loadAdminChatSessions(silent = false) {
    try {
        const res = await GtrendAPI.getChatSessions();
        if (res && res.data) {
            renderChatSessionsList(res.data);
        }
    } catch (e) {}
}

function renderChatSessionsList(sessions) {
    const list = document.getElementById('adminChatSessionsList');
    if (!list) return;

    if (!sessions || sessions.length === 0) {
        list.innerHTML = '<div class="p-6 text-center text-slate-500 text-xs">No customer chat queues active.</div>';
        return;
    }

    list.innerHTML = sessions.map(s => {
        const isSelected = s.sessionId === activeChatSessionId;
        const lastMsg = s.messages && s.messages.length > 0 ? s.messages[s.messages.length - 1].text : 'Initiated conversation';
        return `
            <div onclick="selectChatSession('${s.sessionId}', '${escapeHTML(s.customerName)}')"
                class="p-3 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-amber-500/20 border border-amber-500/50' : 'hover:bg-slate-800/60 border border-transparent'
                }">
                <div class="flex items-center gap-3 overflow-hidden">
                    <div class="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        ${(s.customerName || 'C')[0].toUpperCase()}
                    </div>
                    <div class="overflow-hidden">
                        <div class="flex items-center gap-2">
                            <h4 class="font-bold text-xs text-white truncate">${escapeHTML(s.customerName || 'Visitor')}</h4>
                            <span class="w-1.5 h-1.5 rounded-full ${s.status === 'resolved' ? 'bg-slate-500' : 'bg-emerald-400'}"></span>
                        </div>
                        <p class="text-[11px] text-slate-400 truncate">${escapeHTML(lastMsg)}</p>
                    </div>
                </div>
                ${s.unreadCount > 0 ? `<span class="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">${s.unreadCount}</span>` : ''}
            </div>
        `;
    }).join('');
}

window.selectChatSession = function (sessionId, customerName) {
    activeChatSessionId = sessionId;
    document.getElementById('activeCustomerName').textContent = customerName || 'Customer';
    document.getElementById('activeCustomerStatus').textContent = `Session: ${sessionId} • Live Real-Time Thread`;
    document.getElementById('chatActiveActions').classList.remove('hidden');

    loadAdminChatSessions(true);
    fetchActiveChatMessages();
};

async function fetchActiveChatMessages(silent = false) {
    if (!activeChatSessionId) return;
    try {
        const res = await GtrendAPI.getChatMessages(activeChatSessionId);
        if (res && res.data && res.data.messages) {
            renderChatFeed(res.data.messages);
        }
    } catch (e) {}
}

function renderChatFeed(messages) {
    const feed = document.getElementById('adminChatFeed');
    if (!feed) return;

    feed.innerHTML = messages.map(msg => {
        const isAgent = msg.sender === 'agent';
        const isSystem = msg.sender === 'system';

        if (isSystem) {
            return `<div class="text-center my-2"><span class="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400">${escapeHTML(msg.text)}</span></div>`;
        }

        return `
            <div class="flex items-start gap-2 max-w-[85%] ${isAgent ? 'ml-auto justify-end' : ''}">
                ${!isAgent ? `
                    <div class="w-7 h-7 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        C
                    </div>
                ` : ''}
                <div class="p-3 rounded-2xl ${isAgent ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-tr-sm' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'}">
                    <div class="flex items-center justify-between gap-4 mb-1 text-[10px] ${isAgent ? 'text-amber-100' : 'text-slate-400'} font-bold">
                        <span>${escapeHTML(msg.senderName || (isAgent ? 'You (Agent)' : 'Customer'))}</span>
                        <span class="font-mono text-[9px] opacity-75">${escapeHTML(msg.time || '')}</span>
                    </div>
                    <p class="text-xs whitespace-pre-line leading-relaxed">${escapeHTML(msg.text)}</p>
                </div>
            </div>
        `;
    }).join('');

    feed.scrollTop = feed.scrollHeight;
}

window.handleAdminSendMessage = async function (e) {
    e.preventDefault();
    if (!activeChatSessionId) return alert('Please select an active conversation from the queue first.');

    const input = document.getElementById('adminChatMessageInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    try {
        await GtrendAPI.sendMessage({
            sessionId: activeChatSessionId,
            sender: 'agent',
            senderName: 'Agent Sarah',
            text: text
        });
        fetchActiveChatMessages();
    } catch (err) {
        console.error('Send message error:', err);
    }
};

window.insertCannedReply = function (text) {
    const input = document.getElementById('adminChatMessageInput');
    if (input) {
        input.value = text;
        input.focus();
    }
};

window.resolveCurrentChat = async function () {
    if (!activeChatSessionId) return;
    if (confirm('Resolve and close this customer support ticket?')) {
        await GtrendAPI.resolveChat(activeChatSessionId);
        fetchActiveChatMessages();
        loadAdminChatSessions();
    }
};

// 6. INQUIRIES
async function loadInquiries() {
    try {
        const res = await GtrendAPI.getInquiries();
        if (res && res.data) {
            allInquiries = res.data;
            renderAdminInquiries();
            const badge = document.getElementById('badgeInquiries');
            if (badge) {
                const pending = allInquiries.filter(i => i.status === 'pending').length;
                if (pending > 0) {
                    badge.textContent = pending;
                    badge.classList.remove('hidden');
                }
            }
        }
    } catch (e) {}
}

function renderAdminInquiries() {
    const list = document.getElementById('adminInquiriesList');
    if (!list) return;

    if (allInquiries.length === 0) {
        list.innerHTML = '<div class="p-6 text-center text-slate-500 text-xs">No inquiries submitted yet.</div>';
        return;
    }

    list.innerHTML = allInquiries.map(inq => `
        <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-bold text-sm text-white">${escapeHTML(inq.name)} <span class="text-xs text-slate-400 font-normal">(${escapeHTML(inq.email)} • ${escapeHTML(inq.phone || '')})</span></h4>
                    <span class="text-[11px] font-bold accent-text uppercase">${escapeHTML(inq.service || 'Inquiry')}</span>
                </div>
                <span class="text-[10px] text-slate-400 font-mono">${escapeHTML(inq.date || '')}</span>
            </div>
            <p class="text-xs text-slate-300 p-3 bg-slate-900 rounded-xl border border-slate-800 leading-relaxed">${escapeHTML(inq.message)}</p>
        </div>
    `).join('');
}

window.logoutAdmin = function () {
    localStorage.removeItem('gtrend_token');
    localStorage.removeItem('gtrend_user');
    window.location.href = '../login.html';
};

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
