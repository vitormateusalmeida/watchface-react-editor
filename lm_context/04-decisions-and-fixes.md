# Decisions And Fixes

## shadcn Setup

The project uses:

- shadcn/ui
- Radix component library
- Vega preset
- Neutral base color
- CSS variables enabled

Installed components include:

```text
button
card
select
textarea
scroll-area
separator
badge
alert
sheet
tabs
tooltip
input
label
```

## TypeScript 6 baseUrl Issue

TypeScript 6 warned that `baseUrl` is deprecated.

Decision:

- Remove `baseUrl`.
- Keep `paths`.
- Keep Vite runtime alias in `vite.config.ts`.

## tsBuildInfoFile Permission Issue

Initial Vite config wrote `.tsbuildinfo` under:

```text
node_modules/.tmp
```

This caused sandbox permission issues.

Changed to:

```json
"tsBuildInfoFile": "./.tmp/tsconfig.app.tsbuildinfo"
"tsBuildInfoFile": "./.tmp/tsconfig.node.tsbuildinfo"
```

## ESLint shadcn Compatibility

The shadcn generated components export variants/constants alongside components.

This tripped:

```text
react-refresh/only-export-components
```

Decision:

- Disable that rule only for `src/components/ui/**/*.{ts,tsx}`.

## UI Fixes

### Image Strip Horizontal Scroll

Problem:

- Images were listed in a horizontal row, but not all were reachable.

Fix:

- Import `ScrollBar`.
- Add `ScrollBar orientation="horizontal"`.
- Use `w-max` on the row.

### Thumbnail Scaling

Problem:

- Small images displayed at real size and were hard to inspect.

Fix:

- Card width increased.
- Thumbnail area increased.
- Image uses `h-full w-full object-contain`.
- Added `image-rendering: pixelated`.

This affects only display, not exported image data.

## Model Signature Error

Error encountered:

```text
Invalid file signature, expected 85,73,72,72 but found 72,77,68,73
```

Meaning:

- Expected ASCII `UIHH`.
- Found ASCII `HMDI`.
- User had selected the wrong model/format in dropdown.

Future improvement:

- Auto-detect signature and try compatible models automatically.

## Export bpp Issue

Problem:

- Export changed image bpp, e.g. `32 -> 24` and `16 -> 8`.

Cause:

- Original writer optimized/re-encoded images instead of preserving source metadata.

Fix:

- Preserve `bitsPerPixel` and `pixelFormat` where possible.

## Transparent Image 0 Issue

Problem:

- Image 0 existed after export but appeared transparent in the front-end.

Cause:

- Writer for `32 bpp / pixelFormat 0x10` wrote alpha directly.
- Parser expects inverted alpha for that format.

Fix:

- Invert alpha when writing normal 32 bpp format.
