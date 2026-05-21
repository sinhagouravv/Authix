"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Enable3FAButton: () => Enable3FAButton,
  checkStatus: () => checkStatus,
  enable3FA: () => enable3FA,
  startVerification: () => startVerification,
  verifyTOTP: () => verifyTOTP
});
module.exports = __toCommonJS(index_exports);

// src/core.ts
var import_axios = __toESM(require("axios"));
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
  const res = await import_axios.default.post(`${BASE_URL}/start-verification`, {
    clientId,
    userId
  });
  return res.data;
};
var verifyTOTP = async (requestId, token) => {
  const res = await import_axios.default.post(`${BASE_URL}/verify-totp`, {
    requestId,
    token
  });
  return res.data;
};
var checkStatus = async (requestId) => {
  const res = await import_axios.default.get(
    `${BASE_URL}/check-status?requestId=${requestId}`
  );
  return res.data;
};

// src/components/Enable3FAButton.tsx
var import_lucide_react = require("lucide-react");
var import_jsx_runtime = require("react/jsx-runtime");
var Enable3FAButton = ({ config, className = "" }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldCheck, { className: "w-5 h-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative z-10", children: "Enable 3FA" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-px rounded-[15px] border border-white/5 group-hover:border-white/10 transition-colors" })
      ]
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Enable3FAButton,
  checkStatus,
  enable3FA,
  startVerification,
  verifyTOTP
});
