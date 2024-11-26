"use client";

import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useExecutionPlan } from "@/hooks/executionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
export const ExecuteBtn = ({ workflowId }: { workflowId: number }) => {
  const router = useRouter();
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: RunWorkFlow,
    onSuccess: () => {},
    onError: (err) => {
      if (err instanceof Error && err instanceof isRedirectError) {
        console.error(err);
        toast.error("Something went wrong", {
          id: "flow-execution",
        });
      }
      toast.success("Workflow execution started", { id: "flow-execution" });
    },
  });
  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          return;
        }

        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
      className="flex items-center gap-2"
    >
      <PlayIcon size={16} className="stroke-orage-400" />
      Execute
    </Button>
  );
};
