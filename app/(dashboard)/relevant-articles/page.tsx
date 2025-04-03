import ApiList from "@/components/common/api-list";
import { Heading } from "@/components/common/heading";
import React from "react";
import { RelevantArticleClient } from "./components/relevant-article-client";
import { db } from "@/lib/db";

export default async function RelevantArticlesPage() {
  const articleInfo = await db.article.findMany();
  const selectItems = articleInfo.map((item) => item.title);

  return (
    <div className="space-y-12">
      <RelevantArticleClient
        initialData={articleInfo}
        selectItems={[...selectItems, "Crear"]}
      />
      <Heading
        title="API"
        description="Llamadas a la API para la sección articulos relevantes"
      />
      <ApiList entityName="relevant-articles" entityIdName="articleId" />
    </div>
  );
}
