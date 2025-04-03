"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type BillboardColumn = {
  id: string
  image: string
  title: string
  description: string
  buttonLabel: string
  createdAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "image",
    header: () => <div className="text-left">Imagen</div>,
    cell: ({ row }) => {
      const imageSrc: string = row.getValue("image")

      return (
        <div className="">
          <div
            className="w-[160px] h-20 rounded-lg bg-red-50"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "50% 50%",
            }}
          />
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description: string = row.getValue("description")

      return (
        <>
          {!description ? (
            <span className="text-muted-foreground italic">
              Sin descripción
            </span>
          ) : (
            <p>{description}</p>
          )}
        </>
      )
    },
  },
  {
    accessorKey: "buttonLabel",
    header: "Botón",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction billboardData={row.original} />,
  },
]
