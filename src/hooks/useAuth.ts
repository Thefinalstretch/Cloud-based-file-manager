import { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type AuthData = {
  session?: Session | null;
  profile?: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  user: any | null;
};

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);
