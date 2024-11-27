"use client";
import { publishWorkflow } from "@/actions/workflows/publishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

export const PublishBtn = ({ workflowId }: { workflowId: number }) => {
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: "flow-publish" });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Something went wrong", { id: "flow-publish" });
    },
  });
  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Publishing workflow...", { id: "flow-publish" });
        mutation.mutate({
          id: workflowId.toString(),
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
};
