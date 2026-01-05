# Firebase Setup Guide for InnoLink

Follow these steps to connect your app to a real database and deploy it to the web.

## Phase 1: Create Project on Firebase Console (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it `InnoLink`.
3. Disable Google Analytics for now (simpler setup) and click **"Create project"**.
4. Once ready, click **Continue**.

## Phase 2: Register Your App
1. On the Project Overview page, click the **Web icon (</>)**.
2. Name the app `InnoLink-Web`.
3. Check the box **"Also set up Firebase Hosting"**.
4. Click **Register app**.
5. **Copy the `firebaseConfig` object** (the keys looking like `apiKey: "AIza..."`). You will need this for Step 3.

## Phase 3: Connect Codebase
1. Open `src/firebase.js` in your editor.
2. Replace the placeholder config object with the one you copied in Phase 2.

## Phase 4: Set up Firestore Database
1. Go to **"Build" > "Firestore Database"** in the sidebar.
2. Click **"Create Database"**.
3. Choose a location (e.g., `nam5 (us-central)`).
4. **Important**: Start in **Test mode** (allows read/write for 30 days). This is easier for development.
5. Click **Create**.

## Phase 5: storage Setup (For Images/Videos)
1. Go to **"Build" > "Storage"**.
2. Click **"Get Started"**.
3. Choose **Test mode** again.
4. Click **Done**.

## Phase 6: Deploy to Hosting
1. Install Firebase CLI globally (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Google:
   ```bash
   firebase login
   ```
3. Initialize the project:
   ```bash
   firebase init
   ```
   - **Select features**: `Hosting: Configure files for Firebase Hosting...`
   - **Use an existing project**: Select `InnoLink` (the one you created).
   - **What do you want to use as your public directory?**: Type `dist` (since we are using Vite).
   - **Configure as a single-page app?**: `Yes` (IMPORTANT for React Router).
   - **Set up automatic builds and deploys with GitHub?**: `No`.
   - **File dist/index.html already exists. Overwrite?**: `No`.

4. Build your app:
   ```bash
   npm run build
   ```
5. Deploy:
   ```bash
   firebase deploy
   ```

You will get a `Hosting URL` (e.g., `https://innolink-app.web.app`). That is your live website!
