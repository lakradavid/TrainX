const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 Connection string:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('🔌 Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    console.log('📝 Testing database write operations...');
    const testSchema = new mongoose.Schema({ 
      test: String, 
      timestamp: { type: Date, default: Date.now }
    });
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    const testDoc = new TestModel({ test: 'connection test' });
    await testDoc.save();
    console.log('✅ Database write test successful!');
    
    // Test reading the document
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Database read test successful!');
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Database delete test successful!');
    
    console.log('🎉 All database tests passed! Your MongoDB connection is working perfectly.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication issue - check username/password in connection string');
    } else if (error.message.includes('network')) {
      console.error('🌐 Network issue - check internet connection and MongoDB Atlas status');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout - MongoDB Atlas might be paused or unreachable');
    }
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check if MongoDB Atlas cluster is active (not paused)');
    console.error('2. Verify your IP is whitelisted in Network Access');
    console.error('3. Confirm username/password in connection string');
    console.error('4. Try resuming your MongoDB Atlas cluster');
    
    process.exit(1);
  }
};

console.log('🚀 Starting MongoDB connection test...\n');
testConnection();