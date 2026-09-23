/**
 * Gtrend Tech Hub - MongoDB Connection Manager
 */
const mongoose = require('mongoose');
const config = require('./index');

let isMongoConnected = false;

async function connectDB() {
    if (!config.MONGODB_URI) {
        console.log('ℹ️ [Database] No MONGODB_URI provided. Utilizing local JSON document database engine.');
        return false;
    }

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 3000 // Quick fallback if local MongoDB is not running
        });
        isMongoConnected = true;
        console.log(`✅ [Database] MongoDB successfully connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
        return true;
    } catch (err) {
        isMongoConnected = false;
        console.warn(`⚠️ [Database] MongoDB connection error (${err.message}). Gracefully using local JSON storage engine.`);
        return false;
    }
}

mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
    console.warn('⚠️ [Database] MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
    isMongoConnected = true;
    console.log('✅ [Database] MongoDB reconnected.');
});

function isConnected() {
    return isMongoConnected && mongoose.connection.readyState === 1;
}

module.exports = {
    connectDB,
    isConnected,
    mongoose
};
