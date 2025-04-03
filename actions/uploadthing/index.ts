"use server"

import { FileEsque, UploadFileResult } from "uploadthing/types"
import { utapi } from "./uploadthing"
import { formatUrl } from "@/utils/url-formatter"

export async function uploadImages(formData: FormData) {
  try {
    const imageFiles = formData
      .getAll("images")
      .filter((value) => value) as FileEsque[]

    const response = await utapi.uploadFiles(imageFiles)

    const successFiles = response
      .filter((res) => res.data && res.data.url)
      .map((res) => {
        return {
          url: res.data?.url as string,
          name: res.data?.name as string,
          size: res.data?.size as number,
        }
      })

    return { success: true, imageUrls: successFiles }
  } catch (error: any) {
    console.log(error)
    return { error: "Error uploading images" }
  }
}

export async function uploadAudio(formData: FormData) {
  try {
    const files = formData
      .getAll("audio")
      .filter((value) => value) as FileEsque[]
    const audioFile = files[0]

    const response: UploadFileResult = await utapi.uploadFiles(audioFile)

    if (response.data) {
      return { success: true, audioUrl: response.data.url }
    }

    return { success: false, audioUrl: null }
  } catch (error) {
    return { success: false, audioUrl: null }
  }
}

export async function uploadImage(formData: FormData) {
  try {
    const files = formData
      .getAll("image")
      .filter((value) => value) as FileEsque[]
    const imageFile = files[0]

    const response: UploadFileResult = await utapi.uploadFiles(imageFile)

    if (response.data) {
      return { success: true, imageUrl: response.data.url }
    }

    return { success: false, imageUrl: null }
  } catch (error) {
    return { success: false, imageUrl: null }
  }
}

export async function deleteFile(fileUrl: string) {
  try {
    const formatedUrl = formatUrl(fileUrl)
    const response = await utapi.deleteFiles(formatedUrl)
    return response.success
  } catch (error) {
    console.log("Error al eliminar la imagen")
  }
}

export async function deleteFiles(fileUrls: string[]) {
  try {
    console.log(fileUrls)
    const formatedUrls = fileUrls.map(fileUrl => formatUrl(fileUrl))
    const response = await utapi.deleteFiles(formatedUrls)
    return response.success
  } catch (error) {
    console.log("Error al eliminar la imagen")
  }
}
