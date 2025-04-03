"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { AlertModal } from "@/components/common/alert-modal";
import { toast } from "sonner";
import { TestimonialsColumn } from "./columns";
import Modal from "@/components/common/modal";
import { NewTestimonialForm } from "./new-testimonial-form";
import { deleteTestimonial } from "@/actions/testimonials";

interface CellActionProps {
  testimonialData: TestimonialsColumn;
}

export function CellAction({ testimonialData }: CellActionProps) {
  const [open, setOpen] = useState(false);
  const [openAlertConfirmation, setOpenAlertConfirmation] = useState(false);

  const [isLoading, startTransition] = useTransition();

  const closeDialog = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const { error, success } = await deleteTestimonial(testimonialData.id, testimonialData.image);

        if (error) {
          toast.error(error);
        }

        if (success) {
          toast.success(success);
          setOpenAlertConfirmation(false);
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
        isOpen={openAlertConfirmation}
        onClose={() => setOpenAlertConfirmation(false)}
        onConfirm={handleConfirm}
      />
      <Modal
        title="Editar testimonio"
        isOpen={open}
        onClose={closeDialog}
      >
        <NewTestimonialForm data={testimonialData} closeModal={closeDialog} />
      </Modal>

      <div className="flex items-center gap-1 w-full justify-end">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Edit strokeWidth={2.5} className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group hover:bg-red-500"
          onClick={() => setOpenAlertConfirmation(true)}
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
