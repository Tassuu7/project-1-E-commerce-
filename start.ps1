Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting OmniCommerce Enterprise Platform...    " -ForegroundColor Green
Write-Host "  URL: http://localhost:3000                      " -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan

Start-Process "http://localhost:3000"
node index.js
