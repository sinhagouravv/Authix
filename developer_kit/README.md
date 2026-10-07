#  Authix Developer Kit (3FA Integration)

Welcome to the **Authix Developer Kit**. Authix provides ultra-secure, multi-factor authentication (3FA) combining:
1. **Factor 1: Knowledge Factor** (Password / Primary Auth)
2. **Factor 2: Possession Factor** (Time-based One-Time Password / TOTP)
3. **Factor 3: Inherence / Out-of-band Biometric Factor** (Instant Push Notification & Biometric approval on the user's Authix mobile app)

---

## 📦 Packages & Folders

- **[authix-sdk](file:///Users/gouravsinha/PROJECTS/Authix/developer_kit/authix-sdk)**: The official TypeScript / React SDK for web applications, SPAs, and fullstack frameworks (Next.js, Remix, Vite).

---

## ⚡ Quick CLI Setup (`npx`)

Any developer can immediately initialize Authix 3FA in their project with a single command:

```bash
# Interactive setup wizard for Next.js / React / Node.js
npx authix-sdk init

# Test backend server connectivity
npx authix-sdk doctor
```

---

## 🚀 Installation & Library Usage (React / Next.js)

### 1. Installation

```bash
npm install authix-sdk
# or
yarn add authix-sdk
# or
pnpm add authix-sdk
```

### 2. Configure AuthixProvider

Wrap your application or auth layout with the `<AuthixProvider>`:

```tsx
import React from 'react';
import { AuthixProvider } from 'authix-sdk';

const authixConfig = {
  clientId: process.env.NEXT_PUBLIC_AUTHIX_CLIENT_ID!,
  redirectUri: 'https://your-app.com/auth/callback',
  baseUrl: 'https://authix-5nkr.onrender.com/api', // or http://localhost:5002/api in dev
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthixProvider config={authixConfig}>
      {children}
    </AuthixProvider>
  );
}
```

---

## 🧩 Drop-in UI Components

### 1. `Enable3FAButton`
A high-converting, animated button to redirect users to enroll their 3FA credentials.

```tsx
import { Enable3FAButton } from 'authix-sdk';

export function SettingsSecurityPage() {
  return (
    <div className="security-card">
      <h3>Enhance Your Account Security</h3>
      <p>Add hardware biometric confirmation and TOTP.</p>
      
      {/* Variants: 'solid' | 'glow' | 'outline' | 'minimal' */}
      <Enable3FAButton 
        config={{ clientId: 'YOUR_CLIENT_ID' }} 
        variant="glow"
        size="lg"
      />
    </div>
  );
}
```

### 2. `Authix3FAModal`
A step-by-step interactive modal that orchestrates Factor 2 (TOTP) and Factor 3 (Mobile push / Biometric confirmation).

```tsx
import React, { useState } from 'react';
import { Authix3FAModal, useAuthix } from 'authix-sdk';

export function LoginForm() {
  const [showModal, setShowModal] = useState(false);
  const { start3FAChallenge } = useAuthix();

  const handlePrimaryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Verify standard username & password with your backend
    const user = await myBackendLogin(email, password);

    if (user.requires3FA) {
      // 2. Trigger Authix 3FA challenge
      await start3FAChallenge(user.id);
      setShowModal(true);
    }
  };

  return (
    <>
      <form onSubmit={handlePrimaryLogin}>
        {/* ... Username & Password fields ... */}
        <button type="submit">Log In</button>
      </form>

      <Authix3FAModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          // 3. User successfully verified all 3 factors!
          window.location.href = '/dashboard';
        }}
      />
    </>
  );
}
```

### 3. `AuthixBadge`
Security trust badge for login pages or footers.

```tsx
import { AuthixBadge } from 'authix-sdk';

export function Footer() {
  return <AuthixBadge theme="dark" size="sm" />;
}
```

---

## ⚡ Core Client (Vanilla JavaScript / Node.js)

For non-React apps or custom integrations, instantiate the `AuthixClient`:

```ts
import { AuthixClient } from 'authix-sdk';

const authix = new AuthixClient({
  clientId: 'YOUR_CLIENT_ID',
  baseUrl: 'https://authix-5nkr.onrender.com/api' // or http://localhost:5002/api in dev
});

// 1. Start Challenge
const challenge = await authix.startVerification('user_12345');
console.log('Challenge Request ID:', challenge.requestId);

// 2. Submit Factor 2 (TOTP)
const totpResult = await authix.verifyTOTP(challenge.requestId, '582910');

// 3. Poll Factor 3 (Mobile Push / Biometric)
const { promise, cancel } = authix.pollChallengeStatus(challenge.requestId, {
  intervalMs: 2000,
  timeoutMs: 60000,
  onStatusChange: (status) => {
    console.log('Current status:', status);
  }
});

const finalStatus = await promise;
if (finalStatus.status === 'VERIFIED') {
  console.log('3FA Authentication Succeeded!');
}
```

---

## 🔒 Server-Side Verification Endpoint Reference

When building backend verification handlers:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/start-verification` | Initiates a 3FA verification challenge and generates `requestId`. |
| `POST` | `/api/verify-totp` | Submits and verifies a 6-digit TOTP code. |
| `GET` | `/api/check-status?requestId=...` | Checks the real-time status of Factor 3 mobile biometric approval. |
| `POST` | `/api/vendor/apps` | Registers a new vendor application with API keys. |

---

## 🛠️ Development & Building

To build the SDK bundle:

```bash
cd developer_kit/authix-sdk
npm install
npm run build
```
