#!/bin/bash
# Docker Deployment Test Script
# Tests logo loading and API connectivity

echo "🔍 Testing Docker Deployment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi
echo "✅ Docker is running"

# Build the image
echo ""
echo "📦 Building Docker image..."
docker build -t devportal:test . || {
    echo "❌ Build failed"
    exit 1
}
echo "✅ Build successful"

# Run the container
echo ""
echo "🚀 Starting container..."
docker run -d --rm --name devportal-test -p 8080:80 devportal:test || {
    echo "❌ Failed to start container"
    exit 1
}

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 5

# Check if container is running
if ! docker ps | grep -q devportal-test; then
    echo "❌ Container is not running"
    docker logs devportal-test
    exit 1
fi
echo "✅ Container is running"

# Test 1: Check if website is accessible
echo ""
echo "🌐 Test 1: Website accessibility..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Website is accessible (HTTP $HTTP_CODE)"
else
    echo "❌ Website returned HTTP $HTTP_CODE"
fi

# Test 2: Check if logo exists
echo ""
echo "🖼️  Test 2: Logo availability..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/d9wplogo.png)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Logo is accessible (HTTP $HTTP_CODE)"
else
    echo "❌ Logo returned HTTP $HTTP_CODE"
fi

# Test 3: Check if logo is in container
echo ""
echo "📁 Test 3: Logo file in container..."
if docker exec devportal-test test -f /usr/share/nginx/html/d9wplogo.png; then
    echo "✅ Logo file exists in container"
    SIZE=$(docker exec devportal-test stat -c%s /usr/share/nginx/html/d9wplogo.png)
    echo "   Size: $SIZE bytes"
else
    echo "❌ Logo file not found in container"
fi

# Test 4: Check nginx config
echo ""
echo "⚙️  Test 4: Nginx configuration..."
if docker exec devportal-test nginx -t > /dev/null 2>&1; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
fi

# Test 5: Check API proxy
echo ""
echo "🔌 Test 5: API proxy configuration..."
if docker exec devportal-test cat /etc/nginx/conf.d/default.conf | grep -q "proxy_pass"; then
    echo "✅ API proxy is configured"
    PROXY_URL=$(docker exec devportal-test grep "proxy_pass" /etc/nginx/conf.d/default.conf | head -1 | sed 's/.*proxy_pass \(.*\);/\1/')
    echo "   Proxy URL: $PROXY_URL"
else
    echo "❌ API proxy not found in configuration"
fi

# Show container logs
echo ""
echo "📋 Recent container logs:"
docker logs --tail 20 devportal-test

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Access the application at: http://localhost:8080"
echo ""
echo "To stop the test container:"
echo "  docker stop devportal-test"
echo ""
echo "To view logs:"
echo "  docker logs -f devportal-test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

