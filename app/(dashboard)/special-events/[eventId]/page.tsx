import { db } from "@/lib/db";
import { Heading } from "@/components/common/heading";
import { columns, SpecialEventCommentsColumn } from "./components/columns";
import { DataTable } from "@/components/common/data-table";
import { SpecialEventForm } from "../components/special-event-form";

export default async function SpecialEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = params;

  const event = await db.specialEvent.findUnique({
    where: { id: eventId },
    include: {
      comments: true,
    },
  });

  let commentsFormatted: SpecialEventCommentsColumn[] = [];

  if (event?.comments && event?.comments.length > 0) {
    commentsFormatted = event.comments.map((comment) => ({
      id: comment.id,
      name: comment.name,
      comment: comment.comment,
    }));
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <SpecialEventForm initialData={event} />
      </div>
      <div className="">
        <Heading
          title="Comentarios"
          description="Gestiona los comentarios del evento"
        />

        <DataTable
          searchKey="name"
          columns={columns}
          data={commentsFormatted}
        />
      </div>
    </div>
  );
}
