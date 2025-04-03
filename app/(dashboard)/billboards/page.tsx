import { db } from "@/lib/db"
import { BillboardColumn, columns } from "./components/columns"
import { format } from "date-fns"
import { DataTable } from "@/components/common/data-table"
import { Heading } from "@/components/common/heading"
import ApiList from "@/components/common/api-list"
import { Header } from "@/components/common/header"

export default async function BillboardPage() {
  const billboards = await db.billboard.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedBillboard: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    image: billboard.image!,
    title: billboard.title!,
    description: billboard.description!,
    buttonLabel: billboard.buttonLabel!,
    createdAt: format(billboard.createdAt, "MMM do, yyyy")!,
  }))

  return (
    <div className="space-y-12">
      <Header
        title={`Carteles Publicitario (${billboards.length})`}
        description="Modifica el contenido que aparecerá en el slider del encabezado"
        buttonHref="/billboards/new"
      />
      <DataTable
        searchKey="title"
        columns={columns}
        data={formattedBillboard}
      />
      <Heading
        title="API"
        description="Llamadas a la API para carteles publicitarios"
      />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </div>
  )
}
