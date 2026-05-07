import { useMemo, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ImageStrip } from "@/components/editor/ImageStrip"
import { JsonEditor } from "@/components/editor/JsonEditor"
import { PreviewCanvas } from "@/components/editor/PreviewCanvas"
import { Toolbar } from "@/components/editor/Toolbar"
import { downloadBlob, readFileAsArrayBuffer } from "@/lib/file"
import {
  buildBin,
  listWatchModels,
  parseBinDocument,
  parseParametersJson,
  toErrorMessage,
} from "@/lib/watchface"
import type { WatchParameters, WatchfaceDocument } from "@/types/watchface"

function App() {
  const models = useMemo(() => listWatchModels(), [])
  const [selectedModelId, setSelectedModelId] = useState(models[0]?.id ?? "")
  const [document, setDocument] = useState<WatchfaceDocument | null>(null)
  const [parametersJson, setParametersJson] = useState("{}")
  const [parameters, setParameters] = useState<WatchParameters>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedModel =
    models.find((model) => model.id === selectedModelId) ?? models[0]

  async function handleOpenBin(file: File) {
    if (!selectedModel) {
      setErrorMessage("Select a watch model before opening a .bin file")
      return
    }

    try {
      const buffer = await readFileAsArrayBuffer(file)
      const nextDocument = parseBinDocument(file.name, buffer, selectedModel)
      setDocument(nextDocument)
      setParameters(nextDocument.parameters)
      setParametersJson(nextDocument.parametersJson)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(toErrorMessage(error))
    }
  }

  function handleJsonChange(value: string) {
    setParametersJson(value)
    try {
      setParameters(parseParametersJson(value))
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(toErrorMessage(error))
    }
  }

  function handleExportBin() {
    if (!document || !selectedModel) {
      return
    }

    try {
      const bin = buildBin(parameters, document.images, selectedModel)
      const name = document.fileName.replace(/\.bin$/i, "") || "watchface"
      downloadBlob(bin, "application/octet-stream", `${name}.edited.bin`)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(toErrorMessage(error))
    }
  }

  function handleModelChange(modelId: string) {
    setSelectedModelId(modelId)
    setDocument(null)
    setParameters({})
    setParametersJson("{}")
    setErrorMessage(null)
  }

  if (!selectedModel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <Alert variant="destructive" className="max-w-xl">
          <AlertCircle />
          <AlertTitle>No watch models available</AlertTitle>
          <AlertDescription>
            The vendored watchface library did not expose any supported models.
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  return (
    <main className="flex h-screen min-h-0 flex-col bg-background text-foreground">
      <Toolbar
        models={models}
        selectedModelId={selectedModel.id}
        fileName={document?.fileName}
        canExport={Boolean(document)}
        onModelChange={handleModelChange}
        onOpenBin={handleOpenBin}
        onExportBin={handleExportBin}
      />

      {errorMessage ? (
        <div className="border-b p-3">
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Editor error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <PreviewCanvas
          model={selectedModel}
          parameters={parameters}
          images={document?.images ?? []}
          onError={setErrorMessage}
        />
        <JsonEditor value={parametersJson} onChange={handleJsonChange} />
      </div>

      <ImageStrip images={document?.images ?? []} model={selectedModel} />
    </main>
  )
}

export default App
