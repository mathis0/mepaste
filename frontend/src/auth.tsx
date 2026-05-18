import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ApiError,
  fetchMe,
  getAuthToken,
  setAuthToken,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
  User,
} from "./api";

export type Mode = "anon" | "user";

type AuthState = {
  user: User | null;
  loading: boolean;
};

type AuthValue = AuthState & {
  mode: Mode;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: !!getAuthToken(),
  });

  useEffect(() => {
    let cancelled = false;
    if (!getAuthToken()) {
      setState({ user: null, loading: false });
      return;
    }
    fetchMe()
      .then((u) => { if (!cancelled) setState({ user: u, loading: false }); })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          setAuthToken(null);
        }
        setState({ user: null, loading: false });
      });
    return () => { cancelled = true; };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const r = await apiSignUp(email, password, name);
    setAuthToken(r.token);
    setState({ user: r.user, loading: false });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const r = await apiSignIn(email, password);
    setAuthToken(r.token);
    setState({ user: r.user, loading: false });
  }, []);

  const signOut = useCallback(async () => {
    try { await apiSignOut(); } catch { /* ignore */ }
    setAuthToken(null);
    setState({ user: null, loading: false });
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      ...state,
      mode: state.user ? "user" : "anon",
      signUp,
      signIn,
      signOut,
    }),
    [state, signUp, signIn, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within <AuthProvider>");
  return v;
}
