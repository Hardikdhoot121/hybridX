@echo off
echo ========================================
echo Pushing code to GitHub
echo Repository: https://github.com/Prakshit8/hybridX
echo ========================================
echo.

REM Initialize git if not already done
if not exist .git (
    echo Initializing git repository...
    git init
    echo.
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding remote repository...
    git remote add origin https://github.com/Prakshit8/hybridX.git
) else (
    echo Updating remote repository URL...
    git remote set-url origin https://github.com/Prakshit8/hybridX.git
)

echo.
echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Add code push bar feature"

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Done! Check your repository at:
echo https://github.com/Prakshit8/hybridX
echo ========================================
pause

