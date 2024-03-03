import { UserApi } from "@/common/api";
import { type User } from "@/types/api";
import React from "react";

/**
 * Load user information, either through API call or from cache
 *
 * @param userId - ID of a user
 * @returns User data
 */
export default function (userId: number) {
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    UserApi.getUserData(userId).then((data) => setUser(data));
  });
  return user;
}
