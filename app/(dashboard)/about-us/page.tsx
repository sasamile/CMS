import { db } from "@/lib/db";
import { AboutUsClient } from "./components/about-us-client";
import { Heading } from "@/components/common/heading";
import ApiList from "@/components/common/api-list";

export default async function AboutUsPage() {
  const aboutUsInfo = await db.aboutUs.findMany()
  const selectItems = aboutUsInfo.map((item) => item.title)

  return (
    <div className="space-y-12">
      <AboutUsClient initialData={aboutUsInfo} selectItems={[...selectItems, "Crear"]} />
      <Heading
        title="API"
        description="Llamadas a la API para la sección informativa"
      />
      <ApiList entityName="about-us" entityIdName="aboutUsId" />
    </div>
  )
}
