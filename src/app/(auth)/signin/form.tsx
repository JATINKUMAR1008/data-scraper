"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRightIcon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "./action";
import { useActionState } from "react";

export function LoginForm() {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <div className="w-full">
      
      <form className="flex flex-col gap-5" action={action}>
        <div className="flex flex-col gap-1 ">
          <Label htmlFor="email" className="text-muted-foreground text-xs">
            Email Address
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            className="rounded-sm text-xs max-h-[2.25rem]"
          />
          {state?.error?.email && (
            <p className="text-sm text-red-500">{state.error.email}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <Label htmlFor="password" className="text-muted-foreground text-xs">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="rounded-sm text-xs max-h-[2.25rem]"
          />
          {state?.error?.password && (
            <p className="text-sm text-red-500">{state.error.password}</p>
          )}
        </div>
        {state?.message && (
          <div className="text-red-500 text-sm font-extralight text-center">
            {state.message}
          </div>
        )}
        <LoginButton />
      </form>
    </div>
  );
}

const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      aria-disabled={pending}
      type="submit"
      className="w-full bg-white mt-2 text-background p-2 rounded-sm text-sm flex hover:black/10 items-center hover:bg-muted-foreground  transition-colors duration-300 justify-center gap-1"
    >
      {pending ? (
        "Submitting ...."
      ) : (
        <>
          Sign in <ChevronRightIcon className="size-3" />
        </>
      )}
    </button>
  );
};
