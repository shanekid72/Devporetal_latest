# Docker Deployment Test Script for Windows PowerShell
# Tests logo loading and API connectivity

Write-Host "🔍 Testing Docker Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Build the image
Write-Host ""
Write-Host "📦 Building Docker image..." -ForegroundColor Cyan
docker build -t devportal:test .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green

# Run the container
Write-Host ""
Write-Host "🚀 Starting container..." -ForegroundColor Cyan
docker run -d --rm --name devportal-test -p 8080:80 devportal:test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start container" -ForegroundColor Red
    exit 1
}

# Wait for container to be ready
Write-Host "⏳ Waiting for container to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if container is running
$containerRunning = docker ps --filter "name=devportal-test" --format "{{.Names}}"
if (-not $containerRunning) {
    Write-Host "❌ Container is not running" -ForegroundColor Red
    docker logs devportal-test
    exit 1
}
Write-Host "✅ Container is running" -ForegroundColor Green

# Test 1: Check if website is accessible
Write-Host ""
Write-Host "🌐 Test 1: Website accessibility..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Website is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Website returned HTTP $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed to access website: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Check if logo exists
Write-Host ""
Write-Host "🖼️  Test 2: Logo availability..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/d9wplogo.png" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Logo is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
        Write-Host "   Size: $($response.RawContentLength) bytes" -ForegroundColor Gray
    } else {
        Write-Host "❌ Logo returned HTTP $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed to access logo: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check if logo is in container
Write-Host ""
Write-Host "📁 Test 3: Logo file in container..." -ForegroundColor Cyan
$logoExists = docker exec devportal-test test -f /usr/share/nginx/html/d9wplogo.png
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Logo file exists in container" -ForegroundColor Green
    $size = docker exec devportal-test stat -c%s /usr/share/nginx/html/d9wplogo.png
    Write-Host "   Size: $size bytes" -ForegroundColor Gray
} else {
    Write-Host "❌ Logo file not found in container" -ForegroundColor Red
}

# Test 4: Check nginx config
Write-Host ""
Write-Host "⚙️  Test 4: Nginx configuration..." -ForegroundColor Cyan
docker exec devportal-test nginx -t 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Nginx configuration is valid" -ForegroundColor Green
} else {
    Write-Host "❌ Nginx configuration has errors" -ForegroundColor Red
}

# Test 5: Check API proxy
Write-Host ""
Write-Host "🔌 Test 5: API proxy configuration..." -ForegroundColor Cyan
$proxyConfig = docker exec devportal-test cat /etc/nginx/conf.d/default.conf
if ($proxyConfig -match "proxy_pass") {
    Write-Host "✅ API proxy is configured" -ForegroundColor Green
    $proxyUrl = $proxyConfig | Select-String -Pattern "proxy_pass\s+(.*?);" | ForEach-Object { $_.Matches.Groups[1].Value }
    Write-Host "   Proxy URL: $proxyUrl" -ForegroundColor Gray
} else {
    Write-Host "❌ API proxy not found in configuration" -ForegroundColor Red
}

# Show container logs
Write-Host ""
Write-Host "📋 Recent container logs:" -ForegroundColor Cyan
docker logs --tail 20 devportal-test

# Summary
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "Access the application at: http://localhost:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop the test container:" -ForegroundColor Cyan
Write-Host "  docker stop devportal-test" -ForegroundColor Gray
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  docker logs -f devportal-test" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

