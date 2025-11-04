# MongoDB Installation Guide for Windows

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. Keep default settings
5. Click "Install"

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

### Step 4: Start MongoDB Service
MongoDB should start automatically. If not:
```powershell
net start MongoDB
```

### Step 5: Test Connection
```powershell
mongosh
```
Type `exit` to quit.

---

## Option 2: Use MongoDB Atlas (Cloud - Free Tier)

If you don't want to install MongoDB locally, use MongoDB Atlas (cloud database):

### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free

### Step 2: Create Cluster
1. Choose "Free" tier (M0)
2. Select a cloud provider and region
3. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Save credentials!

### Step 4: Whitelist IP
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Confirm

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fake_news_detect?retryWrites=true&w=majority
```

### Step 6: Update Backend .env
Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fake_news_detect?retryWrites=true&w=majority
```

### Step 7: Restart Backend
```bash
cd backend
# Kill the current process (Ctrl+C)
npm run dev
```

---

## Option 3: Quick Development Mode (In-Memory)

For quick testing without MongoDB, I can create a temporary in-memory storage solution.

---

## Which Option Do You Prefer?

1. **Install MongoDB locally** - Best for development, full control
2. **Use MongoDB Atlas** - No installation, cloud-based, free tier available
3. **In-memory mode** - Quick testing only, data lost on restart

Let me know and I'll help you set it up!
