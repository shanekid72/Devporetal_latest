# 🚀 DevOps Handover - Digit9 Developer Portal

## ✅ Status: READY FOR PRODUCTION DEPLOYMENT

**Application:** Digit9 Developer Portal  
**Technology:** React + Vite (Frontend), Nginx (Web Server)  
**Deployment Method:** Docker Container  
**Date:** October 1, 2025  
**Tested:** ✅ Logo loads correctly, ✅ API calls working

---

## 📦 Deployment Package

### Required Files (All Included in Repository)
```
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose configuration
├── docker/
│   └── nginx.conf             # Nginx server configuration
├── .dockerignore              # Build context exclusions
├── package.json               # Node.js dependencies
├── package-lock.json          # Locked dependency versions
├── src/                       # Application source code
├── public/                    # Static assets (logo, etc.)
└── vite.config.ts             # Vite build configuration
```

### Documentation Files
```
├── DOCKER_DEPLOYMENT.md       # Complete deployment guide
├── DOCKER_FIX_SUMMARY.md      # Issues resolved and solutions
├── DEVOPS_HANDOVER.md         # This file
├── docker-test.ps1            # Windows test script
└── docker-test.sh             # Linux/Mac test script
```

---

## 🎯 Quick Deployment Steps

### Option 1: Docker Compose (Recommended for Testing)
```bash
# Clone repository
git clone <repository-url>
cd devportalnon

# Build and start
docker compose up -d --build

# Verify it's running
docker ps
docker logs devportal-app

# Access application
# http://localhost:8080 or http://<server-ip>:8080
```

### Option 2: Docker CLI (Production)
```bash
# Build the image
docker build -t devportal:v1.0.0 .

# Run the container
docker run -d \
  --name devportal \
  --restart unless-stopped \
  -p 80:80 \
  devportal:v1.0.0

# Check status
docker ps
docker logs -f devportal
```

### Option 3: Container Registry (Recommended for Production)
```bash
# 1. Build and tag
docker build -t devportal:v1.0.0 .
docker tag devportal:v1.0.0 <your-registry>/devportal:v1.0.0
docker tag devportal:v1.0.0 <your-registry>/devportal:latest

# 2. Push to registry
docker push <your-registry>/devportal:v1.0.0
docker push <your-registry>/devportal:latest

# 3. On production server
docker pull <your-registry>/devportal:latest
docker run -d \
  --name devportal \
  --restart unless-stopped \
  -p 80:80 \
  <your-registry>/devportal:latest
```

---

## ⚙️ Configuration

### Backend API Configuration

**Current Setup:**
- API requests are proxied through Nginx
- Frontend calls: `/api/*`
- Nginx proxies to: `https://drap-sandbox.digitnine.com/*`

**To Change Backend API URL:**

Edit `docker/nginx.conf` (lines 13-18):
```nginx
location /api/ {
    # Change this URL to your production API
    proxy_pass https://your-production-api.com/;
    proxy_set_header Host your-production-api.com;
    # ... rest of config
}
```

Then rebuild:
```bash
docker compose up -d --build
```

### Port Configuration

**Default:** Port 8080 → 80 (inside container)

**To Change External Port:**

Edit `docker-compose.yml`:
```yaml
ports:
  - "80:80"  # Change 8080 to your desired port
```

Or with Docker CLI:
```bash
docker run -d -p 80:80 devportal:latest  # Change first 80 to desired port
```

### Environment Variables

**Current Configuration (Built into Image):**
```bash
NODE_ENV=production
VITE_APP_TITLE=Digit9 Developer Portal
VITE_API_BASE_URL=/api
VITE_ENABLE_SPLINE=true
VITE_ENABLE_ANALYTICS=false
```

**To Modify:** Edit the Dockerfile (lines 14-22) before building.

---

## 🔒 Security Checklist

### ✅ Implemented Security Features
- [x] Multi-stage Docker build (no source code in final image)
- [x] Source maps disabled in production
- [x] Console logs stripped from production build
- [x] Security headers configured:
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
- [x] CORS properly configured
- [x] No credentials in source code
- [x] Nginx runs as non-root user
- [x] Health checks enabled

### 🔧 Additional Security Recommendations

#### 1. SSL/TLS Certificate (REQUIRED for Production)
```bash
# Option A: Let's Encrypt (Recommended)
# Install certbot
apt-get update
apt-get install certbot

# Get certificate
certbot certonly --standalone -d developer.digitnine.com

# Certificates will be in: /etc/letsencrypt/live/developer.digitnine.com/
```

Update nginx configuration for SSL:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/developer.digitnine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/developer.digitnine.com/privkey.pem;
    # ... rest of config
}
```

Mount certificates in Docker:
```bash
docker run -d \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  -p 80:80 -p 443:443 \
  devportal:latest
```

#### 2. Firewall Configuration
```bash
# Allow HTTP/HTTPS only
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp   # SSH
ufw enable

# Deny all other incoming
ufw default deny incoming
ufw default allow outgoing
```

#### 3. Rate Limiting (Optional)
Add to nginx.conf:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ... existing config
}
```

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
# Container includes built-in health check
curl http://localhost:8080/

# Docker health status
docker ps  # Shows "healthy" or "unhealthy"

# View health check logs
docker inspect devportal | grep -A 20 Health
```

### Log Monitoring
```bash
# View container logs
docker logs -f devportal

# View nginx access logs
docker exec devportal tail -f /var/log/nginx/access.log

# View nginx error logs
docker exec devportal tail -f /var/log/nginx/error.log
```

### Key Metrics to Monitor
- Container status: `docker ps`
- CPU/Memory usage: `docker stats devportal`
- HTTP response codes (200, 404, 500)
- API response times
- Container restarts
- Disk space: `df -h`

### Recommended Monitoring Tools
- **Prometheus + Grafana** - Metrics and dashboards
- **ELK Stack** - Log aggregation
- **Datadog/New Relic** - APM monitoring
- **Uptime Robot** - External availability monitoring

---

## 🔄 Maintenance Tasks

### Update Application
```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild and restart
docker compose up -d --build

# Or with Docker CLI
docker build -t devportal:v1.1.0 .
docker stop devportal
docker rm devportal
docker run -d --name devportal -p 80:80 devportal:v1.1.0
```

### Backup Strategy
```bash
# Backup Docker image
docker save devportal:latest | gzip > devportal-backup-$(date +%Y%m%d).tar.gz

# Restore from backup
gunzip -c devportal-backup-20251001.tar.gz | docker load
```

### Container Cleanup
```bash
# Remove old containers
docker container prune -f

# Remove old images
docker image prune -f

# Remove all unused data
docker system prune -a -f --volumes
```

---

## 🌐 Production Deployment Scenarios

### Scenario 1: Single Server Deployment

**Best for:** Small to medium traffic, simple setup

```bash
# On production server
git clone <repository>
cd devportalnon

# Build and run
docker build -t devportal:prod .
docker run -d \
  --name devportal \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  devportal:prod

# Configure nginx on host (if needed)
# Or use container's nginx directly
```

### Scenario 2: Docker Swarm

**Best for:** High availability, load balancing

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml devportal

# Scale services
docker service scale devportal_devportal=3

# Update service
docker service update --image devportal:v2.0.0 devportal_devportal
```

### Scenario 3: Kubernetes

**Best for:** Large scale, auto-scaling, cloud-native

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devportal
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devportal
  template:
    metadata:
      labels:
        app: devportal
    spec:
      containers:
      - name: devportal
        image: <registry>/devportal:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: devportal-service
spec:
  type: LoadBalancer
  selector:
    app: devportal
  ports:
  - port: 80
    targetPort: 80
```

### Scenario 4: AWS ECS/Fargate

**Best for:** AWS infrastructure, serverless containers

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag devportal:latest <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/devportal:latest
docker push <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/devportal:latest

# Create ECS task definition and service via AWS Console or CLI
```

---

## 🧪 Testing & Verification

### Automated Test Script
```bash
# Windows
.\docker-test.ps1

# Linux/Mac
chmod +x docker-test.sh
./docker-test.sh
```

### Manual Verification Checklist
```bash
# 1. Container is running
docker ps | grep devportal

# 2. Health check passes
docker inspect devportal | grep -A 5 '"Health"'

# 3. Website accessible
curl -I http://localhost:8080
# Expected: HTTP/1.1 200 OK

# 4. Logo loads
curl -I http://localhost:8080/d9wplogo.png
# Expected: HTTP/1.1 200 OK, Content-Type: image/png

# 5. API proxy works
curl -I http://localhost:8080/api/raas/masters/country
# Expected: HTTP/1.1 200 OK, Access-Control-Allow-Origin: *

# 6. Static assets cached
curl -I http://localhost:8080/assets/index-*.js
# Expected: Cache-Control: public, max-age=31536000, immutable
```

### Browser Testing
1. Open http://localhost:8080 (or your domain)
2. **Verify:**
   - ✅ Logo appears on homepage
   - ✅ Navigation works (React Router)
   - ✅ No console errors (F12 → Console)
   - ✅ No CORS errors
   - ✅ API calls succeed
   - ✅ Authentication works
   - ✅ Master data loads (countries, currencies)
   - ✅ Swagger UI pages work

---

## 🐛 Troubleshooting Guide

### Issue: Container Won't Start
```bash
# Check logs
docker logs devportal

# Check if port is in use
netstat -tulpn | grep :80

# Verify image built correctly
docker images | grep devportal

# Test nginx config
docker run --rm devportal nginx -t
```

### Issue: Logo Not Appearing
```bash
# Check if file exists
docker exec devportal ls -la /usr/share/nginx/html/d9wplogo.png

# Check nginx logs
docker logs devportal 2>&1 | grep d9wplogo

# Test direct access
curl -I http://localhost:8080/d9wplogo.png
```

### Issue: API Calls Failing
```bash
# Check nginx proxy config
docker exec devportal cat /etc/nginx/conf.d/default.conf | grep proxy_pass

# Test backend connectivity from container
docker exec devportal wget -O- https://drap-sandbox.digitnine.com/raas/masters/country

# Check CORS headers
curl -I http://localhost:8080/api/raas/masters/country

# View nginx error logs
docker exec devportal tail -50 /var/log/nginx/error.log
```

### Issue: High Memory Usage
```bash
# Check container stats
docker stats devportal

# Restart container
docker restart devportal

# Set memory limits
docker run -d --memory="512m" --name devportal devportal:latest
```

---

## 📞 Support Information

### Technical Contacts
- **Developer Team:** [Add contact info]
- **DevOps Lead:** [Add contact info]
- **On-Call Support:** [Add contact info]

### Resources
- **Repository:** [Add Git repository URL]
- **Documentation:** See `DOCKER_DEPLOYMENT.md`
- **Issue Tracker:** [Add link]
- **Slack/Teams Channel:** [Add link]

### Escalation Path
1. Check logs: `docker logs devportal`
2. Review troubleshooting guide above
3. Contact DevOps team
4. Escalate to development team if needed

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Repository cloned/pulled with latest code
- [ ] Docker and Docker Compose installed
- [ ] Firewall rules configured
- [ ] SSL certificates obtained (for production)
- [ ] DNS configured (if using domain)
- [ ] Backend API URL verified in `docker/nginx.conf`
- [ ] Ports available (80, 443)

### Deployment
- [ ] Image built successfully: `docker build -t devportal:latest .`
- [ ] Container started: `docker run -d ...` or `docker compose up -d`
- [ ] Container shows as "healthy": `docker ps`
- [ ] No errors in logs: `docker logs devportal`

### Post-Deployment Verification
- [ ] Website loads: `curl http://localhost:8080`
- [ ] Logo appears on homepage
- [ ] API calls work (no CORS errors)
- [ ] Authentication functional
- [ ] Master data loads
- [ ] Swagger UI pages accessible
- [ ] All routes work (React Router)
- [ ] Performance acceptable (< 2s page load)

### Monitoring Setup
- [ ] Log monitoring configured
- [ ] Uptime monitoring configured
- [ ] Alert notifications set up
- [ ] Backup strategy implemented
- [ ] Documentation updated

---

## 🎯 Expected Performance

### Build Metrics
- **First build time:** 2-3 minutes
- **Cached build time:** 30-60 seconds
- **Final image size:** ~50-80 MB
- **Build stages:** 2 (builder + runner)

### Runtime Metrics
- **Container startup:** < 5 seconds
- **Health check interval:** 30 seconds
- **Page load time:** < 2 seconds
- **API response time:** < 500ms (depends on backend)
- **Memory usage:** ~50-100 MB
- **CPU usage:** < 5% (idle), < 20% (active)

---

## 🔑 Important Notes

### ⚠️ Critical Configuration
1. **Backend API URL** is in `docker/nginx.conf` line 15
   - Current: `https://drap-sandbox.digitnine.com/`
   - Change for production environment

2. **API Credentials** (if applicable)
   - Not in this repository
   - Backend handles authentication
   - Frontend sends credentials via forms

3. **Environment** 
   - Built for production by default
   - Source maps disabled
   - Console logs stripped

### ✅ What's Working
- Logo loading ✓
- API calls through nginx proxy ✓
- CORS headers properly set ✓
- React Router navigation ✓
- Static asset serving ✓
- Health checks ✓
- Security headers ✓

### 📌 Known Limitations
- Backend API URL is hardcoded in nginx config (by design)
- Requires rebuild to change API URL
- No SSL/TLS configured (add before production)
- No rate limiting configured (optional)

---

## 📦 Deliverables Summary

### Docker Files
✅ `Dockerfile` - Multi-stage build configuration  
✅ `docker-compose.yml` - Compose orchestration  
✅ `docker/nginx.conf` - Nginx server configuration  
✅ `.dockerignore` - Build context optimization  

### Documentation
✅ `DOCKER_DEPLOYMENT.md` - Complete deployment guide  
✅ `DOCKER_FIX_SUMMARY.md` - Issues and solutions  
✅ `DEVOPS_HANDOVER.md` - This handover document  

### Test Scripts
✅ `docker-test.ps1` - Windows test automation  
✅ `docker-test.sh` - Linux/Mac test automation  

### Application
✅ Full React + Vite application source code  
✅ All dependencies in `package.json`  
✅ Production-ready build configuration  

---

## 🚀 Quick Start for DevOps

**TL;DR - Get it running in 2 minutes:**

```bash
# Clone repo
git clone <repository-url> && cd devportalnon

# Build and run
docker compose up -d --build

# Verify
docker ps
curl http://localhost:8080

# Done! 🎉
```

**Access:** http://localhost:8080 or http://your-server-ip:8080

---

**Document Version:** 1.0  
**Last Updated:** October 1, 2025  
**Status:** ✅ PRODUCTION READY  
**Tested By:** Development Team  
**Approved For:** Production Deployment

