import axios from "axios";
import { AuthixConfig, VerificationResponse, StatusResponse } from "./types";

const BASE_URL = "http://localhost:5002/api";
const SETUP_URL = "http://localhost:5002/setup";

export const enable3FA = ({
  clientId,
  redirectUri,
}: AuthixConfig) => {
  const state = Math.random().toString(36).substring(2);

  const url = `${SETUP_URL}?clientId=${clientId}&redirectUri=${encodeURIComponent(
    redirectUri
  )}&state=${state}`;

  if (typeof window !== "undefined") {
    window.location.href = url;
  }
};

export const startVerification = async (clientId: string, userId: string): Promise<VerificationResponse> => {
  const res = await axios.post(`${BASE_URL}/start-verification`, {
    clientId,
    userId,
  });
  return res.data;
};

export const verifyTOTP = async (requestId: string, token: string): Promise<VerificationResponse> => {
  const res = await axios.post(`${BASE_URL}/verify-totp`, {
    requestId,
    token,
  });
  return res.data;
};

export const checkStatus = async (requestId: string): Promise<StatusResponse> => {
  const res = await axios.get(
    `${BASE_URL}/check-status?requestId=${requestId}`
  );
  return res.data;
};
