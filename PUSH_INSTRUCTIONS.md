# Push to GitHub Repository

## Repository: https://github.com/Prakshit8/hybridX

### Quick Method (Windows)
Double-click `push-to-github.bat` file in your project folder.

### Manual Method

Open your terminal (PowerShell, CMD, or Git Bash) in the project directory and run these commands:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add remote repository
git remote add origin https://github.com/Prakshit8/hybridX.git

# If remote already exists, update it:
git remote set-url origin https://github.com/Prakshit8/hybridX.git

# 3. Add all files
git add .

# 4. Commit changes
git commit -m "Add code push bar feature"

# 5. Set main branch and push
git branch -M main
git push -u origin main
```

### If you get authentication errors:

1. **Use Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Use token as password when prompted

2. **Or use SSH:**
   ```bash
   git remote set-url origin git@github.com:Prakshit8/hybridX.git
   ```

### Files being pushed:
- ✅ `src/components/CodePushBar.jsx` - Push bar component
- ✅ `src/App.jsx` - Updated with push bar
- ✅ `src/index.css` - Push bar styles
- ✅ All other project files

---

**Note:** Make sure you have Git installed. Download from: https://git-scm.com/downloads

