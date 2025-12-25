const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetPassword = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get email from command line argument
    const email = process.argv[2];
    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node reset-password.js user@example.com');
      process.exit(1);
    }

    console.log(`🔍 Looking for user with email: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found!');
      console.log('💡 Available options:');
      console.log('1. Check existing users: node list-users.js');
      console.log('2. Create test user: node create-test-user.js');
      console.log('3. Register a new account');
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.username}`);
    console.log('🔄 Resetting password to: password123');
    
    // Update password (will be hashed automatically by the pre-save hook)
    user.password = 'password123';
    await user.save();

    console.log('✅ Password reset successfully!');
    console.log(`📧 Email: ${user.email}`);
    console.log('🔑 New Password: password123');
    console.log('\n🎉 You can now login with these credentials!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    process.exit(1);
  }
};

console.log('🔐 Password Reset Tool\n');
resetPassword();