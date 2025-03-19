"use client";

import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { CustomDialogHeader } from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { RemoveSchedule } from "@/actions/workflows/removeSchedule";
import { Separator } from "@/components/ui/separator";

export default function SchedulerDialog(props: {
  workflowId: string;
  cron: string | null;
}) {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");
  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Workflow scheduled successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Failed to schedule workflow", { id: "cron" });
    },
  });

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveSchedule,
    onSuccess: () => {
      toast.success("Workflow schedule removed successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Failed to remove workflow schedule", { id: "cron" });
    },
  });
  useEffect(() => {
    try {
      parser.parse(cron);
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readabelSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {validCron ? (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readabelSavedCron}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="size-3 mr-1" /> Set Schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC.
          </p>
          <Input
            placeholder="* * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm",
              validCron
                ? "border-primary text-primary"
                : "border-destructive text-destructive"
            )}
          >
            {validCron ? readableCron : "Invalid cron expression"}
          </div>
        </div>
        {workflowHasValidCron && (
          <DialogClose asChild>
            <div className="px-8">
              <Button
                className="w-full text-destructive border-destructive hover:text-destructive"
                variant={"outline"}
                disabled={
                  removeScheduleMutation.isPending || mutation.isPending
                }
                onClick={() => {
                  toast.loading("Removing schedule...", { id: "cron" });
                  removeScheduleMutation.mutate(props.workflowId);
                }}
              >
                Remove current schedule
              </Button>
              <Separator className="my-4" />
            </div>
          </DialogClose>
        )}
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              onClick={() => {
                toast.loading("saving...", { id: "cron" });
                mutation.mutate({ id: props.workflowId, cron });
              }}
              disabled={mutation.isPending || !validCron}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
