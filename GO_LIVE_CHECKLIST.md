# 🚀 Senior QA Go-Live Checklist

Follow this exact sequence after your Vercel deployment is marked "Ready".

---

## 1. 🕒 Verify Cron Job (Automation Engine)

Ensure your publishing engine is running correctly on Vercel's servers.

1. Go to your **Vercel Dashboard** (https://vercel.com/dashboard).
2. Click on your **ToolsLiguns Project**.
3. Click the **"Settings"** tab at the top.
4. On the left sidebar, click **"Cron Jobs"**.
5. **Verify the following:**
   - [ ] Path is `/api/cron/publish`.
   - [ ] Schedule is `*/10 * * * *`.
   - [ ] Status shows **"Enabled"**.
   - [ ] Next Run time is shown (e.g., "in 5 minutes").

*Tip: If the list is empty, ensure you pushed the `vercel.json` file to the root of your repository.*

---

## 2. 📱 Mobile Install (iOS - iPhone)

Install as a Progressive Web App (PWA) for a native-like experience.

1. Open **Safari** on your iPhone.
2. Navigate to your app URL: `https://your-app-name.vercel.app`
3. Tap the **Share Icon** (Square with an arrow pointing up) at the bottom center.
4. Scroll down the menu and tap **"Add to Home Screen"**.
5. (Optional) Rename the app to "ToolsLiguns".
6. Tap **"Add"** in the top-right corner.
7. **Result:** The app icon will appear on your home screen. Open it to launch in full-screen mode.

---

## 3. 🤖 Mobile Install (Android)

1. Open **Chrome** on your Android device.
2. Navigate to your app URL: `https://your-app-name.vercel.app`
3. Tap the **Three Dots Menu (⋮)** in the top-right corner.
4. Tap **"Install app"** OR **"Add to Home screen"**.
5. Tap **"Install"** / **"Add"** on the confirmation popup.
6. **Result:** The app is installed to your App Drawer/Home Screen.

---

## 4. 🧪 First Run "Smoke Test"

Perform these actions immediately after logging in to verify critical functionality.

### Phase A: Setup
1. **Login:** Log in using your `ADMIN_EMAIL` (Google Auth).
   - *Pass:* You are redirected to the Dashboard.
2. **Connect Socials:** Go to **"Social Accounts"** page.
   - Click "Connect Facebook".
   - Accept permissions.
   - *Pass:* Your Facebook Pages and Instagram Accounts appear in the list.
3. **Add Website:** Go to **"My Websites"** page.
   - Click "Add Website".
   - Enter Name: `Test Site`.
   - Enter URL: `https://example.com`.
   - *Pass:* The website card appears in the grid.

### Phase B: The Critical Test
4. **Schedule a Post:**
   - Go to **"Create Post"**.
   - Select "Test Site".
   - Upload any dummy image.
   - Write a caption: `Hello World {1|2}` (Test spintax).
   - **Important:** Set the schedule time for **5 minutes from now**.
   - Select one Facebook/Instagram account.
   - Click "Schedule Post".
   - *Pass:* Redirects to Calendar/Dashboard, success toast appears.

5. **Wait & Verify:**
   - Wait for 10-15 minutes (to allow the next Cron job to run).
   - **Check Telegram:** Did you receive a "Post Published" notification?
   - **Check Facebook/Instagram:** Is the post live?
   - **Check Dashboard:** Does the post status change to "Published"?

---

## 🛑 Troubleshooting caused by "Missing Variables"

If something fails, check these first:

- **Login Fails (403/500):** Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
- **"Not Authorized" in Dashboard:** Check `ADMIN_EMAIL` correctness.
- **Facebook Connect Fails:** Check `NEXT_PUBLIC_APP_URL` matches your Vercel URL exactly (no trailing slash).
- **Posts don't publish:** Check `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`.
