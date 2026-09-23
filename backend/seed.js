/**
 * Gtrend Tech Hub - Database Seeder
 * Seeds initial collections for MongoDB & local document store
 */
const db = require('./models/db');
const { hashPassword } = require('./middleware/authMiddleware');

const defaultUsers = [
    {
        id: 'usr-admin-01',
        email: 'admin@gtrend.com',
        name: 'Gtrend Super Administrator',
        role: 'admin',
        phone: '+234 706 697 6885',
        course: 'Executive Board',
        password: hashPassword('admin123')
    },
    {
        id: 'usr-student-01',
        email: 'student@gtrend.com',
        name: 'David Okon',
        role: 'student',
        phone: '+234 812 345 6789',
        course: 'Full-Stack Web Engineering',
        password: hashPassword('student123')
    },
    {
        id: 'usr-student-02',
        email: 'esther.chidi@example.com',
        name: 'Esther Chidi',
        role: 'student',
        phone: '+234 803 987 6543',
        course: 'AI & Data Engineering',
        password: hashPassword('student123')
    }
];

const defaultNews = [
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

const defaultGallery = [
    { id: 'gal-1', title: 'Main Development Studio & Academy Floor', category: 'Campus', type: 'image', url: './assets/images/hero-tech-bg.jpg', description: 'State-of-the-art tech workspace equipped with ultra-fast mesh fiber connectivity.' },
    { id: 'gal-2', title: 'Full-Stack Software Lab in Action', category: 'Training', type: 'image', url: './assets/images/course-web-dev.jpg', description: 'Hands-on practical session building scalable Node.js and React web applications.' },
    { id: 'gal-3', title: 'AI & Data Engineering Workstations', category: 'Projects', type: 'image', url: './assets/images/ai-automation.jpg', description: 'Students designing automated intelligent workflows and machine learning models.' },
    { id: 'gal-4', title: 'Enterprise Satellite & Network Testing Lab', category: 'Lab', type: 'image', url: './assets/images/starlink-network.jpg', description: 'Engineers configuring failover routing and Starlink satellite arrays.' },
    { id: 'gal-5', title: 'Cyber Threat Defense Operations Center', category: 'Lab', type: 'image', url: './assets/images/cybersecurity.jpg', description: 'Live threat monitoring and vulnerability auditing simulation room.' }
];

const defaultRegistrations = [
    {
        appId: 'GTR-10294',
        fullName: 'David Okon',
        email: 'student@gtrend.com',
        phone: '+234 812 345 6789',
        course: 'Full-Stack Web Engineering',
        learningMode: 'Physical Hub / Hybrid',
        experience: 'Beginner',
        schedule: 'Weekdays (Morning)',
        laptopChoice: 'Have Laptop',
        laptopOS: 'Windows',
        status: 'Enrolled',
        paymentStatus: 'Paid',
        paymentReference: 'GTREND-REF-10294',
        submissionDate: '9/20/2026, 10:15:00 AM'
    },
    {
        appId: 'GTR-38472',
        fullName: 'Esther Chidi',
        email: 'esther.chidi@example.com',
        phone: '+234 803 987 6543',
        course: 'AI & Data Engineering',
        learningMode: 'Hybrid',
        experience: 'Intermediate',
        schedule: 'Weekdays (Evening)',
        laptopChoice: 'Have Laptop',
        laptopOS: 'macOS',
        status: 'Pending Review',
        paymentStatus: 'Unpaid',
        submissionDate: '9/22/2026, 02:40:00 PM'
    },
    {
        appId: 'GTR-58392',
        fullName: 'Michael Adeleke',
        email: 'm.adeleke@example.com',
        phone: '+234 701 112 2334',
        course: 'UI/UX & Product Design',
        learningMode: 'Online Live',
        experience: 'Beginner',
        schedule: 'Weekend Executive',
        laptopChoice: 'Need Hub PC',
        laptopOS: 'Windows',
        status: 'Approved',
        paymentStatus: 'Paid (Deposit)',
        paymentReference: 'GTREND-REF-58392',
        submissionDate: '9/23/2026, 08:30:00 AM'
    }
];

const defaultInquiries = [
    {
        id: 'INQ-STARLINK-01',
        name: 'Chevron Offshore Logistics',
        email: 'procurement@chevron-contractor.ng',
        phone: '+234 802 000 1122',
        service: 'Starlink & Internet Solutions',
        message: 'Requesting quotation for 3 dual-dish high-performance Starlink arrays with automatic LTE failover in Warri base.',
        details: 'Requesting quotation for 3 dual-dish high-performance Starlink arrays with automatic LTE failover in Warri base.',
        time: '9/22/2026, 11:15 AM',
        status: 'Unread'
    },
    {
        id: 'INQ-TRAINING-02',
        name: 'Kome Benson',
        email: 'kome.benson@gmail.com',
        phone: '+234 815 443 3221',
        service: 'Tech Training (Bootcamps)',
        message: 'Inquiring about weekend cohort options for Mobile App Development with Flutter.',
        details: 'Inquiring about weekend cohort options for Mobile App Development with Flutter.',
        time: '9/23/2026, 09:45 AM',
        status: 'Contacted'
    }
];

const defaultChatStatus = {
    status: 'online',
    activeAgent: 'Engr. Victor Clifford (Head of Academy)',
    welcomeMessage: 'Hello! Welcome to Gtrend Tech Hub. How can our team assist you today?',
    lastUpdated: new Date().toISOString()
};

async function runSeed() {
    console.log('====================================================');
    console.log('🌱 Starting Gtrend Tech Hub Database Seeder...');
    console.log('====================================================');

    // 1. Attempt MongoDB connection
    const mongoConnected = await db.connectDB();

    // 2. Seed JSON document store (ensures offline reliability)
    console.log('📁 Writing local JSON data stores...');
    db.writeCollection('users', defaultUsers);
    db.writeCollection('news', defaultNews);
    db.writeCollection('gallery', defaultGallery);
    db.writeCollection('registrations', defaultRegistrations);
    db.writeCollection('inquiries', defaultInquiries);
    db.writeCollection('chat_status', defaultChatStatus);
    console.log('✅ Local JSON document files seeded successfully.');

    // 3. Seed MongoDB if connected
    if (mongoConnected && db.isConnected()) {
        try {
            console.log('🍃 Seeding MongoDB database collections...');

            // Users
            await db.User.deleteMany({});
            await db.User.insertMany(defaultUsers);
            console.log(`  - Users: ${defaultUsers.length} documents`);

            // News
            await db.News.deleteMany({});
            await db.News.insertMany(defaultNews);
            console.log(`  - News: ${defaultNews.length} documents`);

            // Gallery
            await db.Gallery.deleteMany({});
            await db.Gallery.insertMany(defaultGallery);
            console.log(`  - Gallery: ${defaultGallery.length} documents`);

            // Registrations
            await db.Registration.deleteMany({});
            await db.Registration.insertMany(defaultRegistrations);
            console.log(`  - Registrations: ${defaultRegistrations.length} documents`);

            // Inquiries
            await db.Inquiry.deleteMany({});
            await db.Inquiry.insertMany(defaultInquiries);
            console.log(`  - Inquiries: ${defaultInquiries.length} documents`);

            console.log('🎉 MongoDB Collections populated successfully!');
        } catch (err) {
            console.error('❌ Error seeding MongoDB collections:', err.message);
        }
    } else {
        console.log('ℹ️ MongoDB is currently offline. JSON storage is active and fully primed.');
    }

    console.log('====================================================');
    console.log('✨ Database seeding complete! Ready for platform use.');
    console.log('====================================================\n');
    process.exit(0);
}

runSeed();
