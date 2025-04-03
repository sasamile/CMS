"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertModal } from "@/components/common/alert-modal";
import { toast } from "sonner";
import { NewsColumn } from "./columns";
import { deleteNews } from "@/actions/news";

interface CellActionProps {
  newsData: NewsColumn;
}

export function CellAction({ newsData }: CellActionProps) {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();

  const handleConfirm = () => {
    const filesToDelete = [newsData.imageUrl];
    startTransition(async () => {
      try {
        const { success, error } = await deleteNews(newsData.id, filesToDelete);

        if (error) {
          toast.error(error);
        }

        if (success) {
          toast.success(success);
        }
      } catch {
        toast.error("Algo salió mal al eliminar la noticia.");
      } finally {
        setOpen(false);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/news/${newsData.id}`)}
          >
            <Edit className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className=" dark:hover:focus:bg-rose-400/20 hover:focus:bg-rose-400/20 text-rose-400 hover:focus:text-rose-400 dark:hover:focus:text-rose-400"
          >
            <Trash2 className="size-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
