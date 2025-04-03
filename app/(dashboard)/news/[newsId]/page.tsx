import { db } from "@/lib/db";
import { NewsForm } from "../components/news-form";

export default async function IndividualNewsPage({
  params,
}: {
  params: { newsId: string };
}) {
  const { newsId } = params;

  const news = await db.news.findUnique({
    where: { id: newsId },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <NewsForm initialData={news} />
      </div>
    </div>
  );
}
