# Current Status

## Implemented

- React/Vite/TypeScript app scaffolded with pnpm.
- shadcn/ui configured.
- `watchface-js` vendored under `src/vendor/watchface-js`.
- TypeScript wrapper and app types created.
- MVP editor implemented:
  - model select
  - open `.bin`
  - parse images and parameters
  - JSON editor
  - preview canvas
  - image strip/list
  - export `.bin`
  - error reporting
- Export now preserves common image bpp/pixel formats.
- 32 bpp alpha roundtrip fixed.
- Image strip scroll and thumbnail scaling improved.

## Validation Commands

Known passing commands after latest changes:

```bash
pnpm run build
```

Previously also passed:

```bash
pnpm run lint
pnpm exec tsc -b
```

If running from Codex, commands that write in `~/personal_projects` may require elevated permission due sandbox limits.

## Test File Mentioned By User

Original:

```text
~/Downloads/1570391280390.bin
```

Exported:

```text
~/Downloads/1570391280390.edited (1).bin
```

Diagnostic showed both had:

- `58` images
- image `0`: `120 x 240`, `32 bpp`, `pixelFormat 0x10`

## Recommended Next Steps

1. Add automatic model detection by `.bin` signature:
   - `UIHH`
   - `HMDI/HMDIAL`
2. Add a diagnostics panel or CLI script:
   - image count
   - bpp/pixelFormat per image
   - largest images
   - JSON image references out of range
3. Add image replacement feature:
   - replace single image
   - preserve original bpp/pixelFormat by default
   - optionally allow re-encode
4. Add roundtrip tests:
   - parse original
   - export without edits
   - parse exported
   - compare image metadata and parameter references
5. Gradually migrate vendored JS modules to TypeScript.
6. Remove unused Vite template assets/CSS once UI is stable.

## Notes For Future Agents

- Do not overwrite vendored parser fixes without reviewing `imageParser.js` and `watchFaceBinParser.js`.
- Preserve binary fidelity over optimization.
- Avoid changing image bpp unless the user explicitly asks.
- The image strip thumbnail scaling is visual only and must not affect exported image data.
- The app currently uses source files from the vendored library, not the vendored `dist`.
