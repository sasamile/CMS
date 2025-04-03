"use client";

import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { NewTestimonialForm } from "./new-testimonial-form";

export function NewTestimonialTrigger() {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Nuevo testimonio"
        descripion=""
        isOpen={open}
        onClose={closeDialog}
      >
        <NewTestimonialForm closeModal={closeDialog} />
      </Modal>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Nuevo testimonio
      </Button>
    </>
  );
}
