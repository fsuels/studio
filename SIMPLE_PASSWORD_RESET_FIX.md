# 🎯 Simple Password Reset Fix

## The Core Issue

You're getting "expired or already used" because the email link goes to Firebase's buggy default handler. Let's fix this with the simplest solution.

## ✅ Immediate Fix (5 minutes)

### Step 1: Update Firebase Email Template

1. Go to: https://console.firebase.google.com
2. Select your project: **legaldoc-26ea8**
3. Navigate to: **Authentication** → **Templates** → **Password reset**
4. Click the **pencil icon** to edit
5. Find the **"Action URL"** field
6. Change from:
   ```
   https://legaldoc-26ea8.firebaseapp.com/__/auth/action
   ```
   To:
   ```
   http://localhost:3000/en/auth/action
   ```
7. Click **Save**

### Step 2: Verify Authorized Domains

1. Still in Firebase Console
2. Go to: **Authentication** → **Settings** → **Authorized domains**
3. Make sure these are listed:
   - `localhost`
   - `127.0.0.1`

### Step 3: Test with NEW Email

1. Go to your app: http://localhost:3000/signin
2. Click "Forgot Password?"
3. Enter your email
4. Get NEW email (don't use old ones)
5. Click the link
6. Should redirect to YOUR custom handler
7. Reset password successfully!

## 🔍 How to Verify It's Working

When you hover over the reset button in the email, you should see:
```
http://localhost:3000/en/auth/action?mode=resetPassword&oobCode=...
```

NOT:
```
https://legaldoc-26ea8.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=...
```

## 🚨 If Still Not Working

### Quick Check:
1. Did you save the template changes?
2. Did you request a NEW email after saving?
3. Is the email showing your localhost URL?

### Alternative: Direct Test
1. Copy just the `oobCode` value from any email
2. Go directly to:
   ```
   http://localhost:3000/en/auth/action?mode=resetPassword&oobCode=PASTE_CODE_HERE
   ```
3. If this works, the issue is just the email template

## 💡 About the Hydration Error

The hydration error the other AI mentioned is unrelated to password reset. It's likely caused by:
- A browser extension (AdBlock, Grammarly, etc.)
- The `ap-style=""` attribute being injected

To fix hydration error:
1. Try in incognito mode without extensions
2. Or disable browser extensions temporarily

But this won't affect password reset functionality.

## 🎯 The Bottom Line

Your password reset will work once the Firebase email template points to YOUR domain instead of Firebase's default. That's the only change needed.