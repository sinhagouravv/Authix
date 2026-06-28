export interface AuthixConfig {
  clientId: string;
  redirectUri: string;
}

export interface VerificationResponse {
  requestId: string;
  status: string;
  message?: string;
}

export interface StatusResponse {
  requestId: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
  userId: string;
}
