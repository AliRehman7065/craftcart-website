# MongoDB Atlas Free Tier Setup Guide

## Step-by-Step Instructions

### 1. Complete the MongoDB Atlas Cluster Setup

You're already on the right screen! Here's what to do:

1. **Select the FREE tier** (the 3rd option from left):
   - ✅ **Free** - 512 MB Storage
   - ✅ Shared RAM and vCPU
   - Perfect for development and learning!

2. **Provider**: Select **AWS** (already selected - good!)

3. **Region**: Keep **Frankfurt (eu-central-1)** or choose closest to you

4. **Cluster Name**: Keep "Cluster0" or name it "craftcart"

5. Click **"Create Deployment"** button (bottom right)

### 2. Create Database User

After creating the cluster, you'll see a security setup screen:

1. **Create a Database User**:
   - Username: `craftcart_user` (or any name you want)
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Or create your own password (REMEMBER IT!)
   - Click "Create Database User"

### 3. Set Network Access

1. **Add Your IP Address**:
   - Click "Add My Current IP Address"
   - Or for development, add `0.0.0.0/0` (allows from anywhere)
   - Click "Finish and Close"

### 4. Get Your Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select **Driver**: Node.js
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://craftcart_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. Update Your .env File

1. Open `.env` file in your project
2. Replace the MongoDB URI:

```env
MONGODB_URI=mongodb+srv://craftcart_user:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/craftcart?retryWrites=true&w=majority
```

**Important**: 
- Replace `<password>` or `YOUR_PASSWORD_HERE` with your actual password
- Add `/craftcart` before the `?` to specify the database name

Example:
```env
MONGODB_URI=mongodb+srv://craftcart_user:MySecurePass123@cluster0.abc123.mongodb.net/craftcart?retryWrites=true&w=majority
```

### 6. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C in the terminal running npm run dev)
# Then restart:
npm run dev
```

### 7. Verify Connection

Check your terminal for:
```
✅ MongoDB connected successfully
📊 Database: craftcart
```

If you see this, you're all set! 🎉

## Troubleshooting

### Error: "Authentication failed"
- Check your password in the connection string
- Make sure you replaced `<password>` with actual password
- No special characters should be URL-encoded

### Error: "Network timeout"
- Check Network Access settings in MongoDB Atlas
- Make sure your IP is whitelisted or use `0.0.0.0/0`

### Error: "Database not found"
- Make sure you added `/craftcart` in the connection string
- MongoDB will create the database automatically when first data is inserted

## What's Next?

Once MongoDB is connected:

1. ✅ Test user registration at http://localhost:3000/auth/register
2. ✅ Try logging in at http://localhost:3000/auth/login
3. ✅ Your data will be stored in MongoDB Atlas!

## Free Tier Limits

The free tier (M0) includes:
- ✅ 512 MB storage (plenty for MVP!)
- ✅ Shared RAM & vCPU
- ✅ No time limit (free forever!)
- ✅ Perfect for development and small projects

You can upgrade later if needed, but this is great for now!
