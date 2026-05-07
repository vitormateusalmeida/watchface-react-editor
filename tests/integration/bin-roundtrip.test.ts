import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { buildBin, listWatchModels, parseBinDocument } from "@/lib/watchface"
import type { WatchModelDescriptor } from "@/types/watchface"

const fixturePath = "tests/fixtures/1570391280390.bin"

function readFixture(): ArrayBuffer {
  const buffer = readFileSync(fixturePath)
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

function parseWithAnyModel(fileName: string, buffer: ArrayBuffer) {
  const errors: string[] = []

  for (const model of listWatchModels()) {
    try {
      return parseBinDocument(fileName, buffer, model)
    } catch (error) {
      errors.push(`${model.id}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  throw new Error(`No model could parse fixture:\n${errors.join("\n")}`)
}

describe("bin roundtrip", () => {
  it("exports a parseable bin preserving image metadata for the fixture", () => {
    const originalBuffer = readFixture()
    const original = parseWithAnyModel("1570391280390.bin", originalBuffer)
    const exported = buildBin(original.parameters, original.images, original.model)
    const reparsed = parseBinDocument(
      "1570391280390.edited.bin",
      exported.buffer.slice(exported.byteOffset, exported.byteOffset + exported.byteLength),
      original.model,
    )

    expect(reparsed.images).toHaveLength(original.images.length)

    for (const [index, image] of original.images.entries()) {
      const nextImage = reparsed.images[index]
      expect(nextImage.width).toBe(image.width)
      expect(nextImage.height).toBe(image.height)
      expect(nextImage.bitsPerPixel).toBe(image.bitsPerPixel)
      expect(nextImage.pixelFormat).toBe(image.pixelFormat)
    }
  })

  it("keeps image zero opaque after export", () => {
    const original = parseWithAnyModel("1570391280390.bin", readFixture())
    const exported = buildBin(original.parameters, original.images, original.model)
    const reparsed = parseBinDocument(
      "1570391280390.edited.bin",
      exported.buffer.slice(exported.byteOffset, exported.byteOffset + exported.byteLength),
      original.model,
    )
    const image = reparsed.images[0]
    const alphaValues = Array.from({ length: image.width * image.height }, (_, index) => {
      return image.pixels[index * 4 + 3]
    })

    expect(image.width).toBe(120)
    expect(image.height).toBe(240)
    expect(image.bitsPerPixel).toBe(32)
    expect(image.pixelFormat).toBe(0x10)
    expect(Math.max(...alphaValues)).toBeGreaterThan(0)
  })

  it("documents the fixture model", () => {
    const document = parseWithAnyModel("1570391280390.bin", readFixture())
    const model = document.model as WatchModelDescriptor

    expect(model.id).toBe("miband4")
    expect(document.images).toHaveLength(58)
  })
})
