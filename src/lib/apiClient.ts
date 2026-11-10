import { FetchError, type FetchOptions, ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// -----plain ofetch client (cookies go with every request)
const baseClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

// -----auth routes where 401 means wrong input, not an expired token
const noRefreshRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/otp-verify",
  "/auth/resend-otp",
  "/auth/forget-password",
  "/auth/reset-password",
  "/auth/refresh-token",
  "/auth/logout",
];

// -----only one refresh at a time, other 401 requests wait for the same one
let refreshing: Promise<unknown> | null = null;

const refreshTokens = () => {
  if (!refreshing) {
    refreshing = baseClient("/auth/refresh-token", { method: "POST" }).finally(
      () => {
        refreshing = null;
      },
    );
  }
  return refreshing;
};

// -----same as ofetch, but when the access token expired (401)
// -----it gets new tokens with the refresh token once and sends the request again
const apiClient = async <T = unknown>(
  url: string,
  options?: FetchOptions<"json">,
): Promise<T> => {
  try {
    return await baseClient<T>(url, options);
  } catch (err) {
    const canRefresh =
      err instanceof FetchError &&
      err.status === 401 &&
      !noRefreshRoutes.includes(url);

    if (!canRefresh) throw err;

    // ----refresh failed too = really logged out, that error goes to the caller
    await refreshTokens();
    return baseClient<T>(url, options);
  }
};

export default apiClient;
