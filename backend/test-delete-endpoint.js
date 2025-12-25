const http = require('http');

const testDeleteEndpoint = async () => {
  try {
    console.log('🔍 Testing DELETE endpoint...');
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/workouts/plans/test-id',
      method: 'DELETE'
    };

    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      
      if (res.statusCode === 401) {
        console.log('✅ DELETE endpoint exists (got 401 Unauthorized - expected)');
        console.log('💡 This means the delete route is working, just needs authentication');
      } else if (res.statusCode === 404) {
        console.log('❌ DELETE endpoint NOT found (404)');
        console.log('🔧 Backend needs to be restarted to pick up new delete route');
      } else {
        console.log('⚠️ Unexpected response:', res.statusCode);
      }
    });

    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Cannot connect to backend server');
        console.log('🔧 Make sure backend is running on http://localhost:5000');
      } else {
        console.log('⚠️ Request error:', error.message);
      }
    });

    req.end();
    
  } catch (error) {
    console.log('⚠️ Test error:', error.message);
  }
};

console.log('🧪 Testing DELETE endpoint availability...\n');
testDeleteEndpoint();