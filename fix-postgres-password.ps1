# Quick PostgreSQL Password Reset Script
Write-Host "Enter your PostgreSQL 'postgres' user password:"
$pgPassword = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword)
$pgPasswordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

$env:PGPASSWORD = $pgPasswordText

Write-Host ""
Write-Host "Resetting auracase_user password to 'auracase123'..." -ForegroundColor Yellow
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "ALTER USER auracase_user WITH PASSWORD 'auracase123';"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Password reset successfully!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Now setting up database tables..." -ForegroundColor Yellow
    
    $env:DATABASE_URL = "postgresql://auracase_user:auracase123@localhost:5432/auracase"
    
    Write-Host "Pushing schema to database..." -ForegroundColor Cyan
    npx prisma db push
    
    Write-Host ""
    Write-Host "Seeding database with sample data..." -ForegroundColor Cyan
    npm run prisma:seed
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Database setup complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your DATABASE_URL is:" -ForegroundColor Cyan
    Write-Host "postgresql://auracase_user:auracase123@localhost:5432/auracase" -ForegroundColor White
    
} else {
    Write-Host "❌ Failed to reset password. Please check your postgres password." -ForegroundColor Red
}

$env:PGPASSWORD = $null
