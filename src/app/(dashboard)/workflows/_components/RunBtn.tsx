import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

export const RunBtn = ({ workflowId }: { workflowId: number }) => {
  const mutation = useMutation({
    mutationFn: RunWorkFlow,
    onSuccess: () => {
      toast.success("Workflow Started", { id: workflowId });
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling run ... ", { id: workflowId });
        mutation.mutate({
            workflowId
        })
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
};
