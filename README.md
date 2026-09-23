# 🚀 Gtrend Tech Hub Platform

> **Empowering Innovation, Driving Digital Excellence**  
> Complete Web Platform with 12 Core Services, Academy Portal, News & Events Feed, Media Gallery, Multi-Tier Support Chatbot & Real-Time Agent Console, and Secure Admin Dashboard. Built with **Node.js, Express, and Modern Vanilla JavaScript**.

---

## 🌟 Key Features

1. **12 High-Impact Service Cards**:
   - Web & App Development
   - AI & Automation
   - UI/UX & Graphic Design
   - Networking & ICT Solutions
   - Starlink & Internet Solutions
   - Database & Digital Systems
   - GPS & Tracking Solutions
   - Cybersecurity
   - Digital Transformation
   - IT Consulting & Support
   - Multimedia Production
   - Tech Training
   - *Each card features tailored service descriptions, distinct "Why choose Gtrend?" value propositions, and instant consultation actions.*

2. **Dedicated Tech Academy & Courses Portal (`courses.html`)**:
   - Comprehensive track catalogs: Web Development, AI & Data, UI/UX Design, Cybersecurity, ICT & Networking, Kids Tech.
   - Interactive track filters, course syllabus breakdowns, requirements, and direct admission enrollment.

3. **Node.js + Express Backend (`server.js`)**:
   - High-performance Express REST API backend.
   - Secure Authentication with JWT and password hashing (`backend/auth.js`).
   - JSON-driven database persistence (`backend/db.js`) for users, news, gallery, inquiries, and chat sessions.
   - Cross-Origin Resource Sharing (CORS) enabled with fallback resilience.

4. **Dedicated News & Project Feed (`news.html`)**:
   - Categorized announcements, events, system updates, and hub projects.
   - Real-time search, category filters, and modal reader.
   - Dynamic live preview directly embedded on the homepage.

5. **Image & Video Gallery (`gallery.html`)**:
   - Filterable multimedia showcase (Campus, Lab & Systems, Training Cohorts, Projects, Tech Events).
   - High-resolution image view and embedded video player modal.
   - Dynamic live preview on homepage.

6. **Multi-tier Chatbot & Live Chat System (`assets/js/chat-widget.js`)**:
   - **Customer Entry**: Floating chat widget with sound notification and badge alerts.
   - **Tier 1 - Auto Responder**: Instant FAQ answers (courses, tuition, admissions, Starlink, consults).
   - **Tier 2 - Lead Capture**: Collects client name & email before human escalation.
   - **Tier 3 - Live Agent Request**: Enqueues ticket with "Connect to Agent" request.
   - **Tier 4 - Real-Time 2-Way Chat**: Agent responds directly from the Admin Console in real-time.

7. **Dedicated Admin Dashboard (`admin/index.html`)**:
   - **Overview**: Real-time KPI statistics (Total Trainees, Active News, Media Assets, Pending Inquiries).
   - **Student Applications Manager**: Review, approve, enroll, or reject registrations with instant CSV export.
   - **News & Updates Publisher**: Create, edit, and delete published news items.
   - **Media Gallery Manager**: Upload and categorize images/videos.
   - **Contact Inquiries**: Triage and resolve client inquiries.
   - **Live Agent Chat Console**: Status switcher (🟢 Online, 🟡 Busy, 🔴 Offline), conversation queues, canned responses, live messaging, and session resolution.

---

## 💻 Tech Stack

- **Backend**: Node.js, Express.js, JWT, BcryptJS, Multer
- **Database**: Local JSON Document Storage (`backend/models/db.js`)
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS Engine, FontAwesome Icons

---

## ⚡ Quick Start & Local Execution

### 1. Navigate to Backend & Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
```
*Or in development mode with auto-reload:*
```bash
npm run dev
```

### 3. Open in Browser
- **Main Website**: [http://localhost:3000](http://localhost:3000)
- **About Us**: [http://localhost:3000/about.html](http://localhost:3000/about.html)
- **Services**: [http://localhost:3000/services.html](http://localhost:3000/services.html)
- **Courses Portal**: [http://localhost:3000/courses.html](http://localhost:3000/courses.html)
- **News Feed**: [http://localhost:3000/news.html](http://localhost:3000/news.html)
- **Media Gallery**: [http://localhost:3000/gallery.html](http://localhost:3000/gallery.html)
- **Contact Us**: [http://localhost:3000/contact.html](http://localhost:3000/contact.html)
- **Student Login**: [http://localhost:3000/login.html](http://localhost:3000/login.html)
- **Admin Dashboard**: [http://localhost:3000/admin/index.html](http://localhost:3000/admin/index.html)

---

## 🔐 Default Credentials

| Portal | Username / Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin Console** | `admin@gtrend.com` | `admin123` | Hub Administrator |
| **Student Portal** | `student@gtrend.com` | `student123` | Trainee Student |

---

## 📁 Directory Structure

```
├── README.md              # Project documentation
├── HOSTING_GUIDE.md       # Production Deployment Manual
├── frontend/              # Static Frontend Web Application
│   ├── .gitignore         # Frontend-specific Git ignore
│   ├── index.html         # Main Landing Page
│   ├── about.html         # About Page & Leadership Team
│   ├── services.html      # 12 Core Services Showcase
│   ├── courses.html       # Tech Academy & Course Offerings
│   ├── news.html          # Hub News & Events Feed
│   ├── gallery.html       # Multimedia Photo & Video Gallery
│   ├── contact.html       # Contact & Inquiries Page
│   ├── login.html         # Student Authentication
│   ├── register.html      # Trainee Registration Portal
│   ├── admin/             # Administrator Console
│   │   ├── index.html     # Admin Management Suite & Live Agent Console
│   │   ├── login.html     # Admin Security Portal
│   │   └── admin.js       # Admin Dashboard Controller
│   └── assets/            # CSS, JavaScript & Media Assets
│       ├── css/           # CSS stylesheets (theme-light.css, etc.)
│       ├── js/            # Client scripts (api.js, chat-widget.js, tailwind.js)
│       ├── images/        # High-definition course, service, and hub imagery
│       └── webfonts/      # FontAwesome & typography
└── backend/               # Express.js REST API & Database Layer
    ├── .gitignore         # Backend-specific Git ignore (node_modules, etc.)
    ├── package.json       # Node.js dependencies & scripts
    ├── package-lock.json  # Dependency lockfile
    ├── node_modules/      # Installed Node packages
    ├── server.js          # Main Express Server Entry Point
    ├── config/            # Server configuration & environment defaults
    ├── controllers/       # Route controllers (auth, news, gallery, chat, etc.)
    ├── middleware/        # Authentication & security middlewares
    ├── models/            # Database abstraction & JSON adapter (db.js)
    ├── routes/            # REST API endpoint route definitions
    └── data/              # Persistent JSON storage
        ├── users.json
        ├── news.json
        ├── gallery.json
        ├── inquiries.json
        └── chat_sessions/
```

---

## 📄 License & Attribution
Designed and engineered for **Gtrend Tech Hub**. All rights reserved © 2026.
