"use client";

import { deleteCredential } from "@/actions/credentials/deleteCredential";
import { deleteWorkFlow } from "@/actions/workflows/deleteWorkFlow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface Props {
  credentialName: string;
  credentialId: number;
}
export const DeleteCredentialDialog = ({
  credentialName,
  credentialId,
}: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      toast.success("Crdential deleted", { id: credentialId });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Failed to delete credential", { id: credentialId });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <XIcon size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              If you delete this credential, you will not be able to recover it.
              <div className="flex flex-col py-4 gap-2">
                <p>
                  If you are sure, enter <b>{credentialName}</b> to confirm:
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={
              confirmText !== credentialName || deleteMutation.isPending
            }
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting credential", { id: credentialId });
              deleteMutation.mutate(credentialId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
