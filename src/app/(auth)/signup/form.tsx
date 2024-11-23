"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRightIcon } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUp } from "./action";

export const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  return (
    <form className="w-full grid grid-cols-2 gap-3" action={action}>
      <div className="flex flex-col col-span-1 gap-1.5">
        <Label htmlFor="firstName" className="text-muted-foreground text-xs">
          First Name
        </Label>
        <Input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="Enter your first name"
          className="rounded-sm text-xs max-h-[2.25rem]"
          aria-invalid={!!state?.error?.firstName}
        />
        {state?.error?.firstName && (
          <p className="text-sm text-red-300">{state.error.firstName}</p>
        )}
      </div>
      <div className="flex flex-col col-span-1 gap-1.5">
        <Label htmlFor="lastName" className="text-muted-foreground text-xs">
          Last Name
        </Label>
        <Input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Enter your last name"
          className="rounded-sm text-xs max-h-[2.25rem]"
          aria-invalid={!!state?.error?.lastName}
        />
        {state?.error?.lastName && (
          <p className="text-sm text-red-300">{state.error.lastName}</p>
        )}
      </div>
      <div className="col-span-2 flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-muted-foreground text-xs">
          Email Address
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          className="rounded-sm text-xs max-h-[2.25rem]"
          aria-invalid={!!state?.error?.email}
        />
        {state?.error?.email && (
          <p className="text-sm text-red-300">{state.error.email}</p>
        )}
      </div>
      <div className="col-span-2 flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-muted-foreground text-xs">
          Password
        </Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          className="rounded-sm text-xs max-h-[2.25rem] invalid:border-red-500 invalid:ring-offset-red-500"
          aria-invalid={!!state?.error?.password}
        />
        {state?.error?.password &&
          state.error.password.map((err: string, index: number) => (
            <p key={index} className="text-xs text-red-300">
              {err}
            </p>
          ))}
      </div>
      {state?.message && (
        <p className="text-xs text-red-300">{state.message}</p>
      )}
      <div className="col-span-2 w-full">
        <SubmitButton />
      </div>
    </form>
  );
};

const SubmitButton = () => {
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
          Create account <ChevronRightIcon className="size-3" />
        </>
      )}
    </button>
  );
};
