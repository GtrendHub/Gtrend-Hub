/**
 * Gtrend Tech Hub - Environment & Server Configuration
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '.env');
const atlasPath = path.join(__dirname, '..', 'atlas-credentials.env');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}
if (fs.existsSync(atlasPath)) {
    dotenv.config({ path: atlasPath });
}

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gtrend_hub',
    JWT_SECRET: process.env.JWT_SECRET || 'gtrend_tech_hub_super_secure_jwt_secret_key_2026',
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_sample_gtrend_paystack_public_key',
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || 'sk_test_sample_gtrend_paystack_secret_key',
    CURRENCY: 'NGN',
    ADMIN_EMAIL: 'admin@gtrend.com',
    DEFAULT_TUITION_FEE: 35000 // In Naira (NGN)
};


