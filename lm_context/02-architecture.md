# Architecture

## Main App Files

```text
src/App.tsx
src/main.tsx
src/index.css
```

## Editor Components

```text
src/components/editor/Toolbar.tsx
src/components/editor/PreviewCanvas.tsx
src/components/editor/JsonEditor.tsx
src/components/editor/ImageStrip.tsx
```

### Toolbar

Responsibilities:

- select watch model
- open `.bin`
- export `.bin`
- show current file name

### PreviewCanvas

Responsibilities:

- render preview using `buildPreviewElements`
- account for model screen dimensions
- account for `imageCountOffset`
- show black background
- report preview/render errors to app state

### JsonEditor

Responsibilities:

- edit parameters JSON
- propagate raw JSON changes
- app parses JSON and updates preview state

### ImageStrip

Responsibilities:

- show image resources
- show display image ID, dimensions and bpp
- use horizontal scroll
- enlarge thumbnails for small images
- use `image-rendering: pixelated` for legibility

## Lib Wrappers

```text
src/lib/watchface.ts
src/lib/file.ts
src/lib/image.ts
```

### watchface.ts

Wraps vendored `watchface-js`:

- `listWatchModels`
- `parseBinDocument`
- `parseParametersJson`
- `buildBin`
- `buildPreviewElements`
- `getImageCountOffset`
- `displayImageId`
- `toErrorMessage`

### file.ts

Helpers:

- read file as `ArrayBuffer`
- download binary blob

Includes workaround for TypeScript 6 stricter `ArrayBufferLike` vs `ArrayBuffer` typing.

### image.ts

Helpers:

- convert parsed watch image to PNG data URL
- convert parsed watch image to `ImageBitmap`

## Types

```text
src/types/watchface.ts
src/types/vendor-watchface-js.d.ts
```

`watchface.ts` defines app-level types:

- `WatchImage`
- `FileTypeDescriptor`
- `WatchModelDescriptor`
- `WatchParameters`
- `PreviewElement`
- `WatchfaceDocument`
- `PreviewStatus`

`vendor-watchface-js.d.ts` declares the JS modules imported from the vendored library.

## shadcn/ui

Components installed under:

```text
src/components/ui
```

The app is wrapped with `TooltipProvider` in `src/main.tsx`.
