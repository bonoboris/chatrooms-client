import { useLocalStorage } from "@/common/useLocalStorage";
import Button from "@/components/Button";
import UserAvatar from "@/components/UserAvatar";
import { type User } from "@/types/api";
import React from "react";
import { Link } from "wouter";

export interface UserLayoutProps {
  /** Logged in user */
  user: User | null | undefined;
  /** Callback on logout */
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function UserLayout({ user, onLogout, children }: UserLayoutProps) {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  React.useEffect(
    function () {
      if (darkMode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    },
    [darkMode],
  );
  if (user === null) return null;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="border-base sticky top-0 flex h-screen w-64 flex-col items-stretch space-y-4 border-r bg-neutral-100 dark:bg-neutral-900">
        <div className="flex flex-col items-stretch space-y-2">
          <h1>
            <Link className="block p-4 text-purple-500 hover:bg-purple-500/10" href="/">
              chatrooms.
            </Link>
          </h1>
          <div>
            <Link
              href="/account"
              className="btn flex w-full items-center space-x-4 rounded-none p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700"
            >
              <UserAvatar user={user} className="h-10 w-10 rounded-full" />
              <p className="text-xl font-semibold">{user?.username}</p>
            </Link>
          </div>
          <Button onClick={onLogout} className="mx-2 self-stretch">
            Log Out
          </Button>
        </div>
        <hr className="border-neutral-300 dark:border-neutral-700" />
        <Link
          href="/todos"
          className="btn flex w-full rounded-none p-2 text-xl font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700"
        >
          My Todos
        </Link>
        <div className="flex-1"></div>
        <hr className="border-neutral-300 dark:border-neutral-700" />
        <div className="flex w-full items-center justify-center space-x-4 place-self-end pb-2">
          <span>Theme:</span>
          <Button variant={darkMode ? "default" : "filled"} onClick={() => setDarkMode(false)}>
            Light
          </Button>
          <Button variant={darkMode ? "filled" : "default"} onClick={() => setDarkMode(true)}>
            Dark
          </Button>
        </div>
      </aside>
      {children}
    </div>
  );
}
