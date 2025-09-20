# Sofia's College Expense Tracker - Setup Instructions

## 🎓 Project Overview
A real-time expense tracking application for sharing college costs between co-parents, built with React and Firebase, styled with Cal Poly brand colors.

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account (free tier works)
- Git (optional, for version control)

## 🚀 Quick Start

### Step 1: Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create Project"
   - Name it: "sofia-expense-tracker" (or your preference)
   - Disable Google Analytics (optional)
   - Click "Create Project"

2. **Enable Firestore Database**
   - In Firebase Console, click "Firestore Database" in left sidebar
   - Click "Create Database"
   - Choose "Start in production mode"
   - Select your closest region
   - Click "Enable"

3. **Update Firestore Security Rules**
   - In Firestore, click "Rules" tab
   - Replace with these rules for testing (update for production):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /expenses/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   - Click "Publish"

4. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "</>" (Web) icon
   - Register app with nickname "Expense Tracker"
   - Copy the configuration object

### Step 2: Configure the Application

1. **Create Environment File**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_app_id_here
   ```

### Step 3: Run the Application

1. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   - Navigate to http://localhost:3000
   - The app should load with Cal Poly branding

### Step 4: Test Real-Time Sync

1. Open the app in two different browser tabs
2. Add an expense in one tab
3. Watch it appear instantly in the other tab
4. Try filtering by person (Leslie/Ian)
5. Delete an expense and confirm it's removed everywhere

## 🌐 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in Project**
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Choose your existing Firebase project
   - Set public directory: `build`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

4. **Build the Application**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

6. **Access Your Live App**
   - Firebase will provide a URL like: https://your-project.web.app

### Alternative: Deploy to GitHub Pages

1. **Install GitHub Pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to the top level:
   ```json
   "homepage": "https://yourusername.github.io/expense-tracker"
   ```
   
   Add to scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔒 Security Considerations

### For Production Use:

1. **Update Firestore Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /expenses/{document=**} {
         // Add authentication or other security measures
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

2. **Add Authentication** (Optional)
   - Enable Firebase Authentication
   - Add Google/Email sign-in
   - Restrict access to authorized users only

3. **Environment Variables**
   - Never commit `.env` file to Git
   - Use Firebase environment configuration for production
   - Keep API keys secure

## 🛠️ Customization Options

### Change Parent Names
Edit in components:
- `ExpenseForm.js` - Update select options
- `ExpenseSummary.js` - Update display names
- `FilterButtons.js` - Update filter values

### Modify Color Scheme
Edit in `tailwind.config.js`:
- Cal Poly colors section
- Parent colors (leslie/ian)

### Add New Features
Consider adding:
- Categories for expenses
- Photo receipts upload
- Export to CSV/PDF
- Monthly/yearly summaries
- Budget limits and alerts
- Split percentage customization

## 📱 Mobile Optimization

The app is fully responsive and works great on:
- Desktop browsers
- Tablets (iPad, Android tablets)
- Mobile phones (iPhone, Android)

For best mobile experience:
- Add to home screen for app-like experience
- Enable notifications for expense updates

## 🐛 Troubleshooting

### Common Issues:

1. **"Firebase not configured" error**
   - Check `.env` file exists and has correct values
   - Restart development server after changing `.env`

2. **Expenses not syncing**
   - Check Firestore rules are published
   - Verify internet connection
   - Check browser console for errors

3. **Styling not working**
   - Ensure Tailwind CSS is properly installed
   - Check `postcss.config.js` exists
   - Restart development server

4. **Build fails**
   - Clear node_modules: `rm -rf node_modules`
   - Reinstall: `npm install`
   - Clear cache: `npm cache clean --force`

## 📞 Support

For issues or questions:
- Check Firebase documentation
- Review React documentation
- Test in different browsers
- Use browser developer tools for debugging

## 🎉 Success Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Environment variables configured
- [ ] App running locally
- [ ] Real-time sync working
- [ ] All features tested
- [ ] Deployed to hosting
- [ ] Shared with co-parent

Enjoy tracking Sofia's college expenses with real-time collaboration! 🎓💚💛