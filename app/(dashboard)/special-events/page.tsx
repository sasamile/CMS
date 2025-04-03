import { DataTable } from "@/components/common/data-table"
import { Header } from "@/components/common/header"
import { db } from "@/lib/db"
import { Heading } from "@/components/common/heading"
import ApiList from "@/components/common/api-list"
import { columns, SpecialEventsColumn } from "./components/columns"

export default async function SpecialEventsPage() {
  const events = await db.specialEvent.findMany()

  const formattedEvents: SpecialEventsColumn[] = events.map((event) => ({
    id: event.id,
    title: event.title!,
    description: event.description!,
    address: event.address,
    startDate: event.startDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })!,
    endDate: event.endDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })!,
    createdAt: event.createdAt.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })!,
  }))

  return (
    <div className="space-y-12">
      <Header
        title={`Eventos Especiales (${events.length})`}
        description="Agrega nuevos eventos o ajusta los detalles de los existentes fácilmente"
        buttonHref="/special-events/new"
      />
      <DataTable
        searchKey="title"
        columns={columns}
        data={formattedEvents}
      />
      <Heading
        title="API"
        description="Llamadas a la API para los eventos especiales"
      />
      <ApiList entityName="special-events" entityIdName="eventId" />
    </div>
  )
}
