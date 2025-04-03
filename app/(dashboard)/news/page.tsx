import { DataTable } from "@/components/common/data-table";
import { Header } from "@/components/common/header";
import { db } from "@/lib/db";
import { Heading } from "@/components/common/heading";
import ApiList from "@/components/common/api-list";
import { columns, NewsColumn } from "./components/columns";

export default async function NewsPage() {
  const news = await db.news.findMany();

  const formattedNews: NewsColumn[] = news.map((news) => ({
    id: news.id,
    title: news.title,
    description: news.description,
    imageUrl: news.imageUrl,
    link: news.link,
  }));

  return (
    <div className="space-y-12">
      <Header
        title={`Noticias (${news.length})`}
        description="Agrega nuevas noticias o ajusta los detalles de las existentes fácilmente"
        buttonHref="/news/new"
      />
      <DataTable searchKey="title" columns={columns} data={formattedNews} />
      <Heading title="API" description="Llamadas a la API para las noticias" />
      <ApiList entityName="news" entityIdName="newsId" />
    </div>
  );
}
