import { db } from "@/lib/db"
import { BillboardForm } from "../components/billboard-form"

export default async function Billboard({
  params,
}: {
  params: { billboardId: string }
}) {
  const billboard = await db.billboard.findUnique({
    where: { id: params.billboardId },
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}
