"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type TestimonialsColumn = {
  id: string
  image: string
  name: string
  position: string
  content: string
}

export const columns: ColumnDef<TestimonialsColumn>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => {
      const imageSrc: string = row.getValue("image")

      return (
        <div className="">
          <div
            className="size-16 rounded-full bg-red-50"
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
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "position",
    header: "Cargo",
  },
  {
    accessorKey: "content",
    header: "Testimonio",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction testimonialData={row.original} />,
  },
]
