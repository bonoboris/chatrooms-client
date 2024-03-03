/** Schema for user request body */
export interface UserIn {
  /** User username */
  username: string;
  /** User email */
  email: string;
}

/** Schema for user response body */
export interface User extends UserIn {
  /** User ID */
  id: number;
  /** Whether the user is active. */
  is_active: boolean;
  /** Date of user creation, ISO format. */
  created_at: string;
  /** User avatar, as bytes. */
  avatar_id?: number;
}
