import { Download, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WatchModelDescriptor } from "@/types/watchface"

type ToolbarProps = {
  models: WatchModelDescriptor[]
  selectedModelId: string
  fileName?: string
  canExport: boolean
  onModelChange: (modelId: string) => void
  onOpenBin: (file: File) => void
  onExportBin: () => void
}

export function Toolbar({
  models,
  selectedModelId,
  fileName,
  canExport,
  onModelChange,
  onOpenBin,
  onExportBin,
}: ToolbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex min-w-0 items-center gap-2">
        <div className="mr-2 min-w-0">
          <div className="truncate text-sm font-medium">Watchface Editor</div>
          <div className="truncate text-xs text-muted-foreground">
            {fileName ?? "No .bin loaded"}
          </div>
        </div>

        <Select value={selectedModelId} onValueChange={onModelChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline">
          <label>
            <FolderOpen />
            Open .bin
            <input
              className="sr-only"
              type="file"
              accept=".bin"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                event.currentTarget.value = ""
                if (file) {
                  onOpenBin(file)
                }
              }}
            />
          </label>
        </Button>
        <Button disabled={!canExport} onClick={onExportBin}>
          <Download />
          Export .bin
        </Button>
      </div>
    </header>
  )
}
