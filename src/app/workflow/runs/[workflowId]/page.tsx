import { getExecutionsForWorkflow } from "@/actions/workflows/getExecutions";
import Topbar from "../../_components/topbar/Topbar";
import { Suspense } from "react";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionTable from "./_components/ExecutionTable";

export default function ExecutionPage({
  params,
}: {
  params: {
    workflowId: string;
  };
}) {
  return (
    <div className="w-full h-full overflow-auto">
      <Topbar
        workflowId={Number(params.workflowId)}
        hideButtons
        title="All runs"
        subTitle="List of all workflow runs"
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full">
            <Loader2Icon size={30} className="animate-spin" />
          </div>
        }
      >
        <ExecutionTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await getExecutionsForWorkflow(workflowId);
  if (!executions) {
    return <div>Workflow executions not found</div>;
  }
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center w-full h-full">
          <div className="rounded-full bg-accent size-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow.
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-6 w-full">
      <ExecutionTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
