import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

// Graceful disconnection on app shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed (app shutdown).');
    process.exit(0);
});

export default connectDB;
