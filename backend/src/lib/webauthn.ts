import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import crypto from 'node:crypto';
import { Admin } from '../models/Admin';

// Standard Base64URL helper
export const toBase64URL = (buff: Buffer | Uint8Array): string => {
  return Buffer.from(buff).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// Standard Base64URL decoder
export const fromBase64URL = (str: string | Buffer | Uint8Array): Buffer => {
  if (typeof str !== 'string') return Buffer.from(str as any);
  return Buffer.from(str, 'base64url');
};

export const RP_NAME = 'Authix Admin Portal';
export const RP_ID = 'localhost';

export const WebAuthnService = {
  // 1. Prepare Registration
  async prepareRegistration(adminId: string, userName: string) {
    const admin = await Admin.findOne({ adminId });
    if (!admin) throw new Error('Admin not found');

    const manualChallenge = crypto.randomBytes(32);
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: Uint8Array.from(Buffer.from(adminId)),
      userName: userName,
      attestationType: 'none',
      challenge: manualChallenge,
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'required',
      },
    });

    // Save challenge as string to DB for perfect matching
    const challengeStr = typeof options.challenge === 'string' 
      ? options.challenge 
      : toBase64URL(options.challenge);
      
    admin.currentChallenge = challengeStr;
    await admin.save();

    return {
      ...options,
      challenge: challengeStr,
      user: {
        ...options.user,
        id: typeof options.user.id === 'string' ? options.user.id : toBase64URL(options.user.id),
      }
    };
  },

  // 2. Verify Registration
  async verifyRegistration(adminId: string, registrationResponse: any, expectedOrigin: string) {
    const admin = await Admin.findOne({ adminId });
    if (!admin || !admin.currentChallenge) throw new Error('Admin or challenge missing');

    const verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge: admin.currentChallenge,
      expectedOrigin,
      expectedRPID: RP_ID,
    });

    if (verification.verified && verification.registrationInfo) {
      const regInfo = verification.registrationInfo as any;
      
      // Handle both v12 and v13 property names
      const credentialID = regInfo.credentialID || (regInfo.credential && regInfo.credential.id);
      const credentialPublicKey = regInfo.credentialPublicKey || (regInfo.credential && regInfo.credential.publicKey);
      const counter = regInfo.counter !== undefined ? regInfo.counter : (regInfo.credential && regInfo.credential.counter) || 0;

      if (!credentialID || !credentialPublicKey) {
        throw new Error('Biometric data missing from response');
      }

      admin.passkeys.push({
        credentialID: toBase64URL(credentialID),
        publicKey: toBase64URL(credentialPublicKey),
        counter: counter,
      });

      admin.currentChallenge = undefined;
      await admin.save();
      return { verified: true };
    }

    return { verified: false };
  },

  // 3. Prepare Authentication
  async prepareAuthentication(adminId: string) {
    const admin = await Admin.findOne({ adminId });
    if (!admin) throw new Error('Admin not found');

    const validPasskeys = (admin.passkeys || []).filter((p: any) => p.credentialID && p.publicKey);
    if (validPasskeys.length === 0) throw new Error('No passkeys registered');

    const manualChallenge = crypto.randomBytes(32);
    const allowCredentials = validPasskeys.map((p: any) => ({
      id: new Uint8Array(fromBase64URL(p.credentialID)),
      type: 'public-key' as const,
    }));

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials,
      userVerification: 'required',
      challenge: manualChallenge,
    });

    // Save challenge as string to DB for perfect matching
    const challengeStr = typeof options.challenge === 'string' 
      ? options.challenge 
      : toBase64URL(options.challenge);
      
    admin.currentChallenge = challengeStr;
    await admin.save();

    return {
      ...options,
      challenge: challengeStr,
      allowCredentials: options.allowCredentials?.map((cred: any) => ({
        ...cred,
        id: typeof cred.id === 'string' ? cred.id : toBase64URL(cred.id),
      })),
    };
  },

  // 4. Verify Authentication
  async verifyAuthentication(adminId: string, authResponse: any, expectedOrigin: string) {
    const admin = await Admin.findOne({ adminId });
    if (!admin || !admin.currentChallenge) throw new Error('Admin or challenge missing');

    const passkey = admin.passkeys.find((p: any) => p.credentialID === authResponse.id);
    if (!passkey) throw new Error('Passkey not found');

    const verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: admin.currentChallenge,
      expectedOrigin,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: fromBase64URL(passkey.credentialID),
        credentialPublicKey: fromBase64URL(passkey.publicKey),
        counter: passkey.counter,
      },
    } as any);

    if (verification.verified && verification.authenticationInfo) {
      const { newCounter } = verification.authenticationInfo;
      
      await Admin.updateOne(
        { adminId, "passkeys.credentialID": passkey.credentialID },
        { 
          $set: { "passkeys.$.counter": newCounter },
          $unset: { currentChallenge: "" }
        }
      );

      return { verified: true };
    }

    return { verified: false };
  }
};
