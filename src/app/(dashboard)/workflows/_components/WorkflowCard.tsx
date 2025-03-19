"use client";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workflow } from "@/db/schema/workflows";
import { cn } from "@/lib/utils";
import {
  ExecutionStatus,
  WorkflowExecutionPhase,
  WorkflowStatus,
} from "@/types/workflow";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRight,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteWorkflowDialog } from "./DeleteWorkfloeDialog";
import { RunBtn } from "./RunBtn";
import SchedulerDialog from "./SchedulerDialog";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator, {
  ExecutionStatusLabel,
} from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-green-500",
};

export type WorkFlowProps = Workflow & {
  id: number;
};

export const WorkFlowCard = ({ workflow }: { workflow: WorkFlowProps }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate rounded-lg overflow-hidden ">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow?.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft ? (
                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              ) : (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                  Published
                </span>
              )}
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditCost={workflow?.creditsCost!}
              workflowId={workflow?.id}
              cron={workflow?.cron!}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow?.id} />}
          <Link
            href={`/workflow/editor/${workflow?.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkFlowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
};

const WorkFlowActions = ({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: number;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <TooltipWrapper content={"more actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={16} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const ScheduleSection = ({
  isDraft,
  creditCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditCost: number;
  workflowId: number;
  cron: string | null;
}) => {
  if (isDraft) return null;
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="size-4 text-muted-foreground" />
      <SchedulerDialog
        workflowId={workflowId.toString()}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="size-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumed for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant={"outline"}
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="size-4" />
            <span className="text-sm">{creditCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
};

function LastRunDetails({ workflow }: { workflow: WorkFlowProps }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  if (isDraft) return null;
  const { lastRunAt, lastRunStatus, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
  const nextSchedule = nextRunAt && format(nextRunAt, "dd MMM, yyyy hh:mm a");
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "hh:mm");
  return (
    <div className="bg-primary/5 px-4 py-1 justify-between flex items-center text-muted-foreground">
      <div className="flex items-center gap-2 text-sm">
        {lastRunAt ? (
          <Link
            href={`/workflow/runs/${workflow.id}/${workflow.lastRunId}`}
            className="flex items-center gap-2 text-sm group"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as ExecutionStatus}
            />
            <ExecutionStatusLabel status={lastRunStatus as ExecutionStatus} />
            <span>{lastRunStatus}</span>
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon className="size-4 group-hover:translate-x-0 -translate-x-2 transition-all duration-300" />
          </Link>
        ) : (
          <p>No runs yet</p>
        )}
      </div>
      {workflow.nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">{nextScheduleUTC} UTC</span>
        </div>
      )}
    </div>
  );
}
