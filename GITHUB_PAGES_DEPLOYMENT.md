# 🚀 GitHub Pages Deployment Guide

## Sofia's College Expense Tracker - Deployment Instructions

### Prerequisites
✅ gh-pages package installed (already done!)
✅ GitHub repository created
✅ Git initialized in project

### Step 1: Update Homepage URL
Edit `package.json` and replace the homepage URL with your actual GitHub username:
```json
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/expense-tracker"
```

For example, if your GitHub username is "leslie123":
```json
"homepage": "https://leslie123.github.io/expense-tracker"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name it: `expense-tracker`
4. Make it PUBLIC (required for free GitHub Pages)
5. Don't initialize with README (we already have files)
6. Create repository

### Step 3: Connect Local Project to GitHub
```bash
cd C:\GitHub\ExpenseTracker\expense-tracker
git remote add origin https://github.com/YOUR-USERNAME/expense-tracker.git
git branch -M main
git add .
git commit -m "Sofia's College Expense Tracker - Complete Application"
git push -u origin main
```

### Step 4: Deploy to GitHub Pages
Simply run:
```bash
npm run deploy
```

This command will:
1. Build the production version
2. Create a `gh-pages` branch
3. Push the built files to GitHub Pages
4. Make your app live!

### Step 5: Access Your Live App
After deployment (takes 2-5 minutes), your app will be available at:
```
https://YOUR-USERNAME.github.io/expense-tracker
```

### 📱 Share with Ian
Once deployed, you can share the URL with Ian. The app will work on:
- Any computer browser
- iPhone/Android phones
- iPads/tablets

### 🔄 Making Updates
Whenever you make changes:
1. Save your files
2. Run: `npm run deploy`
3. Changes will be live in a few minutes

### 🔒 Important Notes
1. **Firebase Configuration**: The demo mode will work without Firebase setup
2. **Real-time Sync**: For real-time sync to work, both users need to use the same Firebase project
3. **Security**: Never commit your `.env` file with real Firebase credentials
4. **Sofia's Photo**: The photo is included in the deployment

### 🆘 Troubleshooting

**If deployment fails:**
- Make sure repository is PUBLIC
- Check GitHub username is correct in homepage URL
- Ensure you're logged into Git: `git config --global user.email "your-email@example.com"`

**If page shows 404:**
- Wait 5-10 minutes after first deployment
- Check Settings → Pages in your GitHub repository
- Ensure source is set to "Deploy from a branch" and branch is "gh-pages"

**If Firebase isn't working:**
- The demo mode will still work with mock data
- Sofia's photo will still display
- Cal Poly payment portal link will still work

### 💚 Success!
Once deployed, both you and Ian can:
- Track Sofia's expenses from anywhere
- See who owes whom in real-time
- Click to pay Cal Poly directly
- Always see Sofia's beautiful photo as a reminder

Made with ❤️ for Sofia's education at Cal Poly SLO!