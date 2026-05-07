import { Textarea } from "@/components/ui/textarea"

type JsonEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col border-l">
      <div className="flex h-10 shrink-0 items-center border-b px-3 text-sm font-medium">
        Parameters JSON
      </div>
      <Textarea
        className="min-h-0 flex-1 resize-none rounded-none border-0 font-mono text-xs leading-relaxed shadow-none focus-visible:ring-0"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </section>
  )
}
