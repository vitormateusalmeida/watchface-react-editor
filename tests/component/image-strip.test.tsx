import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ImageStrip } from "@/components/editor/ImageStrip"
import type { WatchImage, WatchModelDescriptor } from "@/types/watchface"

const model: WatchModelDescriptor = {
  id: "test",
  name: "Test",
  screen: { width: 120, height: 240, roundedBorder: 0 },
  fileType: {},
}

function image(width: number, height: number, bitsPerPixel = 16): WatchImage {
  return {
    width,
    height,
    bitsPerPixel,
    pixelFormat: 0x08,
    pixels: new Uint8ClampedArray(width * height * 4).fill(255),
  }
}

describe("ImageStrip", () => {
  it("renders an empty state", () => {
    render(<ImageStrip images={[]} model={model} />)

    expect(screen.getByText("Open a .bin file to inspect image resources.")).toBeInTheDocument()
  })

  it("renders image metadata", () => {
    render(<ImageStrip images={[image(2, 3), image(4, 5, 32)]} model={model} />)

    expect(screen.getByText("#0")).toBeInTheDocument()
    expect(screen.getByText("#1")).toBeInTheDocument()
    expect(screen.getByText("2 x 3")).toBeInTheDocument()
    expect(screen.getByText("4 x 5")).toBeInTheDocument()
    expect(screen.getByText("16 bpp")).toBeInTheDocument()
    expect(screen.getByText("32 bpp")).toBeInTheDocument()
  })
})
