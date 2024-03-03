import { type User } from "@/types/api";
import { createContext, useContext } from "react";
import { useLocation } from "wouter";

export const UserContext = createContext<User | null | undefined>(null);
UserContext.displayName = "UserContext";

export default function useUser(redirectLogin: true): User | undefined;
export default function useUser(redirectLogin?: false): User | null | undefined;

/**
 * Current logged in user.
 *
 * If `redirectLogin` is `true` and user is not logged in, will redirect to /signin page.
 *
 * @param redirectLogin - If `true` and user is not logged in, will redirect to /signin page
 */
export default function useUser(redirectLogin = false): User | null | undefined {
  const [location, setLocation] = useLocation();
  const user = useContext(UserContext);
  if (redirectLogin && user === null && location != "/signin") {
    console.log("useUser is null: redirect to signin!");
    setLocation("/signin");
  }
  return user;
}
