import { db } from "@/lib/db";
import { Header } from "@/components/common/header";
import { columns, TestimonialsColumn } from "./components/columns";
import { DataTable } from "@/components/common/data-table";
import { NewTestimonialTrigger } from "./components/new-testimonial-trigger";
import { Heading } from "@/components/common/heading";
import ApiList from "@/components/common/api-list";

export default async function TestimonialPage() {
  const testimonials = await db.testimonials.findMany();

  const formattedTestomonials: TestimonialsColumn[] = testimonials.map(
    (testimonial) => ({
      id: testimonial.id,
      image: testimonial.imageUrl,
      name: testimonial.name,
      position: testimonial.position,
      content: testimonial.content,
    })
  );

  return (
    <div className="space-y-12">
      <div className="flex max-sm:flex-col sm:items-center sm:justify-between gap-4">
        <Header
          title={`Testimonials (${testimonials.length})`}
          description="Agrega nuevos, edita los existentes o elimina aquellos que ya no sean relevantes."
          hideButton
        />
        <NewTestimonialTrigger />
      </div>
      <DataTable
        searchKey="name"
        columns={columns}
        data={formattedTestomonials}
      />
      <Heading title="API" description="Llamadas a la API para los testimonios" />
      <ApiList entityName="testimonials" entityIdName="testimonialId" />
    </div>
  );
}
