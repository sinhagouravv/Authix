// src/core.ts
import axios from "axios";
var BASE_URL = "http://localhost:5002/api";
var SETUP_URL = "http://localhost:5002/setup";
var enable3FA = ({
  clientId,
  redirectUri
}) => {
  const state = Math.random().toString(36).substring(2);
  const url = `${SETUP_URL}?clientId=${clientId}&redirectUri=${encodeURIComponent(
    redirectUri
  )}&state=${state}`;
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
};
var startVerification = async (clientId, userId) => {
  const res = await axios.post(`${BASE_URL}/start-verification`, {
    clientId,
    userId
  });
  return res.data;
};
var verifyTOTP = async (requestId, token) => {
  const res = await axios.post(`${BASE_URL}/verify-totp`, {
    requestId,
    token
  });
  return res.data;
};
var checkStatus = async (requestId) => {
  const res = await axios.get(
    `${BASE_URL}/check-status?requestId=${requestId}`
  );
  return res.data;
};

// src/components/Enable3FAButton.tsx
import { ShieldCheck, ChevronRight } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var Enable3FAButton = ({ config, className = "" }) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => enable3FA(config),
      className: `
        group relative flex items-center gap-3 px-8 py-4 
        bg-[#052558] text-white rounded-2xl font-bold text-[13px] 
        uppercase tracking-[0.15em] shadow-2xl shadow-blue-900/20 
        transition-all duration-300 hover:bg-[#0a3a8a] 
        hover:shadow-blue-900/40 active:scale-[0.98] 
        ${className}
      `,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" }),
        /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" }) }),
        /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Enable 3FA" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-px rounded-[15px] border border-white/5 group-hover:border-white/10 transition-colors" })
      ]
    }
  );
};
export {
  Enable3FAButton,
  checkStatus,
  enable3FA,
  startVerification,
  verifyTOTP
};
