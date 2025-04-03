"use client"

import { AboutUs } from "@prisma/client"
import AboutUsPreview from "./about-us-preview"

interface AboutUsFormProps {
  initialData: AboutUs[] | null
  selectedItem: string
}

export function AboutUsForm({ initialData, selectedItem }: AboutUsFormProps) {
  const sectionData = initialData
    ? initialData.find((info) => info.title === selectedItem)
    : null

  return (
    <div>
      <AboutUsPreview data={sectionData} />
    </div>
  )
}
