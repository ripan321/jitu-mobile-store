# Jitu Mobile & Electronics — Backend Setup Guide

## Project Structure
```
jitu-mobile-store/
├── client/          ← React frontend (already built)
└── server/          ← Node.js backend (new)
    ├── models/      ← MongoDB schemas
    ├── routes/      ← API endpoints
    ├── middleware/  ← JWT auth
    ├── utils/       ← Email service
    ├── config/      ← DB + Cloudinary
    ├── index.js     ← Main server
    ├── seed.js      ← Database setup
    └── .env.example ← Environment variables template
```

---

## Step 1 — Install Node.js

Download from: https://nodejs.org → Choose **LTS version (18 or 20)**

After install, open terminal and verify:
```bash
node --version   # Should show v18.x or v20.x
npm --version    # Should show 9.x or 10.x
```

---

## Step 2 — Install Server Dependencies

Open terminal in the `server` folder:
```bash
cd jitu-mobile-store/server
npm install
```

---

## Step 3 — Set Up MongoDB Atlas (Free)

1. Go to: https://cloud.mongodb.com
2. Click **"Try Free"** → Sign up with Google
3. Choose **"Free"** tier → Region: **Mumbai (ap-south-1)**
4. Click **"Create Cluster"** (takes ~2 minutes)
5. Go to **"Database Access"** → Add user → Username: `jitu`, Password: create strong password
6. Go to **"Network Access"** → Add IP Address → **"Allow Access From Anywhere"** (0.0.0.0/0)
7. Go to **"Database"** → Click **"Connect"** → **"Drivers"**
8. Copy the connection string — looks like:
   ```
   mongodb+srv://jitu:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/
   ```

---

## Step 4 — Set Up Gmail App Password

(For sending emails when orders are placed)

1. Go to your Google Account → **Security**
2. Turn ON **2-Step Verification** (if not already on)
3. Search for **"App Passwords"** → Select app: **Mail** → Device: **Other** → name it "JituMobile"
4. Google gives you a 16-character password like: `abcd efgh ijkl mnop`
5. Save this — you'll need it below

---

## Step 5 — Set Up Cloudinary (Free Image Hosting)

1. Go to: https://cloudinary.com → Sign up free
2. After login, go to **Dashboard**
3. Copy: **Cloud Name**, **API Key**, **API Secret**

---

## Step 6 — Create .env File

In the `server` folder, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://jitu:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/jitu-mobile?retryWrites=true&w=majority
JWT_SECRET=make_this_a_very_long_random_string_at_least_64_characters
JWT_EXPIRE=7d
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD=YourStrongPassword@123
ADMIN_NAME=Jitu Mobile Admin
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=abcd_efgh_ijkl_mnop
EMAIL_FROM="Jitu Mobile Store <your_gmail@gmail.com>"
ADMIN_NOTIFY_EMAIL=your_email@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

---

## Step 7 — Seed the Database (Run Once)

```bash
cd jitu-mobile-store/server
node seed.js
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Admin created: your_email@gmail.com
✅ Sample products seeded (3 products)
🎉 Database setup complete!
```

---

## Step 8 — Run Everything

**Terminal 1 — Start Backend:**
```bash
cd jitu-mobile-store/server
npm run dev
```
You should see: `🚀 Server running on http://localhost:5000`

**Terminal 2 — Start Frontend:**
```bash
cd jitu-mobile-store/client
npm run dev
```
You should see: `Local: http://localhost:3000`

---

## Step 9 — Update Admin Login

The admin login now uses your real email and password from `.env`.
Go to: http://localhost:3000/admin

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Admin login |
| GET | /api/auth/me | Yes | Get current admin |
| GET | /api/products | No | All products |
| POST | /api/products | Yes | Add product |
| PUT | /api/products/:id | Yes | Update product |
| DELETE | /api/products/:id | Yes | Delete product |
| PATCH | /api/products/:id/stock | Yes | Toggle stock |
| POST | /api/orders | No | Place order |
| GET | /api/orders | Yes | All orders |
| PATCH | /api/orders/:id/status | Yes | Update order status |
| POST | /api/repairs | No | Book repair |
| GET | /api/repairs | Yes | All repair bookings |
| PATCH | /api/repairs/:id/status | Yes | Update repair status |

---

## Troubleshooting

**MongoDB connection fails:**
- Check your IP is whitelisted in MongoDB Atlas Network Access
- Double-check the password in the connection string

**Emails not sending:**
- Make sure 2-Step Verification is ON in Google Account
- The App Password should be 16 characters, paste without spaces
- Check spam folder for first few emails

**Port already in use:**
- Change PORT in .env to 5001 or 5002

---

## Next Step: Deploy Online (Step 2)
Once backend is working locally, we'll deploy to Railway (backend) + Vercel (frontend) so customers can use it from anywhere.
