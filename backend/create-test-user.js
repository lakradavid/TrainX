const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createTestUser = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('👤 Test user already exists!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: password123');
      console.log('✅ You can login with these credentials');
      process.exit(0);
    }

    // Create test user
    console.log('👤 Creating test user...');
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: password123');
    console.log('👤 Username: testuser');
    console.log('\n🎉 You can now login with these credentials!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    
    if (error.code === 11000) {
      console.error('🔄 User might already exist. Try logging in with:');
      console.error('📧 Email: test@example.com');
      console.error('🔑 Password: password123');
    }
    
    process.exit(1);
  }
};

console.log('🚀 Creating test user for login...\n');
createTestUser();