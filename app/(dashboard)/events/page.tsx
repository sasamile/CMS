import { DataTable } from "@/components/common/data-table"
import { Header } from "@/components/common/header"
import { db } from "@/lib/db"
import { Heading } from "@/components/common/heading"
import ApiList from "@/components/common/api-list"
import { columns, EventsColumn } from "./components/columns"

export default async function EventsPage() {
  const events = await db.event.findMany()

  const formattedEvents: EventsColumn[] = events.map((event) => ({
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
        title={`Eventos (${events.length})`}
        description="Agrega nuevos eventos o ajusta los detalles de los existentes fácilmente"
        buttonHref="/events/new"
      />
      <DataTable
        searchKey="title"
        columns={columns}
        data={formattedEvents}
      />
      <Heading
        title="API"
        description="Llamadas a la API para los eventos"
      />
      <ApiList entityName="events" entityIdName="eventId" />
    </div>
  )
}
