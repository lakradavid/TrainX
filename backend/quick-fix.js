const dotenv = require('dotenv');
const dns = require('dns');
const { promisify } = require('util');

dotenv.config();

const lookup = promisify(dns.lookup);

const quickDiagnostic = async () => {
    console.log('🔍 Running Quick Database Diagnostic...\n');
    
    // Check 1: Environment variables
    console.log('1️⃣ Checking environment variables...');
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found in .env file');
        return;
    }
    console.log('✅ MONGODB_URI found');
    
    // Check 2: Parse connection string
    console.log('\n2️⃣ Parsing connection string...');
    try {
        const uri = process.env.MONGODB_URI;
        const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)/);
        if (match) {
            const [, username, password, host] = match;
            console.log('✅ Username:', username);
            console.log('✅ Host:', host);
            console.log('✅ Password:', password.length > 0 ? '***' : 'MISSING');
        }
    } catch (error) {
        console.error('❌ Invalid connection string format');
    }
    
    // Check 3: DNS resolution
    console.log('\n3️⃣ Testing DNS resolution...');
    try {
        const host = 'virtual-trainer-cluster.micnqr5.mongodb.net';
        await lookup(host);
        console.log('✅ DNS resolution successful');
    } catch (error) {
        console.error('❌ DNS resolution failed:', error.message);
        console.error('💡 Check your internet connection');
    }
    
    // Check 4: Common issues
    console.log('\n4️⃣ Common issue checklist:');
    console.log('□ Is your MongoDB Atlas cluster active (not paused)?');
    console.log('□ Is your IP address whitelisted in Network Access?');
    console.log('□ Is your database user password correct?');
    console.log('□ Do you have stable internet connection?');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Run: node test-db.js');
    console.log('2. Check MongoDB Atlas dashboard');
    console.log('3. Restart backend: npm start');
};

quickDiagnostic().catch(console.error);