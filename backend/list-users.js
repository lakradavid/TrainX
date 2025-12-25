const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const listUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('👥 Checking existing users...');
    const users = await User.find({}, 'username email createdAt').sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('\n💡 Solutions:');
      console.log('1. Create a test user: node create-test-user.js');
      console.log('2. Register a new account on the registration page');
      console.log('3. Or use the registration form in the app');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      console.log('');
      users.forEach((user, index) => {
        console.log(`${index + 1}. 👤 ${user.username}`);
        console.log(`   📧 ${user.email}`);
        console.log(`   📅 Created: ${user.createdAt?.toLocaleDateString() || 'Unknown'}`);
        console.log('');
      });
      
      console.log('💡 Try logging in with one of these email addresses');
      console.log('🔑 If you forgot the password, you may need to create a new account');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
    process.exit(1);
  }
};

console.log('🔍 Checking existing users in database...\n');
listUsers();