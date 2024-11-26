import { UserApi, setFormErrors } from "@/common/api";
import useUser from "@/common/useUser";
import Button from "@/components/Button";
import InputError from "@/components/InputError";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

export interface SignInProps {
  /** Callback on successful login */
  readonly onLogin: () => void;
}

export default function SignIn({ onLogin }: SignInProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
  });
  const user = useUser();
  const [, setLocation] = useLocation();

  // If already signed in, redirect to homepage
  useEffect(() => {
    if (user != null) setLocation("/");
  }, [setLocation, user]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await UserApi.login(data);
      console.log("login ok");
      onLogin();
    } catch (err) {
      console.log("login err", err);
      setFormErrors(err, setError, "Something went wrong!");
    }
  });
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center space-y-24 bg-neutral-100 p-8 dark:bg-neutral-900">
      <h1 className="text-8xl text-purple-500 dark:text-purple-500">chatrooms.</h1>
      <div className="space-y-4 rounded border border-purple-200 bg-neutral-50 p-8 shadow-2xl shadow-purple-300/50 dark:bg-neutral-950">
        <h2>Sign In</h2>
        <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
          <InputError error={errors.root} />
          <fieldset className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
            <label className="text-right" htmlFor="username">
              Username
            </label>
            <input {...register("username")} id="username" required type="text" />
            <InputError dense error={errors.username} />
            <label className="text-right" htmlFor="password">
              Password
            </label>
            <input {...register("password")} id="password" required type="password" />
            <InputError dense error={errors.password} />
          </fieldset>
          <Button className="self-end text-xl" type="submit" variant="filled">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
