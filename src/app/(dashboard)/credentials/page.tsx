import { getUserCredentials } from "@/actions/credentials/getUsercredentials";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateCredentialDialog } from "./_components/createCredentialDialog";
import { formatDistanceToNow } from "date-fns";
import { DeleteCredentialDialog } from "./_components/deleteCredentialDialog";

export default function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials here</p>
        </div>
        <CreateCredentialDialog />
      </div>
      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="size-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All the information you store in Eclipse is encrypted, ensuring your
            data remains safe.
          </AlertDescription>
        </Alert>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

async function UserCredentials() {
  const credentials = await getUserCredentials();
  if (!credentials) {
    return <div>Something went wrong</div>;
  }
  if (credentials.length === 0) {
    return (
      <Card className="p-4 w-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-accent size-20 flex items-center justify-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials found</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to add a new credential
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        });
        return (
          <Card key={credential.id} className="w-full p-4 flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-primary/10 size-8 flex items-center justify-center">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            <DeleteCredentialDialog
              credentialId={credential.id}
              credentialName={credential.name}
            />
          </Card>
        );
      })}
    </div>
  );
}
