import type { WatchImage } from "@/types/watchface"

export function imageToDataUrl(image: WatchImage): string {
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Canvas 2D context is not available")
  }

  const imageData = context.createImageData(image.width, image.height)
  imageData.data.set(image.pixels)
  context.putImageData(imageData, 0, 0)

  return canvas.toDataURL("image/png")
}

export async function imageToBitmap(image: WatchImage): Promise<ImageBitmap> {
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Canvas 2D context is not available")
  }

  const imageData = context.createImageData(image.width, image.height)
  imageData.data.set(image.pixels)

  return createImageBitmap(imageData)
}
