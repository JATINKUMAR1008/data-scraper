"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { createOrg } from "./actions";
import { useFormStatus } from "react-dom";

export const OrgForm = () => {
  const [state, action] = useActionState(createOrg, undefined);
  return (
    <form className="flex flex-col gap-2" action={action}>
      <Label htmlFor="orgName" className="text-muted-foreground text-xs">
        Organization Name
      </Label>
      <Input
        type="text"
        id="orgName"
        name="orgName"
        placeholder="Enter your organization name"
        className="rounded-sm text-xs max-h-[2.25rem]"
      />
      {state?.error?.orgName && (
        <p className="text-xs text-red-300">{state.error.orgName}</p>
      )}
      {state?.message && (
        <div className="text-red-300 text-xs font-extralight text-center">
          {state.message}
        </div>
      )}
      <SubmitButton />
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      aria-disabled={pending}
      type="submit"
      className="mt-5 text-xs bg-muted py-2 px-3 rounded-md hover:bg-background transition-colors duration-150 border "
    >
      {pending ? "Submitting ...." : "Create Organization"}
    </button>
  );
};
