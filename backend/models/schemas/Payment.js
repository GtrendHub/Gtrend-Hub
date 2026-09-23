const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    reference: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true },
    fullName: { type: String, default: '' },
    amount: { type: Number, required: true },
    purpose: { type: String, default: 'Tuition Fee' },
    course: { type: String, default: 'General' },
    phone: { type: String, default: '' },
    status: { type: String, default: 'Success' },
    date: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
