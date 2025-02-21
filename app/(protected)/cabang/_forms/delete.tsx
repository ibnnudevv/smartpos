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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import React from "react";

const DeleteForm = ({
  label,
  message,
  description,
  onConfirm,
  buttonLabel = "Hapus",
}: {
  label: string;
  message: string;
  description: string;
  onConfirm: () => void;
  buttonLabel?: string;
}) => {
  return (
    <AlertDialog>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <AlertDialogTrigger>{label}</AlertDialogTrigger>
      </DropdownMenuItem>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{message}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction color="red" onClick={onConfirm}>
            {buttonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteForm;
