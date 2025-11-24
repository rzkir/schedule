@echo off
echo Building and running Dashboard Portofolio Desktop in production mode...
echo.

echo Step 1: Building Next.js app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors.
    pause
    exit /b 1
)

echo.
echo Step 2: Starting Next.js and Electron together...
call npm run desktop:prod

pause 