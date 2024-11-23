"use client";

import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
interface SaveBtnProps {
  workflowId: number;
}
export const SaveBtn = ({ workflowId }: SaveBtnProps) => {
  const { toObject } = useReactFlow();
  const saveMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", {
        id: "workflow-saved",
      });
    },
    onError: () => {
      toast.error("Failed to save workflow", {
        id: "workflow-saved",
      });
    },
  });
  return (
    <Button
      variant={"outline"}
      disabled={saveMutation.isPending}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "workflow-saved" });
        saveMutation.mutate({ workflowId, definition: workflowDefinition });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
};
