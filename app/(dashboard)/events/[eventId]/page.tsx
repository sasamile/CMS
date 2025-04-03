import { db } from "@/lib/db";
import { Heading } from "@/components/common/heading";
import { EventForm } from "../components/event-form";
import { columns, EventCommentsColumn } from "./components/columns";
import { DataTable } from "@/components/common/data-table";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      comments: true,
    },
  });

  let commentsFormatted: EventCommentsColumn[] = [];

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
        <EventForm initialData={event} />
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
