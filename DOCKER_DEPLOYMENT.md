# 🐳 Docker Deployment Guide

## Overview
This guide covers the Docker-based deployment of the Digit9 Developer Portal, including solutions for common issues like logo loading and API CORS problems.

---

## 🔧 Prerequisites

1. **Docker** installed and running
   ```bash
   docker --version  # Should be 20.10+
   ```

2. **Docker Compose** installed (optional, for easier management)
   ```bash
   docker-compose --version  # Should be 1.29+
   ```

3. **Fresh package-lock.json** (if not present)
   ```bash
   npm install  # Run once to generate package-lock.json
   ```

---

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)
```bash
# Build and start the container
docker compose up --build

# Access the application
# Browse to: http://localhost:8080

# Stop the container
docker compose down
```

### Option 2: Using Docker CLI
```bash
# Build the image
docker build -t devportal:local .

# Run the container
docker run --rm -p 8080:80 --name devportal devportal:local

# Stop the container (Ctrl+C or in another terminal)
docker stop devportal
```

---

## 📁 Architecture

### Multi-Stage Build
```
┌─────────────────────────────────────────┐
│ Stage 1: Builder (node:18-alpine)      │
│ - Install dependencies (npm ci)         │
│ - Copy source code                      │
│ - Create .env.production                │
│ - Build Vite app (npm run build)       │
│ - Output: /app/dist                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Stage 2: Runner (nginx:1.25-alpine)    │
│ - Copy built app from Stage 1           │
│ - Copy nginx configuration              │
│ - Serve static files                    │
│ - Proxy /api requests to backend        │
└─────────────────────────────────────────┘
```

### File Structure
```
/usr/share/nginx/html/          # Served by nginx
├── index.html                   # Main SPA entry point
├── d9wplogo.png                # Logo (from public/)
├── assets/                      # JS/CSS bundles
│   ├── index-[hash].js
│   └── index-[hash].css
└── *.json                       # API spec files
```

---

## 🔍 Problem Solutions

### Issue 1: Logo Not Appearing ✅ FIXED

**Problem:**
- Logo was in `/public/d9wplogo.png`
- `.dockerignore` was excluding the `public` directory
- Logo wasn't copied to dist during build

**Solution:**
1. **Updated .dockerignore** - Removed `public` from exclusion list
   - Vite needs `public/` during build to copy assets to `dist/`
   
2. **Updated nginx.conf** - Added static file serving rule
   ```nginx
   location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
       try_files $uri =404;
       add_header Cache-Control "public, max-age=86400";
   }
   ```

**Result:**
- ✅ Logo loads correctly at `http://localhost:8080/d9wplogo.png`
- ✅ All public assets available in production

---

### Issue 2: API CORS Errors ✅ FIXED

**Problem:**
- `apiClient.ts` hardcoded `BASE_URL = "http://localhost:3001/api"`
- Local proxy server (port 3001) doesn't exist in Docker container
- API calls failed with CORS errors

**Solution:**
1. **Updated apiClient.ts** - Use environment variables
   ```typescript
   const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
   ```

2. **Updated nginx.conf** - Added API proxy with CORS handling
   ```nginx
   location /api/ {
       proxy_pass https://drap-sandbox.digitnine.com/;
       proxy_set_header Host drap-sandbox.digitnine.com;
       
       # CORS headers
       add_header 'Access-Control-Allow-Origin' '*' always;
       add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
       add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
       
       # Handle preflight requests
       if ($request_method = 'OPTIONS') {
           return 204;
       }
   }
   ```

3. **Updated Dockerfile** - Creates .env.production during build
   ```dockerfile
   RUN echo "VITE_API_BASE_URL=/api" >> .env.production
   ```

**Result:**
- ✅ API calls route through nginx at `/api`
- ✅ Nginx proxies to backend `https://drap-sandbox.digitnine.com`
- ✅ CORS headers properly set
- ✅ No CORS errors in browser console

---

## 🌐 API Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐
│   Browser    │────▶│    Nginx     │────▶│   Backend API            │
│              │     │              │     │                          │
│ GET /api/... │     │ Proxy /api/  │     │ drap-sandbox.digitnine   │
│              │     │ Add CORS     │     │ .com                     │
│              │◀────│              │◀────│                          │
└──────────────┘     └──────────────┘     └──────────────────────────┘
    ↑                                              
    └─ No CORS errors (nginx handles it)
```

**Request Example:**
1. Frontend calls: `fetch('/api/raas/masters/country')`
2. Nginx receives: `GET /api/raas/masters/country`
3. Nginx proxies to: `https://drap-sandbox.digitnine.com/raas/masters/country`
4. Nginx adds CORS headers to response
5. Browser receives response with proper CORS headers

---

## 🔐 Security Considerations

### Headers
The nginx configuration includes security headers:
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection

### Build Process
- Source maps disabled in production (`VITE_SOURCEMAP=false`)
- Console logs stripped in production builds
- No .env files committed to git

### API Security
- Backend API URL is configurable
- No credentials in frontend code
- All API calls proxied through nginx

---

## 🛠️ Configuration

### Environment Variables (Build Time)

Created automatically in Dockerfile:
```bash
NODE_ENV=production
VITE_APP_TITLE=Digit9 Developer Portal
VITE_API_BASE_URL=/api
VITE_ENABLE_SPLINE=true
VITE_ENABLE_ANALYTICS=false
VITE_CACHE_DURATION=3600000
VITE_SOURCEMAP=false
```

### Changing Backend API URL

To point to a different backend API, update `docker/nginx.conf`:

```nginx
location /api/ {
    proxy_pass https://your-api-url.com/;
    proxy_set_header Host your-api-url.com;
    # ... rest of config
}
```

Then rebuild:
```bash
docker compose up --build
```

---

## 📊 Monitoring

### Health Check
The container includes a health check:
```bash
# Check container health
docker ps

# Should show "healthy" status
CONTAINER ID   IMAGE              STATUS
abc123def456   devportal:latest   Up 2 minutes (healthy)
```

### Logs
```bash
# Docker Compose
docker compose logs -f

# Docker CLI
docker logs -f devportal

# Nginx access logs
docker exec devportal-app tail -f /var/log/nginx/access.log

# Nginx error logs
docker exec devportal-app tail -f /var/log/nginx/error.log
```

---

## 🐛 Troubleshooting

### Logo Still Not Appearing

1. **Check if logo is in dist:**
   ```bash
   docker exec devportal-app ls -la /usr/share/nginx/html/
   # Should see d9wplogo.png
   ```

2. **Check nginx logs:**
   ```bash
   docker logs devportal-app 2>&1 | grep d9wplogo
   ```

3. **Verify public folder during build:**
   ```bash
   docker build --progress=plain -t devportal:test . 2>&1 | grep public
   ```

### API Calls Failing

1. **Check nginx is proxying:**
   ```bash
   docker exec devportal-app cat /etc/nginx/conf.d/default.conf | grep proxy_pass
   # Should show: proxy_pass https://drap-sandbox.digitnine.com/;
   ```

2. **Test API endpoint directly:**
   ```bash
   curl -v http://localhost:8080/api/raas/masters/country
   ```

3. **Check CORS headers:**
   ```bash
   curl -I http://localhost:8080/api/raas/masters/country
   # Should see: Access-Control-Allow-Origin: *
   ```

4. **View nginx error logs:**
   ```bash
   docker logs devportal-app 2>&1 | grep error
   ```

### Container Won't Start

1. **Check Docker logs:**
   ```bash
   docker logs devportal-app
   ```

2. **Verify port 8080 is available:**
   ```bash
   netstat -an | findstr "8080"  # Windows
   lsof -i :8080                  # Linux/Mac
   ```

3. **Check nginx config syntax:**
   ```bash
   docker run --rm -v ${PWD}/docker/nginx.conf:/etc/nginx/conf.d/default.conf nginx:1.25-alpine nginx -t
   ```

---

## 🚢 Production Deployment

### Building for Production

1. **Build with specific tag:**
   ```bash
   docker build -t devportal:v1.0.0 .
   ```

2. **Tag for registry:**
   ```bash
   docker tag devportal:v1.0.0 your-registry.com/devportal:v1.0.0
   docker tag devportal:v1.0.0 your-registry.com/devportal:latest
   ```

3. **Push to registry:**
   ```bash
   docker push your-registry.com/devportal:v1.0.0
   docker push your-registry.com/devportal:latest
   ```

### Running in Production

1. **Pull and run:**
   ```bash
   docker pull your-registry.com/devportal:latest
   docker run -d \
     --name devportal \
     --restart unless-stopped \
     -p 80:80 \
     your-registry.com/devportal:latest
   ```

2. **With docker-compose:**
   ```yaml
   version: '3.8'
   services:
     devportal:
       image: your-registry.com/devportal:latest
       restart: unless-stopped
       ports:
         - "80:80"
   ```

---

## 📝 File Changes Summary

### Files Modified
1. **`.dockerignore`** - Removed `public` directory exclusion
2. **`src/api/apiClient.ts`** - Added environment variable for BASE_URL
3. **`docker/nginx.conf`** - Added API proxy and CORS headers
4. **`Dockerfile`** - Added .env.production creation
5. **`docker-compose.yml`** - Added healthcheck and labels

### Files Created
1. **`DOCKER_DEPLOYMENT.md`** - This documentation

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Container is running: `docker ps`
- [ ] Container is healthy: `docker ps` shows "(healthy)"
- [ ] Website loads: http://localhost:8080
- [ ] Logo appears on homepage
- [ ] Navigation works (React Router)
- [ ] API calls work (check browser console)
- [ ] No CORS errors in console
- [ ] Authentication works (if applicable)
- [ ] API specs load correctly

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [CORS Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review nginx logs: `docker logs devportal-app`
3. Verify all files are properly copied: `docker exec devportal-app ls -la /usr/share/nginx/html/`
4. Test API endpoints directly: `curl -v http://localhost:8080/api/...`

---

**Last Updated:** October 1, 2025  
**Docker Version:** 20.10+  
**Nginx Version:** 1.25-alpine  
**Node Version:** 18-alpine

