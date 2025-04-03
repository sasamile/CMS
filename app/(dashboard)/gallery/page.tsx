import ApiList from "@/components/common/api-list";
import { Header } from "@/components/common/header";
import { Heading } from "@/components/common/heading";
import React from "react";
import ImageGallery from "./components/image-gallery";
import { db } from "@/lib/db";

export default async function Gallery() {
  const gallery = await db.gallery.findMany()

  const galleryFormatted: string[] = gallery.map((image) => image.imageUrl)

  return (
    <div className="space-y-12">
      <Header
        title="Galería"
        description="Gestiona de forma fácil la galería de imagenes de CATO"
        hideButton
      />

      <ImageGallery galleryData={galleryFormatted} />

      <Heading title="API" description="Llamadas a la API para la galería" />
      <ApiList entityName="gallery" entityIdName="imageId" />
    </div>
  );
}
