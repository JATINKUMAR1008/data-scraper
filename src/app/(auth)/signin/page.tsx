import { LoginForm } from "./form";
import { signInByGoogle } from "./action";
import { redirect } from "next/navigation";
import { GoogleButton } from "./googleButton";
import Link from "next/link";

export default function SingInPage() {
  const handleGoogleSignIn = async () => {
    "use server";
    const url = await signInByGoogle();
    redirect(url);
  };
  return (
    <div className="mt-5 w-[400px] border shadow-md rounded-lg px-8 py-10">
      <div className=" flex flex-col items-center">
        <h1 className="text-md font-semibold">Sign in to Scraper</h1>
        <p className="text-xs text-muted-foreground mt-2">
          Welcome back! Please sign in to continue
        </p>
        <form action={handleGoogleSignIn} className="w-full">
          <GoogleButton />
        </form>
        <div className="flex items-center gap-2 justify-center my-7 w-full">
          <span className="border-b w-full"></span>
          <span className="text-muted-foreground text-xs">or</span>
          <span className="border-b w-full"></span>
        </div>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
      <div className="text-center w-full mt-5">
        <p className="text-muted-foreground text-xs">
          Don&apos;t have an account?{" "}
          <Link href="signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      <footer className="text-muted-foreground text-xs text-center mt-5">
        <p>&copy; 2024 Scraper. All rights reserved.</p>
      </footer>
    </div>
  );
}
