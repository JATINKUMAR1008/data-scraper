import { getWorkflowsForUser } from "@/actions/workflows/getWorkflows";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { waitForDebugger } from "@/lib/helpers/waitFor";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateWorkflowDialog } from "./_components/CreateWorkflowDialog";
import { WorkFlowCard } from "./_components/WorkflowCard";

export default function WorkflowsPage() {
  return (
    <div className="flex flex-1 flex-col h-full mt-5">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog triggerText="Create Workflow" />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkFlows />
        </Suspense>
      </div>
    </div>
  );
}
function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

async function UserWorkFlows() {
  const workflows = await getWorkflowsForUser();
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center">
        <div className="rounded-full bg-accent size-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    );
  }
  return(<>
  <div className="grid grid-cols-1 gap-4">
    {workflows.map((workflow) => (
      <WorkFlowCard key={workflow.id} workflow={workflow} />
    ))} 
  </div>
  </> );
}