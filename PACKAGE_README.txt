====================================================================
  DIGIT9 DEVELOPER PORTAL - DEPLOYMENT PACKAGE
====================================================================

QUICK DEPLOY (5 MINUTES)
-------------------------

Prerequisites:
- Docker installed and running
- Server with ports 80/443 available

Deployment Steps:
1. Extract this ZIP file to your deployment directory
2. Open terminal/command prompt in the extracted folder
3. Run: docker compose up -d --build
4. Access: http://your-server-ip:3010

WHAT'S WORKING
--------------
✓ Logo loads correctly
✓ API calls work (no CORS errors)
✓ All routes functional
✓ React Router navigation
✓ Authentication working

CONFIGURATION (IF NEEDED)
--------------------------

Change Backend API URL:
File: docker/nginx.conf (line 15)
Current: https://drap-sandbox.digitnine.com/
Action: Change to your production API URL
Then rebuild: docker compose up -d --build

Change Port:
File: docker-compose.yml (line 9)
Current: "3010:80"
Action: Change to "80:80" or "443:443" for production ports
Then: docker compose up -d --force-recreate

DOCUMENTATION
-------------
- QUICK_START_DEVOPS.md - 2-minute quick start guide
- DEVOPS_HANDOVER.md - Complete deployment handbook
- DOCKER_DEPLOYMENT.md - Technical deep-dive
- DOCKER_FIX_SUMMARY.md - What was fixed and how

TESTING
-------
Windows: .\docker-test.ps1
Linux/Mac: chmod +x docker-test.sh && ./docker-test.sh

VERIFICATION
------------
After deployment, verify:
1. Container is running: docker ps
2. Website loads: curl http://localhost:3010
3. Open browser: http://your-server-ip:3010
4. Logo appears on homepage
5. No CORS errors in browser console (press F12)
6. API calls work

TROUBLESHOOTING
---------------
View logs: docker logs -f devportal-app
Restart container: docker restart devportal-app
Check status: docker ps
Check health: docker inspect devportal-app

For detailed troubleshooting, see DOCKER_DEPLOYMENT.md

PACKAGE CONTENTS
----------------
✓ Dockerfile - Multi-stage Docker build
✓ docker-compose.yml - Container orchestration
✓ docker/nginx.conf - Web server + API proxy config
✓ src/ - Complete application source code
✓ public/ - Static assets (logo, API specs)
✓ package.json - Node.js dependencies
✓ Full documentation (4 comprehensive guides)
✓ Test scripts (Windows + Linux)

STATUS
------
✓ Production Ready
✓ Logo + APIs Tested and Working
✓ Docker Version Required: 20.10+

====================================================================
Package created: October 1, 2025
For support, see documentation in package
====================================================================

