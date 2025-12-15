# Download and Install Git for Windows

## Quick Download Links:

### Option 1: Official Git Website (Recommended)
**Direct Download:** https://git-scm.com/download/win

1. Click the link above or visit: https://git-scm.com/download/win
2. The download will start automatically (Git for Windows installer)
3. Run the installer (.exe file)
4. Follow the installation wizard (use default settings)
5. **Important:** Make sure to check "Add Git to PATH" during installation

### Option 2: GitHub Desktop (Easier GUI)
**Download:** https://desktop.github.com/

- Includes Git automatically
- User-friendly interface
- Good for beginners

### Option 3: Winget (Windows Package Manager)
If you have Windows 10/11 with winget, run in PowerShell:
```powershell
winget install --id Git.Git -e --source winget
```

## After Installation:

1. **Restart your terminal/PowerShell** (important!)
2. Verify installation:
   ```bash
   git --version
   ```
3. Configure Git (first time only):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Then Push Your Code:

After Git is installed, run these commands in your project folder:

```bash
git init
git remote add origin https://github.com/Prakshit8/hybridX.git
git add .
git commit -m "Add code push bar feature"
git branch -M main
git push -u origin main
```

---

**Need help?** The installer is straightforward - just click "Next" through the default options!

