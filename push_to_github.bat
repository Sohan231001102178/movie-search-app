@echo off
echo ========================================================
echo Pushing CineVault Movie Search App to GitHub
echo Account: Sohan231001102178
echo ========================================================
echo.
set /p REPONAME="Enter your new GitHub repository name (e.g. movie-search-app): "
if "%REPONAME%"=="" set REPONAME=movie-search-app

echo Setting remote origin to https://github.com/Sohan231001102178/%REPONAME%.git ...
git remote remove origin 2>nul
git remote add origin https://github.com/Sohan231001102178/%REPONAME%.git
git branch -M main

echo.
echo Pushing branch 'main' to GitHub...
echo (If prompted, sign in with your browser or paste your personal access token)
git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo SUCCESS! Repository published to:
    echo https://github.com/Sohan231001102178/%REPONAME%
    echo ========================================================
) else (
    echo.
    echo Push failed. Please check that:
    echo 1. You created the repository '%REPONAME%' at https://github.com/new
    echo 2. Your GitHub account has write access.
)
pause
