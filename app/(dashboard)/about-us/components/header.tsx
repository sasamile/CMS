import { Heading } from "@/components/common/heading";

export function Header() {
  return (
    <div className="flex items-center justify-between">
      <Heading
        title="Información 'Sobre Nosotros'"
        description="Visualiza y modifica la información sobre CACTO"
      />
      {/* <Button onClick={() => router.push("/billboards/new")}>
        <Plus className="size-4 mr-2" />
        Agregar nuevo
      </Button> */}
    </div>
  )
}
