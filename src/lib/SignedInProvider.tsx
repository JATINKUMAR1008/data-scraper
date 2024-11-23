import { requireAuth, verifySession } from "./sessions";

export const SignedIn = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireAuth();
  if (!session) {
    return null;
  }
  return <>{children}</>;
};
