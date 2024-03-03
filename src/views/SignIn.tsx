import { UserApi, setFormErrors } from "@/common/api";
import useUser from "@/common/useUser";
import Button from "@/components/Button";
import InputError from "@/components/InputError";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

export interface SignInProps {
  /** Callback on successful login */
  onLogin: () => void;
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
  React.useEffect(() => {
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
    <main className="flex h-screen w-full flex-col items-center justify-center space-y-4 p-8">
      <div className="space-y-8 rounded border border-purple-200 p-8 shadow-2xl shadow-purple-300/50">
        <h1 className="text-purple-700">Sign In</h1>
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <InputError error={errors.root} />
          <fieldset className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
            <label htmlFor="username" className="text-right">
              Username
            </label>
            <input {...register("username")} id="username" type="text" required />
            <InputError error={errors.username} dense />
            <label htmlFor="password" className="text-right">
              Password
            </label>
            <input {...register("password")} id="password" type="password" required />
            <InputError error={errors.password} dense />
          </fieldset>
          <Button variant="filled" type="submit" className="self-end text-xl">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
