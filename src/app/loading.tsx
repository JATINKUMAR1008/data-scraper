import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Loader />
    </div>
  );
}

export const Loader = () => {
  return (
    <>
      <Loader2 size={20} className="animate-spin size-16" />
      <p className="text-xs text-muted-foreground mt-3">
        Please till we are processing your request.
      </p>
    </>
  );
};
