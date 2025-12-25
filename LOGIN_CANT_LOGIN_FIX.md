# 🔐 Can't Login Fix - Server Running

## Your Situation
- ✅ Backend server is running
- ✅ Database is connected  
- ❌ Can't login with credentials

## Most Likely Causes & Fixes

### 1. No User Account Exists (90% of cases)

**Check if any users exist:**
```bash
cd virtual-personal-trainer/backend
node list-users.js
```

**If no users found, create a test user:**
```bash
node create-test-user.js
```

**Then login with:**
- 📧 Email: `test@example.com`
- 🔑 Password: `password123`

### 2. Wrong Password

**Reset password for existing user:**
```bash
cd virtual-personal-trainer/backend
node reset-password.js your-email@example.com
```

This sets the password to `password123`

### 3. User Exists But Password Hash Issue

**Create fresh test user:**
```bash
node create-test-user.js
```

### 4. Registration Instead of Login

**If you don't have an account:**
1. Go to the registration page
2. Create a new account
3. Then login with those credentials

## Step-by-Step Diagnosis

### Step 1: Check Users
```bash
cd virtual-personal-trainer/backend
node list-users.js
```

### Step 2A: If No Users Found
```bash
node create-test-user.js
```
Then login with: `test@example.com` / `password123`

### Step 2B: If Users Found
Try logging in with one of the listed email addresses.
If password doesn't work:
```bash
node reset-password.js user@example.com
```

### Step 3: Test Login
1. Go to login page
2. Use the credentials from the scripts
3. Should work now!

## Quick Test Credentials

**After running create-test-user.js:**
- 📧 Email: `test@example.com`
- 🔑 Password: `password123`
- 👤 Username: `testuser`

## Alternative: Register New Account

1. Go to `/register` page
2. Create new account with:
   - Username: anything you want
   - Email: your-email@example.com
   - Password: anything you want
3. Then login with those credentials

## Common Login Errors & Meanings

### "Invalid email or password"
- User doesn't exist, OR
- Wrong password, OR  
- Email typo

### "Server error"
- Database connection issue
- Backend error (check terminal)

### "Cannot connect to server"
- Backend not running
- Wrong API URL

## Success Indicators

**When login works, you should:**
1. See success message
2. Get redirected to `/dashboard`
3. See your workout plans page

## 99% Solution

**Most login issues are fixed by:**
```bash
cd virtual-personal-trainer/backend
node create-test-user.js
```

Then login with `test@example.com` / `password123`

This creates a guaranteed working account! 🎉