import { UserApi } from "@/common/api";
import { UserContext } from "@/common/useUser";
import UserLayout from "@/layout/UserLayout";
import { type User } from "@/types/api";
import About from "@/views/About";
import Account from "@/views/Account";
import Default from "@/views/Default";
import Homepage from "@/views/Homepage";
import RoomView from "@/views/RoomView";
import SignIn from "@/views/SignIn";
import TodoView from "@/views/TodoView";
import React from "react";
import { Route, Switch, useLocation } from "wouter";

export default function App() {
  const [user, setUser] = React.useState<User | null | undefined>(undefined);

  const [location, setLocation] = useLocation();

  // Initial check whether user is logged in
  React.useEffect(() => {
    UserApi.current()
      .then((resp) => setUser(resp.data))
      .catch(() => {
        setUser(null);
        setLocation("/signin");
      });
  }, [setLocation]);

  React.useEffect(() => {
    if (user === null && location != "/signin") {
      console.log("useUser is null: redirect to signin!");
      setLocation("/signin");
    }
  }, [user, location, setLocation]);

  const onLogin = React.useCallback(() => {
    console.log("onLogin");
    UserApi.current().then((resp) => {
      console.log("current user fetched");
      setUser(resp.data);
      return resp.data.id;
    });
  }, [setUser]);

  const onLogout = React.useCallback(async () => {
    await UserApi.logout();
    console.log("logged out");
    setUser(null);
  }, [setUser]);

  return (
    <UserContext.Provider value={user}>
      <Switch>
        <Route path="/signin">
          <SignIn onLogin={onLogin} />
        </Route>
        <Route path="/room/:roomId">
          {(params) => (
            <UserLayout user={user} onLogout={onLogout}>
              <RoomView roomId={Number.parseInt(params.roomId)} />
            </UserLayout>
          )}
        </Route>
        <Route path="/account">
          <UserLayout user={user} onLogout={onLogout}>
            <Account setUser={setUser} />
          </UserLayout>
        </Route>
        <Route path="/todos">
          <UserLayout user={user} onLogout={onLogout}>
            <TodoView />
          </UserLayout>
        </Route>
        <Route path="/about">
          <UserLayout user={user} onLogout={onLogout}>
            <About />
          </UserLayout>
        </Route>
        <Route path="/">
          <UserLayout user={user} onLogout={onLogout}>
            <Homepage />
          </UserLayout>
        </Route>
        <Route>
          <Default />
        </Route>
      </Switch>
    </UserContext.Provider>
  );
}
