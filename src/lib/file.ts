export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}`))
    reader.onload = () => {
      if (!(reader.result instanceof ArrayBuffer)) {
        reject(new Error(`Unable to read ${file.name} as binary data`))
        return
      }
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

export function downloadBlob(
  data: Blob | BlobPart | ArrayBufferView<ArrayBufferLike>,
  mimeType: string,
  fileName: string,
) {
  const blobPart = ArrayBuffer.isView(data) ? copyViewToArrayBuffer(data) : data
  const blob = blobPart instanceof Blob ? blobPart : new Blob([blobPart], { type: mimeType })
  const href = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = href
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(href)
}

function copyViewToArrayBuffer(view: ArrayBufferView<ArrayBufferLike>): ArrayBuffer {
  const source = new Uint8Array(
    view.buffer as ArrayBuffer,
    view.byteOffset,
    view.byteLength,
  )
  const copy = new Uint8Array(source.byteLength)
  copy.set(source)
  return copy.buffer
}
