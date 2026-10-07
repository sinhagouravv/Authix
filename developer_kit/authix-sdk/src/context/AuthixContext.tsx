import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { AuthixConfig, AuthixContextValue, ChallengeStatus, VerificationRequestOptions, VerificationResponse } from '../types';
import { AuthixClient } from '../core';

const AuthixContext = createContext<AuthixContextValue | null>(null);

export interface AuthixProviderProps {
  config: AuthixConfig;
  children: React.ReactNode;
}

export const AuthixProvider: React.FC<AuthixProviderProps> = ({ config, children }) => {
  const clientRef = useRef<AuthixClient>(new AuthixClient(config));
  const [status, setStatus] = useState<ChallengeStatus>('IDLE');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const activePollRef = useRef<{ cancel: () => void } | null>(null);

  const cancelChallenge = useCallback(() => {
    if (activePollRef.current) {
      activePollRef.current.cancel();
      activePollRef.current = null;
    }
    setStatus('CANCELLED');
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    cancelChallenge();
    setStatus('IDLE');
    setRequestId(null);
    setError(null);
    setIsLoading(false);
  }, [cancelChallenge]);

  const start3FAChallenge = useCallback(async (
    userId: string,
    options?: Partial<VerificationRequestOptions>
  ): Promise<VerificationResponse | null> => {
    setIsLoading(true);
    setError(null);
    setStatus('PENDING');

    try {
      const response = await clientRef.current.startVerification(userId, options);
      if (!response.success) {
        setStatus('FAILED');
        setError(response.message || 'Failed to start verification challenge');
        setIsLoading(false);
        return response;
      }

      setRequestId(response.requestId);
      setStatus(response.status || 'WAITING_TOTP');

      // Start background polling for mobile push/biometric confirmation
      const poll = clientRef.current.pollChallengeStatus(response.requestId, {
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
        },
      });

      activePollRef.current = poll;

      poll.promise.then((statusRes) => {
        setStatus(statusRes.status);
        setIsLoading(false);
        if (statusRes.status === 'FAILED' || statusRes.status === 'EXPIRED') {
          setError(statusRes.error || `Verification ${statusRes.status.toLowerCase()}`);
        }
      });

      return response;
    } catch (err: any) {
      setStatus('FAILED');
      setError(err?.message || 'Unexpected verification error');
      setIsLoading(false);
      return null;
    }
  }, []);

  const submitTOTP = useCallback(async (totpCode: string): Promise<boolean> => {
    if (!requestId) {
      setError('No active verification request ID');
      return false;
    }

    setIsLoading(true);
    try {
      const res = await clientRef.current.verifyTOTP(requestId, totpCode);
      if (res.success) {
        setStatus(res.status || 'WAITING_MOBILE_APPROVAL');
        return true;
      } else {
        setError(res.message || 'Invalid TOTP code');
        return false;
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to verify TOTP code');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  const contextValue: AuthixContextValue = {
    config,
    status,
    requestId,
    isLoading,
    error,
    start3FAChallenge,
    submitTOTP,
    cancelChallenge,
    reset,
  };

  return (
    <AuthixContext.Provider value={contextValue}>
      {children}
    </AuthixContext.Provider>
  );
};

export const useAuthix = (): AuthixContextValue => {
  const context = useContext(AuthixContext);
  if (!context) {
    throw new Error('useAuthix must be used within an <AuthixProvider />');
  }
  return context;
};
