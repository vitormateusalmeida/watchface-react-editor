import { useEffect, useRef } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { imageToBitmap } from "@/lib/image"
import { buildPreviewElements, getImageCountOffset, toErrorMessage } from "@/lib/watchface"
import type { WatchImage, WatchModelDescriptor, WatchParameters } from "@/types/watchface"

type PreviewCanvasProps = {
  model: WatchModelDescriptor
  parameters: WatchParameters
  images: WatchImage[]
  onError: (message: string | null) => void
}

export function PreviewCanvas({
  model,
  parameters,
  images,
  onError,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    let cancelled = false
    const context = canvas.getContext("2d")
    if (!context) {
      onError("Canvas 2D context is not available")
      return
    }

    canvas.width = model.screen.width
    canvas.height = model.screen.height
    const ctx = context
    const targetCanvas = canvas

    async function renderPreview() {
      try {
        const offset = getImageCountOffset(model)
        const previewElements = buildPreviewElements(parameters, images, model)
        const bitmaps = await Promise.all(
          previewElements.map(async (element) => {
            if (element.canvas) {
              return {
                image: element.canvas,
                position: element.position,
              }
            }

            if (typeof element.imageId !== "number") {
              throw new Error("Preview element is missing image id")
            }

            const image = images[element.imageId - offset]
            if (!image) {
              throw new Error(
                `Image Id out of range: ${element.imageId}. Valid range is ${offset}-${images.length + offset - 1}`,
              )
            }

            return {
              image: await imageToBitmap(image),
              position: element.position,
            }
          }),
        )

        if (cancelled) {
          return
        }

        const radius = model.screen.roundedBorder
        ctx.save()
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.arcTo(targetCanvas.width, 0, targetCanvas.width, targetCanvas.height, radius)
        ctx.arcTo(targetCanvas.width, targetCanvas.height, 0, targetCanvas.height, radius)
        ctx.arcTo(0, targetCanvas.height, 0, 0, radius)
        ctx.arcTo(0, 0, targetCanvas.width, 0, radius)
        ctx.closePath()
        ctx.clip()
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height)

        for (const bitmap of bitmaps) {
          ctx.drawImage(bitmap.image, bitmap.position.x, bitmap.position.y)
        }
        ctx.restore()
        onError(null)
      } catch (error) {
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height)
        onError(toErrorMessage(error))
      }
    }

    void renderPreview()

    return () => {
      cancelled = true
    }
  }, [images, model, onError, parameters])

  return (
    <section className="flex min-h-0 w-[360px] shrink-0 flex-col bg-muted/30">
      <div className="flex h-10 shrink-0 items-center justify-between border-b px-3">
        <div className="text-sm font-medium">Preview</div>
        <div className="text-xs text-muted-foreground">
          {model.screen.width} x {model.screen.height}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        {images.length === 0 ? (
          <Alert>
            <AlertTitle>No file loaded</AlertTitle>
            <AlertDescription>
              Open a supported .bin watchface to render the preview.
            </AlertDescription>
          </Alert>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-h-full max-w-full rounded-md shadow-sm [image-rendering:auto]"
          />
        )}
      </div>
    </section>
  )
}
