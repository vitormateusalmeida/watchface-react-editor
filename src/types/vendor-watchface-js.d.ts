declare module "@/vendor/watchface-js/src/watchFaceBinTools/watchFaceBinParser" {
  import type {
    FileTypeDescriptor,
    WatchImage,
    WatchModelDescriptor,
    WatchParameters,
  } from "@/types/watchface"

  export function getAvailableModels(): WatchModelDescriptor[]
  export function parseWatchFaceBin(
    buffer: ArrayBuffer,
    fileStructureInfo: FileTypeDescriptor,
  ): { parameters: WatchParameters; images: WatchImage[] }
  export function writeWatchFaceBin(
    parameters: WatchParameters,
    images: WatchImage[],
    fileStructureInfo: FileTypeDescriptor,
  ): Uint8Array
}

declare module "@/vendor/watchface-js/src/watchFaceBinTools/previewGenerator" {
  import type {
    PreviewElement,
    PreviewStatus,
    WatchImage,
    WatchModelDescriptor,
    WatchParameters,
  } from "@/types/watchface"

  export function generatePreview(
    parameters: WatchParameters,
    images: WatchImage[],
    status: PreviewStatus,
    watchModelDescriptor: WatchModelDescriptor,
  ): PreviewElement[]
}
