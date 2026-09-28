const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the connection string from environment variables
 */
const connectDB = async () => {
    // Read from process.env.MONGODB_URI or process.env.MONGO_URI (DevOps best practice)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie-booking';
    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`ℹ️  Note: Please ensure MongoDB is running locally or provide a valid MONGO_URI in backend/.env`);
    // Do not crash the entire process so server can still serve health check / helpful messages
  }
};

module.exports = connectDB;
