export type WatchImage = {
  pixels: Uint8Array | Uint8ClampedArray
  width: number
  height: number
  bitsPerPixel?: number
  pixelFormat?: number
  name?: string
}

type FileTypeDescriptor = {
  imageCountOffset?: number
  [key: string]: unknown
}

export type WatchModelDescriptor = {
  id: string
  name: string
  screen: {
    width: number
    height: number
    roundedBorder: number
  }
  fileType: FileTypeDescriptor
  [key: string]: unknown
}

export type WatchParameters = Record<string, unknown>

type PreviewPosition = {
  x: number
  y: number
}

export type PreviewElement = {
  imageId?: number
  canvas?: HTMLCanvasElement
  position: PreviewPosition
}

export type WatchfaceDocument = {
  fileName: string
  model: WatchModelDescriptor
  parameters: WatchParameters
  parametersJson: string
  images: WatchImage[]
}

export type PreviewStatus = {
  hours: number
  minutes: number
  seconds: number
  steps: number
  stepsPercent: number
  calories: number
  caloriesPercent: number
  pulse: number
  heartPercent: number
  distance: number
  pai: number
  year: number
  month: number
  day: number
  pm: boolean
  weekday: number
  weather: number
  currentTemperature: number
  dayTemperature: number
  nightTemperature: number
  humidity: number
  wind: number
  uvi: number
  doNotDisturb: boolean
  lock: boolean
  bluetooth: boolean
  batteryPercent: number
  alarmHours: number
  alarmMinutes: number
  alarmOnOff: boolean
  animationTime: number
  locale: {
    lang: "EN" | "CN" | "CN2"
    imperial: boolean
    time24h?: boolean
  }
}
