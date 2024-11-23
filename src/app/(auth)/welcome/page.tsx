import { OrgForm } from "./form";

export default function WelcomePage() {
  return (
    <div className="mt-5 w-[450px] border rounded-lg shadow-lg py-10 px-8">
      <div className="flex flex-col items-center">
        <h1 className="text-sm font-normal">Welcome to Scraper</h1>
        <p className="mt-2 text-muted-foreground text-xs text-thin">
          Start setting up your account by creating your organization
        </p>
        <div className="w-full mt-5">
          <OrgForm />
        </div>
      </div>
    </div>
  );
}
