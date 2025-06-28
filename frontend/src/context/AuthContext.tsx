import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

// ============================================================================
// 1. INTERFACES: Define the shape of all our data
// ============================================================================

/** Describes the user object returned from your API */
interface User {
  id: string;
  userName: string;
  email: string;
  role: "developer" | "recruiter" | "admin"; // Use specific roles if known
  picture?: string; // Optional, for Google Sign-In
}

/** Describes the authentication state managed by the context */
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

/** Describes the return type for sign-in calls that require 2FA */
interface TwoFactorResponse {
  twoFactorRequired: true;
  tempToken: string;
  message: string;
}

/** Describes the entire value provided by the AuthContext */
interface AuthContextType {
  authState: AuthState;
  api: AxiosInstance;
  signIn: (
    email: string,
    password: string,
    captchaToken: string
  ) => Promise<TwoFactorResponse | string>;
  googleSignIn: (tokenId: string) => Promise<TwoFactorResponse | string>;
  signUp: (
    userName: string,
    email: string,
    password: string,
    captchaToken: string,
    role: string
  ) => Promise<string>;
  signOut: () => Promise<string>;
  forgotPassword: (email: string, captchaToken: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
}

/** Describes the props for the AuthProvider component */
interface AuthProviderProps {
  children: ReactNode;
}

/** Extends Axios config to allow for a custom _retry property */
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ============================================================================
// 2. CONTEXT CREATION
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// 3. PROVIDER COMPONENT
// ============================================================================

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Effect to refresh token on initial application load
  useEffect(() => {
    axios
      .post<{ data: { accessToken: string; user: User } }>(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh-token?silent=true`,
        {},
        { withCredentials: true }
      )
      .then((res) =>
        setAuthState({
          accessToken: res.data.data.accessToken,
          isAuthenticated: true,
          user: res.data.data.user,
          isLoading: false,
        })
      )
      .catch(() =>
        setAuthState({
          accessToken: null,
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
      );
  }, []);

  // Axios instance with interceptors for token management
  const api: AxiosInstance = axios.create();

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (authState.accessToken) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    config.headers["x-api-key"] = import.meta.env.VITE_API_KEY as string;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      const originalRequest = err.config as RetryableAxiosRequestConfig;
      if (
        err.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const { data } = await axios.post<{
            data: { accessToken: string; user: User };
          }>(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = data.data.accessToken;
          setAuthState({
            accessToken: newAccessToken,
            isAuthenticated: true,
            user: data.data.user,
            isLoading: false,
          });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          setAuthState({
            accessToken: null,
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(err);
    }
  );

  // Authentication functions
  const signIn = async (
    email: string,
    password: string,
    captchaToken: string
  ): Promise<TwoFactorResponse | string> => {
    const res = await axios.post<{
      data: { accessToken: string; user: User } | { tempToken: string };
      message: string;
    }>(
      `${import.meta.env.VITE_API_URL}/api/auth/sign-in`,
      { email, password, captchaToken },
      { withCredentials: true }
    );
    const payload = res.data.data;

    if ("tempToken" in payload) {
      return {
        twoFactorRequired: true,
        tempToken: payload.tempToken,
        message: res.data.message,
      };
    }

    setAuthState({
      accessToken: payload.accessToken,
      isAuthenticated: true,
      user: payload.user,
      isLoading: false,
    });
    return res.data.message;
  };

  const googleSignIn = async (
    tokenId: string
  ): Promise<TwoFactorResponse | string> => {
    const res = await axios.post<{
      data: { accessToken: string; user: User } | { tempToken: string };
      message: string;
    }>(
      `${import.meta.env.VITE_API_URL}/api/auth/google`,
      { tokenId },
      { withCredentials: true }
    );
    const payload = res.data.data;

    if ("tempToken" in payload) {
      return {
        twoFactorRequired: true,
        tempToken: payload.tempToken,
        message: res.data.message,
      };
    }

    setAuthState({
      accessToken: payload.accessToken,
      isAuthenticated: true,
      user: payload.user,
      isLoading: false,
    });
    return res.data.message;
  };

  const signUp = async (
    userName: string,
    email: string,
    password: string,
    captchaToken: string,
    role: string
  ): Promise<string> => {
    const res = await axios.post<{
      data: { accessToken: string; user: User };
      message: string;
    }>(
      `${import.meta.env.VITE_API_URL}/api/auth/sign-up`,
      { userName, email, password, captchaToken, role },
      { withCredentials: true }
    );
    const payload = res.data.data;
    setAuthState({
      accessToken: payload.accessToken,
      isAuthenticated: true,
      user: payload.user,
      isLoading: false,
    });
    return res.data.message;
  };

  const signOut = async (): Promise<string> => {
    const res = await axios.post<{ message: string }>(
      `${import.meta.env.VITE_API_URL}/api/auth/sign-out`
    );
    setAuthState({
      accessToken: null,
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    return res.data.message;
  };

  const forgotPassword = async (
    email: string,
    captchaToken: string
  ): Promise<string> => {
    const res = await axios.post<{ message: string }>(
      `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
      { email, captchaToken },
      { withCredentials: true }
    );
    return res.data.message;
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<string> => {
    const res = await axios.post<{ message: string }>(
      `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
      { token, newPassword },
      { withCredentials: true }
    );
    return res.data.message;
  };

  // The value that will be available to all consuming components
  const value: AuthContextType = {
    authState,
    api,
    signIn,
    googleSignIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// 4. CUSTOM HOOK
// ============================================================================

/**
 * Custom hook to easily access the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
