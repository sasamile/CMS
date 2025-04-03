"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type NewsColumn = {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
}

export const columns: ColumnDef<NewsColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: () => <div className="text-left">Imagen</div>,
    cell: ({ row }) => {
      const imageSrc: string = row.getValue("imageUrl")

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
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction newsData={row.original} />,
  },
]
