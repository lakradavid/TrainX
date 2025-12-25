const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testAuth = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🧪 Testing authentication system...');

    // Test 1: Create a test user
    console.log('\n1️⃣ Creating test user...');
    
    // Remove existing test user if exists
    await User.deleteOne({ email: 'auth-test@example.com' });
    
    const testUser = await User.create({
      username: 'authtest',
      email: 'auth-test@example.com',
      password: 'testpass123'
    });
    
    console.log('✅ Test user created');
    console.log('📧 Email:', testUser.email);
    console.log('🔐 Password stored as hash:', testUser.password.substring(0, 20) + '...');

    // Test 2: Find user by email
    console.log('\n2️⃣ Testing user lookup...');
    const foundUser = await User.findOne({ email: 'auth-test@example.com' });
    if (foundUser) {
      console.log('✅ User found by email');
    } else {
      console.log('❌ User not found by email');
      return;
    }

    // Test 3: Test correct password
    console.log('\n3️⃣ Testing correct password...');
    const isCorrectPassword = await foundUser.comparePassword('testpass123');
    if (isCorrectPassword) {
      console.log('✅ Correct password validation works');
    } else {
      console.log('❌ Correct password validation failed');
    }

    // Test 4: Test wrong password
    console.log('\n4️⃣ Testing wrong password...');
    const isWrongPassword = await foundUser.comparePassword('wrongpassword');
    if (!isWrongPassword) {
      console.log('✅ Wrong password correctly rejected');
    } else {
      console.log('❌ Wrong password incorrectly accepted');
    }

    // Test 5: Simulate login process
    console.log('\n5️⃣ Simulating login process...');
    const loginEmail = 'auth-test@example.com';
    const loginPassword = 'testpass123';

    const loginUser = await User.findOne({ email: loginEmail });
    if (!loginUser) {
      console.log('❌ Login simulation: User not found');
    } else {
      const loginSuccess = await loginUser.comparePassword(loginPassword);
      if (loginSuccess) {
        console.log('✅ Login simulation: SUCCESS');
      } else {
        console.log('❌ Login simulation: Password mismatch');
      }
    }

    // Clean up
    await User.deleteOne({ email: 'auth-test@example.com' });
    console.log('\n🧹 Cleaned up test user');

    console.log('\n🎉 Authentication system test completed!');
    console.log('\n💡 If all tests passed, your auth system is working correctly.');
    console.log('   The login issue is likely due to no user accounts existing.');
    console.log('   Run: node create-test-user.js');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    console.error('\n🔧 This indicates an issue with:');
    console.error('- User model');
    console.error('- Password hashing');
    console.error('- Database operations');
    process.exit(1);
  }
};

console.log('🔐 Testing Authentication System...\n');
testAuth();