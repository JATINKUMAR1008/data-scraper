"use client";
import { publishWorkflow } from "@/actions/workflows/publishWorkflow";
import { UnpublishWorkflow } from "@/actions/workflows/unPublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

export const UnPublishBtn = ({ workflowId }: { workflowId: number }) => {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: workflowId });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Publishing workflow...", { id: "flow-publish" });
        mutation.mutate(workflowId.toString());
      }}
    >
      <UploadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
};
