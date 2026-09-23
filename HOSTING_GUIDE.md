# 🌐 Gtrend Tech Hub - Production Hosting & Deployment Guide

This guide details how to deploy the Gtrend Tech Hub platform across various hosting providers.

---

## 🚀 Option 1: One-Click Cloud Hosting (Render / Railway / Cyclic)

### Render.com (Recommended for Free/Low-Cost Node.js Hosting)
1. Push your project to GitHub or GitLab.
2. Sign in to [Render](https://render.com) and click **New + Web Service**.
3. Connect your repository.
4. Set the following configurations:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT`: `3000` (or leave default assigned by Render)
     - `JWT_SECRET`: `your_custom_secure_secret_string`
5. Click **Create Web Service**. Your live URL will be ready in under 2 minutes.

### Railway.app
1. Create a new project on [Railway.app](https://railway.app).
2. Deploy from your GitHub repository.
3. In service settings, set **Root Directory** to `backend`.
4. Railway automatically installs dependencies and executes `npm start`.

---

## 🖥️ Option 2: VPS / Linux Server (Ubuntu / Debian / Nginx / PM2)

### 1. Install Node.js & PM2
```bash
sudo apt update && sudo apt install -y nodejs npm
sudo npm install -g pm2
```

### 2. Clone & Setup Project
```bash
git clone <your-repo-url> /var/www/gtrend-hub
cd /var/www/gtrend-hub/backend
npm install
```

### 3. Launch with PM2 (Process Manager with Auto-Restart)
```bash
pm2 start server.js --name "gtrend-hub"
pm2 startup
pm2 save
```

### 4. Configure Nginx Reverse Proxy
Edit `/etc/nginx/sites-available/gtrend`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/gtrend /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 📦 Option 3: cPanel with "Setup Node.js App"
1. In cPanel, navigate to **Software** -> **Setup Node.js App**.
2. Click **Create Application**.
3. Select Node.js version (`18.x` or `20.x`).
4. Set **Application Root** to `public_html/backend` (or your backend folder).
5. Set **Application Startup File** to `server.js`.
6. Click **Create**, then click **Run NPM Install**.
7. Click **Restart** to boot your platform live.

---

## 🔒 Security Recommendations for Production
- Change default admin password after first login in Admin Dashboard.
- Set a strong `JWT_SECRET` in environment variables.
- Ensure SSL/HTTPS certificate is active (via Let's Encrypt / Certbot / Cloudflare).
