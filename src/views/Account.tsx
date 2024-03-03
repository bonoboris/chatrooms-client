import { UserApi } from "@/common/api";
import useUser from "@/common/useUser";
import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import InputError from "@/components/InputError";
import UserAvatar from "@/components/UserAvatar";
import { type DefaultErrorResponse, type User } from "@/types/api";
import { type AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";

const DEFAULT_VALUES = {
  username: "",
  email: "",
};

type UserFormValues = typeof DEFAULT_VALUES;

export default function Account({ setUser }: { setUser: (user: User | null) => void }) {
  const user = useUser(true);
  const [avatarError, setAvatarError] = React.useState<string | undefined>();

  const defaultValues = React.useMemo(
    function () {
      return {
        username: user?.username ?? DEFAULT_VALUES.username,
        email: user?.email ?? DEFAULT_VALUES.email,
      };
    },
    [user],
  );

  const form = useForm<UserFormValues>({ defaultValues });

  const onUpdateUser = () => {
    UserApi.updateCurrent(form.getValues()).then((resp) => {
      setUser(resp.data);
    });
  };

  function onClickGenerate() {
    UserApi.generateAvatar().then((resp) => {
      setUser(resp.data);
    });
  }

  function onFileUpload(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (file == null) return;

    UserApi.updateCurrentAvatar(file)
      .then((resp) => {
        setUser(resp.data);
      })
      .catch((err) => {
        const error = (err as AxiosError<DefaultErrorResponse>)?.response?.data?.detail;
        if (error != null) setAvatarError(error);
      });
  }

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center space-y-8 p-8">
      <h1>
        <strong className="text-purple-500">{user?.username}</strong> Account
      </h1>
      <section className="container content-center items-center space-y-8 rounded border p-8">
        <div className="flex items-center space-y-4">
          <p className="flex-1">Avatar</p>
          <div className="flex flex-[4] flex-col items-center space-y-2">
            <UserAvatar user={user} className="h-64 w-64" />
            <InputError error={{ message: avatarError }} dense />
            <div className="space-x-2">
              <Button variant="outlined" className="text-lg" onClick={onClickGenerate}>
                Generate
              </Button>
              <FileInput
                className="btn btn-outlined text-lg"
                onChange={onFileUpload}
                accept="image/*"
              >
                Upload
              </FileInput>
            </div>
          </div>
        </div>

        <hr className="border-neutral-400 dark:border-neutral-600" />

        <form className="space-y-4" onSubmit={form.handleSubmit(onUpdateUser)}>
          <div className="flex space-x-4">
            <label htmlFor="username-input" className="mr-4 flex-1">
              Username
            </label>
            <input
              id="username-input"
              {...form.register("username")}
              type="text"
              className="flex-[4]"
            />
          </div>
          <div className="flex space-x-4">
            <label htmlFor="email-input" className="mr-4 flex-1">
              Email
            </label>
            <input id="email-input" {...form.register("email")} type="email" className="flex-[4]" />
          </div>
        </form>

        <hr className="border-neutral-400 dark:border-neutral-600" />

        <div className="space-y-4">
          <div className="flex space-x-4">
            <p className="flex-1">Account created</p>
            <p className="flex-[4]">
              {user?.created_at != null && new Date(user?.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
