import {
  type DefaultErrorResponse,
  type DeleteStatus,
  type HTTPValidationError,
  type LoginParams,
  type Message,
  type MessageIn,
  type Room,
  type RoomIn,
  type Todo,
  type TodoIn,
  type User,
  type UserIn,
} from "@/types/api";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import {
  type ErrorOption,
  type FieldPath,
  type FieldValues,
  type UseFormSetError,
} from "react-hook-form";

/** API base URL */
export const baseURL = "http://127.0.0.1:8000";

/** API axios instance */
export const api = axios.create({ baseURL, withCredentials: true });

/** Derive Websocket base URL from `baseURL` */
export function getWebSocketBaseUrl() {
  const [protocol, ...others] = (api.defaults.baseURL ?? baseURL).split("://");
  const qualHost = others.join("://");
  return `${protocol === "https" ? "wss" : "ws"}://${qualHost}`;
}

/** Pagination & sorting params */
export interface PageSortParams {
  /** Offset */
  skip?: number;
  /** Page size */
  limit?: number;
  /** Sort by key */
  sort_by?: string;
  /** Sort order */
  sort_dir?: "asc" | "desc";
}

export type AxiosPromise<T = undefined, D = undefined> = Promise<AxiosResponse<T, D>>;
export type SetErrorName<TFieldValues extends FieldValues = FieldValues> =
  | FieldPath<TFieldValues>
  | `root.${string}`
  | "root";

export type FormErrors<TFieldValues extends FieldValues = FieldValues> = Record<
  SetErrorName<TFieldValues>,
  ErrorOption
>;

const userDataCache = new Map<number, AxiosPromise<User>>();

export const UserApi = {
  /**
   * Login
   *
   * @param data - Login credentials
   * @returns Axios Response
   */
  login: (data: LoginParams) => {
    const urlParams = new URLSearchParams();
    for (const key in data) {
      const value = data[key as keyof LoginParams];
      if (value != null) urlParams.set(key, value);
    }
    return api.post("/login", urlParams, { params: { use_cookie: true } }) as AxiosPromise<
      undefined,
      URLSearchParams
    >;
  },
  /** Logout */
  logout: () => api.post("/logout") as AxiosPromise,

  /** Fetch current logged-in user data */
  current: () => api.get("/users/current") as AxiosPromise<User>,

  /** Update current logged-in user data */
  updateCurrent: (data: UserIn) => api.put("/users/current", data) as AxiosPromise<User, UserIn>,

  /** Update current logged-in user avatar */
  updateCurrentAvatar: (file: File) =>
    api.postForm("/users/current/avatar", { upload_file: file }) as AxiosPromise<User>,

  /** Generate and update current user avatar */
  generateAvatar: () => api.post("/users/current/generate_avatar") as AxiosPromise<User>,

  /** Get a user data by id */
  getById: (userId: number) => api.get(`/users/${userId}`) as AxiosPromise<User>,

  /** Get a user data by id (cached) */
  getUserData: async (userId: number) => {
    const cachedRequest = userDataCache.get(userId);
    if (cachedRequest) {
      return (await cachedRequest).data;
    }
    const request = UserApi.getById(userId);
    userDataCache.set(userId, request);
    return (await request).data;
  },

  /** Clear user data cache */
  clearUserDataCache: () => {
    userDataCache.clear();
  },
};

export const TodoApi = {
  /**
   * Get all users todos
   *
   * @param params - Paginations params
   */
  getAll: (params?: PageSortParams) => api.get("/todos/", { params }) as AxiosPromise<Todo[]>,
  /** Create a new todo, returns created todo document */
  create: (data: TodoIn) => api.post("/todos", data) as AxiosPromise<Todo, TodoIn>,
  /** Get a todo by ID */
  getById: (todoId: number) => api.get(`/todos/${todoId}`) as AxiosPromise<Todo>,
  /** Update a todo by ID */
  update: (todoId: number, data: TodoIn) =>
    api.put(`/todos/${todoId}`, data) as AxiosPromise<Todo, TodoIn>,
  /** Deleta a todo by ID */
  delete: (todoId: number) => api.delete(`/todos/${todoId}`) as AxiosPromise<DeleteStatus>,
};

export const RoomApi = {
  /**
   * Get all public rooms
   *
   * @param params - Paginations params
   */
  getAll: (params?: PageSortParams) => api.get("/rooms/", { params }) as AxiosPromise<Room[]>,
  /** Create a new public room */
  create: (data: RoomIn) => api.post("/rooms/", data) as AxiosPromise<Room, RoomIn>,
  /** Create a public room by ID */
  getById: (roomId: number) => api.get(`/rooms/${roomId}`) as AxiosPromise<Room>,
  /**
   * Connect to a room websocket
   *
   * The room websocket allow send / receive new messages & connect / disconnect events
   */
  newWebsocket: (roomId: number) => new WebSocket(`${getWebSocketBaseUrl()}/rooms/${roomId}`),
};

export interface MessageGetAllParams extends PageSortParams {
  room_id: number;
}

export const MessageApi = {
  /**
   * Get all message from a room
   *
   * @param params Room id & pagination & sorting params
   */
  getAll: (params?: MessageGetAllParams) =>
    api.get("/messages/", { params }) as AxiosPromise<Message[]>,
  /** Post new message to a room */
  create: (data: MessageIn) => api.post("/messages/", data) as AxiosPromise<Message, MessageIn>,
  /** Get a message by ID */
  getById: (messageId: number) => api.get(`/messages/${messageId}`) as AxiosPromise<Message>,
};

/**
 * In case of 422 Validation Error, format error response for react-hook-form
 *
 * @param err - AxiosResponseError or AxiosRequestError
 */
export function getFormErrors<TFieldValues extends FieldValues = FieldValues>(
  err: unknown,
): FormErrors<TFieldValues> {
  const response = (err as AxiosError)?.response;
  const request = (err as AxiosError)?.request;
  if (response == null) {
    if (request == null)
      return { root: { message: "Something went wrong!" } } as FormErrors<TFieldValues>;
    else return { root: { message: "Server is unreachable!" } } as FormErrors<TFieldValues>;
  }
  if (response.status == 422) {
    const errors = {} as FormErrors<TFieldValues>;
    const detail = (response as AxiosResponse<HTTPValidationError>).data?.detail ?? [];
    for (const { loc, msg, type } of detail) {
      errors[loc.join(".") as SetErrorName<TFieldValues>] = { message: msg, type };
    }
    return errors;
  } else if (
    400 <= response.status &&
    response.status < 500 &&
    (response.data as DefaultErrorResponse)?.detail
  ) {
    return {
      root: { message: "" + (response.data as DefaultErrorResponse)?.detail },
    } as FormErrors<TFieldValues>;
  }
  return {} as FormErrors<TFieldValues>;
}

/**
 * In case of 422 Validation Error, format and set errors in react-hook-form
 *
 * @param err - AxiosResponseError or AxiosRequestError
 * @param setError - React-hook-form setError function
 * @param defaultError - Default error message, if no error found in response
 */
export const setFormErrors = <TFieldValues extends FieldValues = FieldValues>(
  err: unknown,
  setError: UseFormSetError<TFieldValues>,
  defaultError?: string,
) => {
  const errors = getFormErrors<TFieldValues>(err);
  if (errors) {
    for (const key in errors) {
      setError(key as SetErrorName<TFieldValues>, errors[key as SetErrorName<TFieldValues>]);
    }
  } else if (defaultError) {
    setError("root", { message: defaultError });
  }
};

export default api;
