import {
  getAvailableModels,
  parseWatchFaceBin,
  writeWatchFaceBin,
} from "@/vendor/watchface-js/src/watchFaceBinTools/watchFaceBinParser"
import { generatePreview } from "@/vendor/watchface-js/src/watchFaceBinTools/previewGenerator"
import type {
  PreviewElement,
  PreviewStatus,
  WatchImage,
  WatchModelDescriptor,
  WatchParameters,
  WatchfaceDocument,
} from "@/types/watchface"

const defaultPreviewStatus: PreviewStatus = {
  hours: 12,
  minutes: 6,
  seconds: 34,
  steps: 12882,
  stepsPercent: 67,
  calories: 3453,
  caloriesPercent: 20,
  pulse: 123,
  heartPercent: 43,
  distance: 14.6,
  pai: 156,
  year: 2021,
  month: 3,
  day: 23,
  pm: true,
  weekday: 4,
  weather: 5,
  currentTemperature: 26,
  dayTemperature: 43,
  nightTemperature: -10,
  humidity: 98,
  wind: 12,
  uvi: 10,
  doNotDisturb: true,
  lock: false,
  bluetooth: false,
  batteryPercent: 64,
  alarmHours: 6,
  alarmMinutes: 0,
  alarmOnOff: true,
  animationTime: 0,
  locale: {
    lang: "EN",
    imperial: false,
    time24h: true,
  },
}

export function listWatchModels(): WatchModelDescriptor[] {
  return getAvailableModels()
}

export function parseBinDocument(
  fileName: string,
  buffer: ArrayBuffer,
  model: WatchModelDescriptor,
): WatchfaceDocument {
  const { parameters, images } = parseWatchFaceBin(buffer, model.fileType)

  return {
    fileName,
    model,
    parameters,
    parametersJson: JSON.stringify(parameters, null, 2),
    images,
  }
}

export function parseParametersJson(json: string): WatchParameters {
  const parsed = JSON.parse(json)
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Parameters JSON must be an object")
  }
  return parsed as WatchParameters
}

export function buildBin(
  parameters: WatchParameters,
  images: WatchImage[],
  model: WatchModelDescriptor,
): Uint8Array {
  return writeWatchFaceBin(parameters, images, model.fileType)
}

export function buildPreviewElements(
  parameters: WatchParameters,
  images: WatchImage[],
  model: WatchModelDescriptor,
  status: PreviewStatus = defaultPreviewStatus,
): PreviewElement[] {
  return generatePreview(parameters, images, status, model)
}

export function getImageCountOffset(model: WatchModelDescriptor): number {
  return model.fileType.imageCountOffset ?? 0
}

export function displayImageId(index: number, model: WatchModelDescriptor): number {
  return index + getImageCountOffset(model)
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "Unexpected error"
}
