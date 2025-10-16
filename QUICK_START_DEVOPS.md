# 🚀 Quick Start for DevOps - 2 Minute Setup

## ✅ Status
- Logo: **Working** ✓
- API Calls: **Working** ✓
- CORS: **Resolved** ✓

---

## 📦 What You Need

1. **This repository** (contains everything)
2. **Docker** installed and running
3. **5 minutes** of your time

---

## 🎯 Deploy Now (Choose One)

### Option A: Docker Compose (Easiest)
```bash
docker compose up -d --build
```
**Access:** http://localhost:8080

### Option B: Docker CLI
```bash
docker build -t devportal:latest .
docker run -d --name devportal -p 8080:80 --restart unless-stopped devportal:latest
```
**Access:** http://localhost:8080

### Option C: Production Port (80)
```bash
docker compose up -d --build
# Then edit docker-compose.yml: Change "8080:80" to "80:80"
docker compose up -d --force-recreate
```
**Access:** http://your-server-ip

---

## ⚙️ Important Configuration

### Change Backend API URL
**File:** `docker/nginx.conf` (line 15)
```nginx
proxy_pass https://drap-sandbox.digitnine.com/;  # ← Change this
```
Then rebuild: `docker compose up -d --build`

### Change Port
**File:** `docker-compose.yml` (line 11)
```yaml
ports:
  - "8080:80"  # ← Change first number
```
Then: `docker compose up -d --force-recreate`

---

## ✅ Verify It's Working

```bash
# 1. Container running?
docker ps

# 2. Website loads?
curl http://localhost:8080

# 3. Logo loads?
curl -I http://localhost:8080/d9wplogo.png

# 4. API proxy works?
curl -I http://localhost:8080/api/raas/masters/country
```

**Or just open:** http://localhost:8080 in your browser!

---

## 📊 Monitor

```bash
# View logs
docker logs -f devportal-app

# Check status
docker ps

# Check resources
docker stats devportal-app
```

---

## 🔄 Update

```bash
git pull
docker compose up -d --build
```

---

## 🛑 Stop

```bash
docker compose down
```

---

## 📚 Full Documentation

- **Complete Guide:** `DOCKER_DEPLOYMENT.md`
- **DevOps Handover:** `DEVOPS_HANDOVER.md`
- **Issue Fixes:** `DOCKER_FIX_SUMMARY.md`

---

## 🆘 Something Wrong?

```bash
# Check logs
docker logs devportal-app

# Restart container
docker restart devportal-app

# Full troubleshooting guide in DOCKER_DEPLOYMENT.md
```

---

**That's it! 🎉**

Your app is now running with:
- ✅ Working logo
- ✅ Working API calls  
- ✅ No CORS errors

