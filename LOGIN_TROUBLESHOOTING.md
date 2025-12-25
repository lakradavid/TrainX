# Login Server Error Troubleshooting 🔧

## Common Causes & Solutions

### 1. Backend Server Not Running
**Check if your backend server is running:**

```bash
# Navigate to backend directory
cd virtual-personal-trainer/backend

# Start the server
npm start
# OR for development with auto-restart
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
MongoDB connected successfully
```

### 2. MongoDB Connection Issues
**If you see MongoDB connection errors:**

- Check your internet connection
- Verify MongoDB Atlas cluster is running
- Check if the connection string in `.env` is correct
- Make sure your IP is whitelisted in MongoDB Atlas

### 3. Missing Dependencies
**Install backend dependencies:**

```bash
cd virtual-personal-trainer/backend
npm install
```

### 4. Environment Variables
**Check if `.env` file exists with:**
```
PORT=5000
JWT_SECRET=supersecretkey12345678901234567890changeThisInProduction
MONGODB_URI=mongodb+srv://myuser:david22%40@virtual-trainer-cluster.micnqr5.mongodb.net/virtual-trainer?retryWrites=true&w=majority
```

### 5. CORS Issues
**If you get CORS errors, the backend should have:**
```javascript
app.use(cors());
```

### 6. Port Conflicts
**If port 5000 is busy:**
- Change PORT in `.env` to 5001 or another port
- Update frontend API URL in `src/services/api.js`

## Quick Diagnostic Steps

### Step 1: Test Backend Directly
Open browser and go to: `http://localhost:5000`
- Should show: "Virtual Personal Trainer Backend is running!"

### Step 2: Test Login Endpoint
Use a tool like Postman or curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Step 3: Check Browser Console
- Open Developer Tools (F12)
- Look for network errors or console errors
- Check if API calls are reaching the backend

### Step 4: Check Backend Logs
Look at your backend terminal for error messages when login fails.

## Most Likely Solutions

### Solution 1: Restart Backend Server
```bash
# Stop server (Ctrl+C)
# Then restart
cd virtual-personal-trainer/backend
npm start
```

### Solution 2: Check API URL
In `frontend/src/services/api.js`, make sure the API_URL is correct:
```javascript
const API_URL = 'http://localhost:5000/api';
```

### Solution 3: Create Test User
If you don't have a user account, register first or create one directly in MongoDB.

## Error Messages & Solutions

### "Network Error"
- Backend server is not running
- Wrong API URL in frontend
- CORS issues

### "Request failed with status code 500"
- Server error (check backend logs)
- Database connection issues
- Missing environment variables

### "Request failed with status code 401"
- Wrong email/password
- User doesn't exist

### "Request failed with status code 404"
- Wrong API endpoint URL
- Backend routes not properly configured

## Testing the Fix

1. **Start backend server**
2. **Go to login page**
3. **Try logging in with existing credentials**
4. **Check browser console for errors**
5. **Check backend terminal for error logs**

If you're still getting errors, please share:
1. The exact error message from browser console
2. Any error logs from backend terminal
3. Whether the backend server is running and accessible at http://localhost:5000