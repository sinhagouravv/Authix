#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const http = require('http');
const https = require('https');

const args = process.argv.slice(2);
const command = args[0] || 'help';

const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const magenta = '\x1b[35m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';
const red = '\x1b[31m';

function printBanner() {
  console.log(`
${blue}${bold}   ___         __   __     _          
  / _ | __ __ / /_ / /    (_)__ __    
 / __ |/ // // __// _ \\  / / \\ \ /    
/_/ |_|\\_,_/ \\__//_//_/ /_/ /_\\_\\     
${reset}${cyan}  3-Factor Authentication SDK & CLI v1.0.0${reset}
`);
}

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

async function init() {
  printBanner();
  console.log(`${bold}Setting up Authix 3FA in your project...${reset}\n`);

  const clientId = (await prompt(`${cyan}? Enter your Authix Client ID ${reset}(e.g. authix_cli_... or press Enter for demo): `)).trim() || 'authix_cli_demo';
  const apiUrl = (await prompt(`${cyan}? Authix Backend API URL ${reset}(default: http://localhost:5002/api): `)).trim() || 'http://localhost:5002/api';
  const framework = (await prompt(`${cyan}? Select Framework [1: Next.js (App Router), 2: React (Vite/CRA), 3: Node.js / Express] (default: 1): `)).trim() || '1';

  const cwd = process.cwd();

  // 1. Write .env.local or .env
  const envFilePath = path.join(cwd, framework === '1' ? '.env.local' : '.env');
  const envContent = `
# Authix 3FA Configuration
NEXT_PUBLIC_AUTHIX_CLIENT_ID=${clientId}
NEXT_PUBLIC_AUTHIX_BASE_URL=${apiUrl}
AUTHIX_CLIENT_ID=${clientId}
AUTHIX_BASE_URL=${apiUrl}
`;

  try {
    if (fs.existsSync(envFilePath)) {
      fs.appendFileSync(envFilePath, envContent);
      console.log(`${green}✔ Updated ${path.basename(envFilePath)} with Authix environment variables.${reset}`);
    } else {
      fs.writeFileSync(envFilePath, envContent.trim() + '\n');
      console.log(`${green}✔ Created ${path.basename(envFilePath)} with Authix environment variables.${reset}`);
    }
  } catch (err) {
    console.log(`${yellow}⚠ Could not write env file: ${err.message}${reset}`);
  }

  // 2. Generate Starter Integration File
  if (framework === '1') {
    // Next.js App Router Component
    const sampleDir = path.join(cwd, 'components');
    if (!fs.existsSync(sampleDir)) fs.mkdirSync(sampleDir, { recursive: true });
    
    const sampleFile = path.join(sampleDir, 'AuthixLoginDemo.tsx');
    const sampleCode = `'use client';

import React, { useState } from 'react';
import { AuthixProvider, Authix3FAModal, Enable3FAButton, AuthixBadge, useAuthix } from 'authix-sdk';

const authixConfig = {
  clientId: process.env.NEXT_PUBLIC_AUTHIX_CLIENT_ID || '${clientId}',
  baseUrl: process.env.NEXT_PUBLIC_AUTHIX_BASE_URL || '${apiUrl}',
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show3FAModal, setShow3FAModal] = useState(false);
  const { start3FAChallenge, status } = useAuthix();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Authenticate Factor 1 with your own server
    console.log('Factor 1 verified for:', email);

    // 2. Trigger Authix 3FA challenge
    await start3FAChallenge(email);
    setShow3FAModal(true);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Sign In</h2>
        <AuthixBadge size="sm" theme="dark" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl transition"
        >
          Sign In with 3FA
        </button>
      </form>

      <div className="pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400 mb-3">Want to enroll 3FA on another account?</p>
        <Enable3FAButton config={authixConfig} variant="glow" size="sm" />
      </div>

      {/* 3FA Interactive Modal */}
      <Authix3FAModal
        isOpen={show3FAModal}
        onClose={() => setShow3FAModal(false)}
        onSuccess={() => {
          alert('🎉 3FA Verification complete! Redirecting to dashboard...');
          setShow3FAModal(false);
        }}
      />
    </div>
  );
}

export default function AuthixLoginDemo() {
  return (
    <AuthixProvider config={authixConfig}>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </AuthixProvider>
  );
}
`;
    fs.writeFileSync(sampleFile, sampleCode);
    console.log(`${green}✔ Generated sample 3FA component at ${cyan}components/AuthixLoginDemo.tsx${reset}`);
  }

  console.log(`\n${green}${bold} Authix 3FA setup complete!${reset}`);
  console.log(`\n${bold}Next steps:${reset}`);
  console.log(`  1. Install SDK in your app: ${cyan}npm install authix-sdk${reset}`);
  console.log(`  2. Import ${cyan}<AuthixProvider>${reset} and ${cyan}<Authix3FAModal>${reset} in your application.`);
  console.log(`  3. Test the flow with demo code ${green}123456${reset}.\n`);
}

function verifyHealth() {
  printBanner();
  console.log(`${bold}Checking Authix Backend connectivity...${reset}\n`);

  const url = process.env.AUTHIX_BASE_URL || 'http://localhost:5002/api';
  const parsed = new URL(url.replace('/api', ''));

  const client = parsed.protocol === 'https:' ? https : http;
  const req = client.get({
    hostname: parsed.hostname,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    path: '/',
    timeout: 5000,
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`${green}✔ Connected to Authix Server at ${parsed.origin}${reset}`);
      console.log(`  Status Code: ${green}${res.statusCode}${reset}`);
      console.log(`  Response: ${data}`);
    });
  });

  req.on('error', (err) => {
    console.log(`${red}✖ Failed to reach Authix Server at ${parsed.origin}${reset}`);
    console.log(`  Error: ${err.message}`);
    console.log(`  Tip: Ensure your server is running with ${cyan}npm run dev:server${reset}`);
  });

  req.on('timeout', () => {
    req.destroy();
    console.log(`${red}✖ Connection timed out.${reset}`);
  });
}

function help() {
  printBanner();
  console.log(`
${bold}USAGE:${reset}
  ${cyan}npx authix-sdk <command>${reset}
  ${cyan}npm install authix-sdk${reset}

${bold}COMMANDS:${reset}
  ${green}init${reset}       Interactive wizard to setup Authix 3FA in a Next.js / React app
  ${green}doctor${reset}     Test connection and health of your Authix Backend
  ${green}help${reset}       Show this help manual

${bold}REACT / NEXT.JS USAGE:${reset}
  ${cyan}import { AuthixProvider, Authix3FAModal, Enable3FAButton, useAuthix } from 'authix-sdk';${reset}
`);
}

switch (command) {
  case 'init':
  case 'setup':
    init();
    break;
  case 'doctor':
  case 'health':
  case 'ping':
    verifyHealth();
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    help();
    break;
}
