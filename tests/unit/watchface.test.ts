import { describe, expect, it } from "vitest"
import {
  displayImageId,
  getImageCountOffset,
  listWatchModels,
  parseParametersJson,
  toErrorMessage,
} from "@/lib/watchface"

describe("watchface wrapper", () => {
  it("lists supported watch models", () => {
    const models = listWatchModels()

    expect(models.length).toBeGreaterThan(0)
    expect(models[0]).toHaveProperty("id")
    expect(models[0]).toHaveProperty("fileType")
  })

  it("parses parameter JSON objects", () => {
    expect(parseParametersJson('{"Background":{"ImageIndex":0}}')).toEqual({
      Background: { ImageIndex: 0 },
    })
  })

  it("rejects non-object parameter JSON", () => {
    expect(() => parseParametersJson("[]")).toThrow("Parameters JSON must be an object")
  })

  it("computes displayed image ids using image count offset", () => {
    const model = {
      id: "test",
      name: "Test",
      screen: { width: 1, height: 1, roundedBorder: 0 },
      fileType: { imageCountOffset: 1 },
    }

    expect(getImageCountOffset(model)).toBe(1)
    expect(displayImageId(0, model)).toBe(1)
  })

  it("normalizes unknown errors", () => {
    expect(toErrorMessage("bad")).toBe("bad")
    expect(toErrorMessage(new Error("broken"))).toBe("broken")
    expect(toErrorMessage({})).toBe("Unexpected error")
  })
})
