import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { imageToDataUrl } from "@/lib/image"
import { displayImageId } from "@/lib/watchface"
import type { WatchImage, WatchModelDescriptor } from "@/types/watchface"

type ImageStripProps = {
  images: WatchImage[]
  model: WatchModelDescriptor
}

export function ImageStrip({ images, model }: ImageStripProps) {
  const imageCards = useMemo(
    () =>
      images.map((image, index) => ({
        image,
        index,
        id: displayImageId(index, model),
        src: imageToDataUrl(image),
      })),
    [images, model],
  )

  return (
    <section className="h-52 shrink-0 border-t bg-background">
      <div className="flex h-10 items-center justify-between border-b px-3">
        <div className="text-sm font-medium">Images</div>
        <Badge variant="secondary">{images.length}</Badge>
      </div>

      <ScrollArea className="h-[calc(100%-2.5rem)]">
        <div className="flex w-max gap-3 p-3">
          {imageCards.length === 0 ? (
            <div className="flex h-28 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              Open a .bin file to inspect image resources.
            </div>
          ) : (
            imageCards.map(({ image, index, id, src }) => (
              <div
                key={`${id}-${index}`}
                className="flex w-36 shrink-0 flex-col overflow-hidden rounded-md border bg-card"
              >
                <div className="flex h-28 items-center justify-center bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0] p-2 dark:bg-[linear-gradient(45deg,#333_25%,transparent_25%),linear-gradient(-45deg,#333_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#333_75%),linear-gradient(-45deg,transparent_75%,#333_75%)]">
                  <img
                    className="h-full w-full object-contain [image-rendering:pixelated]"
                    src={src}
                    alt={`Image ${id}`}
                  />
                </div>
                <div className="space-y-1 p-2 text-xs">
                  <div className="font-medium">#{id}</div>
                  <div className="text-muted-foreground">
                    {image.width} x {image.height}
                  </div>
                  <div className="text-muted-foreground">
                    {image.bitsPerPixel ? `${image.bitsPerPixel} bpp` : "bpp unknown"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
