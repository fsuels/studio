# 🔧 Password Reset Link Issues - Complete Fix Guide

## 🚨 Current Issue
You're getting: **"Your request to reset your password has expired or the link has already been used"**

This can happen due to several reasons:

## 🔍 Common Causes & Solutions

### **1. Authorized Domains Not Configured**

**Firebase Console Steps:**
1. Go to **Firebase Console** → **Authentication**
2. Click **Settings** tab → **Authorized domains**
3. **Add these domains**:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - `legaldoc-26ea8.firebaseapp.com` (your Firebase domain)
   - Your production domain (if applicable)

### **2. Email Template Issues**

**Check Email Template:**
1. **Firebase Console** → **Authentication** → **Templates** tab
2. Click **Password reset**
3. **Verify the action URL** points to the correct domain
4. **Should be**: `https://legaldoc-26ea8.firebaseapp.com/__/auth/action`

### **3. Link Already Used/Expired**

**Timing Issues:**
- Links expire after **1 hour**
- Links can only be used **once**
- Multiple reset requests invalidate previous links

### **4. Browser/Cache Issues**

**Try these:**
- Open link in **incognito/private window**
- Clear browser cache and cookies
- Try different browser
- Don't click the link multiple times

## 🛠️ Immediate Fixes

### **Fix 1: Create Custom Password Reset Handler**

Let me create a custom password reset handler that works more reliably:

1. **Create new page for handling password reset**
2. **Parse the URL parameters**
3. **Handle the reset with proper error handling**

### **Fix 2: Configure Proper Action URL**

The Firebase email template should redirect to your app, not Firebase's default page.

### **Fix 3: Add Proper Error Handling**

Better user experience with clear error messages and retry options.

## 📝 Recommended Solution

**Option A: Use Firebase's Default Flow (Fix Current)**
- Fix authorized domains
- Update email template
- Test with fresh email

**Option B: Custom Password Reset Flow (More Control)**
- Create custom reset page in your app
- Handle reset logic with better UX
- More user-friendly error messages

## 🧪 Testing Checklist

After applying fixes:

- [ ] Request new password reset email
- [ ] **Don't reuse old links** - they're invalid
- [ ] Click link within 1 hour
- [ ] Click link only once
- [ ] Use incognito window for testing
- [ ] Check console for any errors

## ⚡ Quick Fix Steps

1. **Check Firebase authorized domains** (most common cause)
2. **Request NEW password reset email** (don't reuse old links)
3. **Click link immediately** (don't wait)
4. **Use incognito window** (avoid cache issues)

Would you like me to implement a custom password reset flow for better reliability?