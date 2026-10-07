import axios, { AxiosInstance } from "axios";
import { 
  AuthixConfig, 
  VerificationResponse, 
  StatusResponse, 
  ChallengeStatus, 
  PollOptions, 
  VerificationRequestOptions 
} from "./types";
import { DEFAULT_BASE_URL, DEFAULT_SETUP_URL } from "./config";

export class AuthixClient {
  private config: AuthixConfig;
  private http: AxiosInstance;

  constructor(config: AuthixConfig) {
    this.config = {
      baseUrl: DEFAULT_BASE_URL,
      ...config,
    };

    this.http = axios.create({
      baseURL: this.config.baseUrl || DEFAULT_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "X-Authix-Client-Id": this.config.clientId,
      },
      timeout: 10000,
    });
  }

  /**
   * Redirect user to the Authix 3FA enrollment setup portal.
   */
  public enable3FA(options?: { redirectUri?: string; state?: string; setupUrl?: string }) {
    const redirect = options?.redirectUri || this.config.redirectUri || (typeof window !== "undefined" ? window.location.href : "");
    const state = options?.state || Math.random().toString(36).substring(2);
    
    let setupBase = options?.setupUrl || this.config.setupUrl;
    if (!setupBase) {
      if (this.config.baseUrl && this.config.baseUrl.includes(':5002')) {
        setupBase = this.config.baseUrl.replace(':5002/api', ':3000/setup').replace(':5002', ':3000/setup');
      } else if (this.config.baseUrl) {
        setupBase = this.config.baseUrl.replace('/api', '/setup');
      } else {
        setupBase = DEFAULT_SETUP_URL;
      }
    }

    const url = `${setupBase}?clientId=${encodeURIComponent(
      this.config.clientId
    )}&redirectUri=${encodeURIComponent(redirect)}&state=${encodeURIComponent(state)}`;

    if (typeof window !== "undefined") {
      window.location.href = url;
    }
    return url;
  }

  /**
   * Start a 3FA verification challenge for a user.
   */
  public async startVerification(
    userId: string,
    options?: Partial<VerificationRequestOptions>
  ): Promise<VerificationResponse> {
    try {
      const payload: VerificationRequestOptions = {
        clientId: this.config.clientId,
        userId,
        ...options,
      };

      const res = await this.http.post<VerificationResponse>("/start-verification", payload);
      return res.data;
    } catch (error: any) {
      if (this.config.debug) {
        console.error("[Authix SDK] startVerification error:", error);
      }
      return {
        success: false,
        requestId: "",
        status: "FAILED",
        message: error?.response?.data?.error || error?.message || "Failed to start 3FA verification",
      };
    }
  }

  /**
   * Submit TOTP verification code for an ongoing challenge.
   */
  public async verifyTOTP(requestId: string, token: string): Promise<VerificationResponse> {
    try {
      const res = await this.http.post<VerificationResponse>("/verify-totp", {
        clientId: this.config.clientId,
        requestId,
        token,
      });
      return res.data;
    } catch (error: any) {
      if (this.config.debug) {
        console.error("[Authix SDK] verifyTOTP error:", error);
      }
      return {
        success: false,
        requestId,
        status: "FAILED",
        message: error?.response?.data?.error || error?.message || "TOTP verification failed",
      };
    }
  }

  /**
   * Check the current state of a challenge request (Factor 2 / Factor 3 mobile approval).
   */
  public async checkStatus(requestId: string): Promise<StatusResponse> {
    try {
      const res = await this.http.get<StatusResponse>(`/check-status`, {
        params: { requestId, clientId: this.config.clientId },
      });
      return res.data;
    } catch (error: any) {
      return {
        requestId,
        status: "FAILED",
        userId: "",
        error: error?.response?.data?.error || error?.message || "Failed to check challenge status",
      };
    }
  }

  /**
   * Poll for push notification or biometric confirmation from the mobile app.
   */
  public pollChallengeStatus(
    requestId: string,
    options: PollOptions = {}
  ): { promise: Promise<StatusResponse>; cancel: () => void } {
    const intervalMs = options.intervalMs || 2000;
    const timeoutMs = options.timeoutMs || 60000; // 60s default
    let isCancelled = false;
    let timerId: any = null;

    const promise = new Promise<StatusResponse>((resolve, reject) => {
      const startTime = Date.now();

      const poll = async () => {
        if (isCancelled) {
          return resolve({ requestId, status: "CANCELLED", userId: "" });
        }

        if (Date.now() - startTime >= timeoutMs) {
          return resolve({ requestId, status: "EXPIRED", userId: "" });
        }

        try {
          const statusRes = await this.checkStatus(requestId);
          if (options.onStatusChange) {
            options.onStatusChange(statusRes.status, statusRes);
          }

          if (statusRes.status === "VERIFIED" || statusRes.status === "FAILED" || statusRes.status === "EXPIRED") {
            return resolve(statusRes);
          }

          timerId = setTimeout(poll, intervalMs);
        } catch (err) {
          timerId = setTimeout(poll, intervalMs);
        }
      };

      poll();
    });

    return {
      promise,
      cancel: () => {
        isCancelled = true;
        if (timerId) clearTimeout(timerId);
      },
    };
  }
}

// Standalone Helper functions for backwards compatibility / quick usage
export const enable3FA = (config: AuthixConfig) => {
  const client = new AuthixClient(config);
  return client.enable3FA();
};

export const startVerification = async (
  clientId: string,
  userId: string,
  options?: { baseUrl?: string }
): Promise<VerificationResponse> => {
  const client = new AuthixClient({ clientId, baseUrl: options?.baseUrl });
  return client.startVerification(userId);
};

export const verifyTOTP = async (
  requestId: string,
  token: string,
  options?: { clientId?: string; baseUrl?: string }
): Promise<VerificationResponse> => {
  const client = new AuthixClient({ clientId: options?.clientId || "", baseUrl: options?.baseUrl });
  return client.verifyTOTP(requestId, token);
};

export const checkStatus = async (
  requestId: string,
  options?: { clientId?: string; baseUrl?: string }
): Promise<StatusResponse> => {
  const client = new AuthixClient({ clientId: options?.clientId || "", baseUrl: options?.baseUrl });
  return client.checkStatus(requestId);
};
