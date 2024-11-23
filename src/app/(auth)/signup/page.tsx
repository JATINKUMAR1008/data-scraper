import { redirect } from "next/navigation";
import { signInByGoogle } from "../signin/action";
import { GoogleButton } from "../signin/googleButton";
import { SignUpForm } from "./form";
import Link from "next/link";

export default function SignUpPage() {
  const handleGoogleSignIn = async () => {
    "use server";
    const url = await signInByGoogle();
    redirect(url);
  };
  return (
    <div className="mt-5 w-[400px] border shadow-md rounded-lg px-8 py-10">
      <div className=" flex flex-col items-center">
        <h1 className="text-md font-semibold">Create you account</h1>
        <p className="text-xs text-muted-foreground mt-2">
          Create you free account, to get started with
        </p>
        <form action={handleGoogleSignIn} className="w-full">
          <GoogleButton />
        </form>
        <div className="flex items-center gap-2 justify-center my-7 w-full">
          <span className="border-b w-full"></span>
          <span className="text-muted-foreground text-xs">or</span>
          <span className="border-b w-full"></span>
        </div>
        <div className="w-full">{/* <LoginForm /> */}
            <SignUpForm/>
        </div>
      </div>
      <div className="text-center w-full mt-5">
        <p className="text-muted-foreground text-xs">
          Already have an account?{" "}
          <Link href="signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <footer className="text-muted-foreground text-xs text-center mt-5">
        <p>&copy; 2024 Scraper. All rights reserved.</p>
      </footer>
    </div>
  );
}
