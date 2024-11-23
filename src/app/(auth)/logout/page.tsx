import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function Logout() {
  return (
    <div className="flex flex-col items-center w-[450px] mt-2.5 space-y-2">
      <h1 className="text-white text-2xl font-semibold">
        Successfully Logged Out
      </h1>
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-center text-green-800">
          You have been safely logged out of your account.
          <br />
          Thank you for using our service!
        </AlertDescription>
      </Alert>
      <p className="text-center text-xs text-muted-foreground">
        For security reasons, please close your browser if you&apos;re on a
        public computer.
      </p>
      <div className="flex flex-col space-y-3 w-full mt-5">
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Go to Home
        </Link>
        <Link
          className={buttonVariants({
            variant: "default",
          })}
          href="/signin"
        >
          Sign in again
        </Link>
      </div>
    </div>
  );
}
