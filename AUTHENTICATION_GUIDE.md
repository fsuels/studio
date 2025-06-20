# Authentication Guide

This guide explains the authentication patterns used in the 123legaldoc application.

## Authentication Systems

### 1. User Authentication (Firebase Auth)

**Client-Side (`/src/hooks/useAuth.tsx`)**
- Firebase Authentication with email/password
- React Context for state management
- Local storage persistence
- Used for regular user authentication

**Server-Side (`/src/lib/server-auth.ts`)**
- Firebase Admin SDK for token verification
- Extracts Bearer tokens from Authorization header
- Verifies Firebase ID tokens
- Returns authenticated user data

### 2. Admin Authentication (JWT)

**Server-Side (`/src/lib/admin-auth.ts`)**
- Custom JWT-based authentication
- Used for admin panel access
- Separate from user authentication
- Cookie-based session management

## Implementation Patterns

### For API Routes

#### 1. Standard Authentication (Recommended)
```typescript
import { requireAuth } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  // Authenticate user
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult; // Returns 401 if auth fails
  }
  
  const user = authResult;
  console.log(`User authenticated: ${user.uid} (${user.email})`);
  
  // Your API logic here...
}
```

#### 2. Optional Authentication
```typescript
import { authenticateUser } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const user = await authenticateUser(request);
  
  if (user) {
    // Authenticated user logic
    console.log(`Authenticated user: ${user.uid}`);
  } else {
    // Anonymous user logic
    console.log('Anonymous user');
  }
  
  // Your API logic here...
}
```

#### 3. Development Fallback
```typescript
import { authenticateUserWithFallback } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const user = await authenticateUserWithFallback(request);
  // Always returns a user (mock in development)
  
  // Your API logic here...
}
```

### For Client-Side API Calls

#### 1. Automatic Token Attachment
```typescript
import { authenticatedFetch } from '@/lib/client-auth';

// Automatically includes Authorization header
const response = await authenticatedFetch('/api/protected-route', {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### 2. Simplified POST Requests
```typescript
import { authenticatedPost } from '@/lib/client-auth';

const response = await authenticatedPost('/api/generate-pdf', {
  documentType: 'bill-of-sale-vehicle',
  answers: formData,
});
```

#### 3. PDF Generation Helper
```typescript
import { generateAuthenticatedPdf } from '@/lib/client-auth';

const pdfBlob = await generateAuthenticatedPdf({
  documentType: 'bill-of-sale-vehicle',
  answers: formData,
  state: 'CA'
});
```

## API Route Examples

### Protected PDF Generation
```typescript
// /src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';
import { generatePdfDocument } from '@/services/pdf-generator';

export async function POST(request: NextRequest) {
  // Authenticate user first
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  const user = authResult;

  const body = await request.json();
  const { documentType, answers } = body;

  // Generate PDF for authenticated user
  const pdfBytes = await generatePdfDocument({ 
    documentType, 
    answers,
    userId: user.uid // Include user ID in generation
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${documentType}.pdf"`,
    },
  });
}
```

### Admin-Only Routes
```typescript
// /src/app/api/admin/orders/route.ts
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }
  const admin = adminResult;

  // Admin-only logic here...
}
```

## React Component Usage

### With Authentication Hook
```typescript
import { useAuth } from '@/hooks/useAuth';
import { generateAuthenticatedPdf } from '@/lib/client-auth';

function MyComponent() {
  const { isLoggedIn, user } = useAuth();

  const handleGeneratePdf = async () => {
    if (!isLoggedIn) {
      alert('Please log in first');
      return;
    }

    try {
      const pdfBlob = await generateAuthenticatedPdf({
        documentType: 'bill-of-sale-vehicle',
        answers: formData,
      });
      
      // Handle PDF download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleGeneratePdf}>
          Generate PDF
        </button>
      ) : (
        <p>Please log in to generate documents</p>
      )}
    </div>
  );
}
```

## Security Considerations

1. **Token Verification**: Always verify Firebase ID tokens on the server
2. **Token Expiration**: Firebase tokens automatically expire and refresh
3. **HTTPS Only**: Ensure all API calls use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for authenticated endpoints
5. **Input Validation**: Always validate user input even for authenticated users
6. **Error Handling**: Don't expose sensitive information in error messages

## Environment Variables

Required environment variables for authentication:

```bash
# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY_JSON={"type": "service_account", ...}

# Firebase Client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## Migration from Mock Auth

To migrate existing API routes from mock authentication:

1. **Import the new auth functions**:
   ```typescript
   import { requireAuth } from '@/lib/server-auth';
   ```

2. **Add authentication check**:
   ```typescript
   const authResult = await requireAuth(request);
   if (authResult instanceof Response) {
     return authResult;
   }
   const user = authResult;
   ```

3. **Update client-side calls**:
   ```typescript
   // Old
   const response = await fetch('/api/endpoint', { ... });
   
   // New
   const response = await authenticatedFetch('/api/endpoint', { ... });
   ```

## Testing

For testing authenticated routes:

1. **Development**: Use `authenticateUserWithFallback` for mock users
2. **Unit Tests**: Mock the auth functions
3. **Integration Tests**: Use Firebase Auth emulator
4. **E2E Tests**: Create test users and get real tokens

## Troubleshooting

Common issues and solutions:

1. **401 Unauthorized**: Check if Authorization header is being sent
2. **Token Expired**: Firebase automatically refreshes tokens
3. **Invalid Token**: Verify Firebase Admin SDK configuration
4. **CORS Issues**: Ensure proper CORS configuration for cross-origin requests