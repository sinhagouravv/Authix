export type ChallengeFactor = 'totp' | 'mobile_push' | 'biometric' | 'full_3fa';

export type ChallengeStatus = 
  | 'IDLE'
  | 'PENDING'
  | 'WAITING_TOTP'
  | 'WAITING_MOBILE_APPROVAL'
  | 'VERIFIED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface AuthixConfig {
  clientId: string;
  redirectUri?: string;
  baseUrl?: string;
  setupUrl?: string;
  debug?: boolean;
}

export interface VerificationRequestOptions {
  clientId: string;
  userId: string;
  userEmail?: string;
  action?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface VerificationResponse {
  success: boolean;
  requestId: string;
  status: ChallengeStatus;
  message?: string;
  expiresInSeconds?: number;
  qrCodeUrl?: string;
}

export interface StatusResponse {
  requestId: string;
  status: ChallengeStatus;
  userId: string;
  factor?: ChallengeFactor;
  verifiedAt?: string;
  error?: string;
}

export interface PollOptions {
  intervalMs?: number;
  timeoutMs?: number;
  onStatusChange?: (status: ChallengeStatus, response: StatusResponse) => void;
}

export interface AuthixContextValue {
  config: AuthixConfig;
  status: ChallengeStatus;
  requestId: string | null;
  isLoading: boolean;
  error: string | null;
  start3FAChallenge: (userId: string, options?: Partial<VerificationRequestOptions>) => Promise<VerificationResponse | null>;
  submitTOTP: (totpCode: string) => Promise<boolean>;
  cancelChallenge: () => void;
  reset: () => void;
}
