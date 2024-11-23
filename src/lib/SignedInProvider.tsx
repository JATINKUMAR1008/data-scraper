import { verifySession } from "./sessions";

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const session = verifySession();
  if (!session) {
    return null;
  }
  return <>{children}</>;
};
