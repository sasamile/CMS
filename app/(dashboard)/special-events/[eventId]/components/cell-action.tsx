"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { AlertModal } from "@/components/common/alert-modal";
import { toast } from "sonner";
import { SpecialEventCommentsColumn } from "./columns";
import { deleteSpecialEventComment } from "@/actions/special-event/comments";

interface CellActionProps {
  commentData: SpecialEventCommentsColumn;
}

export function CellAction({ commentData }: CellActionProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteSpecialEventComment(commentData.id);

        if (error) {
          toast.error(error);
        }

        if (success) {
          toast.success(success);
          setOpen(false);
        }
      } catch {
        toast.error("Algo salió mal al eliminar al usuario.");
      }
    });
  };

  return (
    <>
      <AlertModal
        isLoading={isLoading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
      <div className="flex items-center gap-1 w-full justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="group hover:bg-red-500"
          onClick={() => setOpen(true)}
        >
          <Trash2
            strokeWidth={2.5}
            className="size-5 text-red-400 group-hover:text-white"
          />
        </Button>
      </div>
    </>
  );
}
