"use client";

import { CustomDialogHeader } from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  createWorkFlowSchemaType,
  createWorkflowSchema,
} from "@/schemas/workflows";
import { ChevronRightIcon, Layers2Icon } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { createWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect";
export const CreateWorkflowDialog = ({
  triggerText,
}: {
  triggerText?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();
  const form = useForm<createWorkFlowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {},
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createWorkflow,
    // onSuccess: () => {
    //   toast.success("Workflow created", {
    //     id: "workflow-created",
    //   });
    // },
    // onError: (error) => {
    //   console.log(error);
    //   toast.error("Failed to create workflow", {
    //     id: "workflow-created",
    //   });
    // },
  });
  const onSubmit = useCallback(
    (values: createWorkFlowSchemaType) => {
      startTransition(() => {
        // toast.loading("Creating workflow .....", { id: "workflow-created" });
        mutate(values);
      });
      //   toast.dismiss("workflow-created");
    },
    [mutate]
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>{triggerText ?? "Create Workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create Workflow"
          subTitle="Start building your workflow."
        />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-red-300">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive name for your workflow.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what yourworkflow does.
                      <br /> This is optional bt can help you remember the
                      workflow&apos;s purpose.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <button
                aria-disabled={isPending}
                type="submit"
                className="w-full bg-primary mt-2 text-background p-2 rounded-sm text-sm flex hover:black/10 items-center hover:bg-primary/70  transition-colors duration-300 justify-center gap-1"
              >
                {isPending ? "Submitting ...." : <>Proceed</>}
              </button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
