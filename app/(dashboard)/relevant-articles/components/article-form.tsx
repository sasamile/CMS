"use client"

import { Article } from "@prisma/client"
import ArticlePreview from "./article-preview"

interface ArticleFormProps {
  initialData: Article[] | null
  selectedItem: string
}

export function ArticleForm({ initialData, selectedItem }: ArticleFormProps) {
  const sectionData = initialData
    ? initialData.find((info) => info.title === selectedItem)
    : null

  return (
    <div>
      <ArticlePreview data={sectionData} />
    </div>
  )
}
