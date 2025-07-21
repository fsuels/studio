# 🎨 Customize Firebase Password Reset Email

## Current Issue
Your email shows:
- `legaldoc-26ea8` (Firebase project ID) instead of your brand name
- `localhost:3000` (development URL) instead of your domain

## ✅ Fix 1: Customize Email Template

### In Firebase Console:

1. **Go to**: Authentication → Templates → **Password reset**
2. **Toggle ON**: "Customize template"
3. **Replace the default template** with:

```html
<table style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <tr>
    <td style="text-align: center; padding: 40px 0;">
      <h1 style="color: #333; margin: 0;">123LegalDoc</h1>
      <p style="color: #666; font-size: 14px; margin: 5px 0;">Legal Documents Made Simple</p>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px 40px;">
      <p style="color: #333; font-size: 16px;">Hello,</p>
      
      <p style="color: #333; font-size: 16px;">
        We received a request to reset the password for your 123LegalDoc account associated with <strong>%EMAIL%</strong>.
      </p>
      
      <p style="color: #333; font-size: 16px;">
        Click the button below to reset your password:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="%LINK%" 
           style="background-color: #4F46E5; color: white; padding: 14px 30px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                  display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #4F46E5; font-size: 14px; word-break: break-all;">
        %LINK%
      </p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        If you didn't request a password reset, you can safely ignore this email. 
        Your password won't be changed unless you click the link above.
      </p>
      
      <p style="color: #666; font-size: 14px;">
        This link will expire in 1 hour for security reasons.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px 40px; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Best regards,<br>
        The 123LegalDoc Team
      </p>
      <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
        © 2024 123LegalDoc. All rights reserved.
      </p>
    </td>
  </tr>
</table>
```

4. **Update Subject Line** to:
   ```
   Reset your 123LegalDoc password
   ```

5. **Click Save**

## ✅ Fix 2: Configure for Production

### For Production Deployment:

1. **In Firebase Console** → Authentication → Templates → Password reset
2. **Change Action URL** to your production domain:
   ```
   https://www.123legaldoc.com/en/auth/action
   ```
   (Replace with your actual domain)

3. **Add your domain** to Authorized domains:
   - Go to: Authentication → Settings → Authorized domains
   - Add: `www.123legaldoc.com` and `123legaldoc.com`

### For Development/Production Toggle:

You can use environment-specific Firebase projects:
- **Development**: Uses `localhost:3000`
- **Production**: Uses `www.123legaldoc.com`

## ✅ Fix 3: Professional Email Settings

### Add Custom Reply-To:
1. In template settings, set:
   - **From name**: `123LegalDoc Support`
   - **Reply-to**: `support@123legaldoc.com`

### Configure Domain Verification:
1. **Project Settings** → **Service accounts**
2. Add and verify your domain for better deliverability

## 📧 Result

Your emails will now show:

```
From: 123LegalDoc Support
Subject: Reset your 123LegalDoc password

Hello,

We received a request to reset the password for your 123LegalDoc account 
associated with suelsferro@hotmail.com.

[Reset Password Button]

Best regards,
The 123LegalDoc Team
```

## 🔄 Testing

After making changes:
1. Request a NEW password reset
2. Email should now show your branding
3. For production, update the Action URL to your real domain

## 💡 Pro Tips

1. **Use different Firebase projects** for dev/staging/production
2. **Test email templates** with Firebase's "Send test email" feature
3. **Monitor spam rates** in Firebase Console → Authentication → Users
4. **Consider custom SMTP** for full control over email branding

The key is customizing the template and using your production domain when you deploy.