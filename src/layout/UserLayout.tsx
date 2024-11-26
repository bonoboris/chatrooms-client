import { useLocalStorage } from "@/common/useLocalStorage";
import Button from "@/components/Button";
import UserAvatar from "@/components/UserAvatar";
import { type User } from "@/types/api";
import { useCallback, useEffect, type ReactNode } from "react";
import { Link } from "wouter";

export interface UserLayoutProps {
  /** Logged in user */
  readonly user: User | null | undefined;
  /** Callback on logout */
  readonly onLogout: () => void;
  readonly children: ReactNode;
}

export default function UserLayout({ user, onLogout, children }: UserLayoutProps) {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  useEffect(
    function () {
      if (darkMode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    },
    [darkMode],
  );
  const setDarkModeOn = useCallback(() => setDarkMode(true), [setDarkMode]);
  const setDarkModeOff = useCallback(() => setDarkMode(false), [setDarkMode]);

  if (user === null) return null;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 flex h-screen w-64 flex-col items-stretch space-y-4 border-r bg-neutral-100 border-normal dark:bg-neutral-900">
        <div className="flex flex-col items-stretch space-y-2">
          <h1>
            <Link className="block p-4 text-purple-500 hover:bg-purple-500/10" href="/">
              chatrooms.
            </Link>
          </h1>
          <div>
            <Link
              className="btn flex w-full items-center space-x-4 rounded-none p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              href="/account"
            >
              <UserAvatar className="h-10 w-10 rounded-full" user={user} />
              <p className="text-xl font-semibold">{user?.username}</p>
            </Link>
          </div>
          <Button className="mx-2 self-stretch" onClick={onLogout}>
            Log Out
          </Button>
        </div>
        <hr className="border-normal" />
        <Link
          className="btn flex w-full rounded-none p-2 text-xl font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700"
          href="/todos"
        >
          My Todos
        </Link>
        <div className="flex-1" />
        <hr className="border-normal" />
        <div className="flex w-full items-center justify-center space-x-4 place-self-end pb-2">
          <span>Theme:</span>
          <Button onClick={setDarkModeOff} variant={darkMode ? "default" : "filled"}>
            Light
          </Button>
          <Button onClick={setDarkModeOn} variant={darkMode ? "filled" : "default"}>
            Dark
          </Button>
        </div>
      </aside>
      {children}
    </div>
  );
}
