"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SpecialEventCommentsColumn = {
  id: string
  name: string
  comment: string
}

export const columns: ColumnDef<SpecialEventCommentsColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "comment",
    header: "Comentario",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction commentData={row.original} />,
  },
]
