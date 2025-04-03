"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SpecialEventsColumn = {
  id: string
  title: string
  description: string
  address: string
  startDate: string
  endDate: string
  createdAt: string
}

export const columns: ColumnDef<SpecialEventsColumn>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "address",
    header: "Ubicación",
  },
  {
    accessorKey: "startDate",
    header: "Fecha de inicio",
  },
  {
    accessorKey: "endDate",
    header: "Fecha de fin",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction eventData={row.original} />,
  },
]
