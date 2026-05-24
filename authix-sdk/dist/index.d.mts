import React from 'react';

interface AuthixConfig {
    clientId: string;
    redirectUri: string;
}
interface VerificationResponse {
    requestId: string;
    status: string;
    message?: string;
}
interface StatusResponse {
    requestId: string;
    status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
    userId: string;
}

declare const enable3FA: ({ clientId, redirectUri, }: AuthixConfig) => void;
declare const startVerification: (clientId: string, userId: string) => Promise<VerificationResponse>;
declare const verifyTOTP: (requestId: string, token: string) => Promise<VerificationResponse>;
declare const checkStatus: (requestId: string) => Promise<StatusResponse>;

interface Enable3FAButtonProps {
    config: AuthixConfig;
    className?: string;
}
/**
 * A high-fidelity React component for the 'Enable 3FA' button.
 * Designed with a premium Authix aesthetic using Tailwind CSS.
 */
declare const Enable3FAButton: React.FC<Enable3FAButtonProps>;

export { type AuthixConfig, Enable3FAButton, type StatusResponse, type VerificationResponse, checkStatus, enable3FA, startVerification, verifyTOTP };
