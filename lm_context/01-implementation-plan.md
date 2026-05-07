# Implementation Plan

## Confirmed Choices

- Project name: `watchface-react-editor`
- Framework: React + TypeScript + Vite
- Package manager: pnpm
- UI: shadcn/ui
- Component library: Radix
- Styling: Tailwind CSS
- Watchface engine: copy/adapt `watchface-js` into the project

## Plan

1. Create a clean Vite React TypeScript app.
2. Configure pnpm, Tailwind CSS v4, shadcn/ui and aliases.
3. Vendor `watchface-js` under `src/vendor/watchface-js`.
4. Remove vendored `node_modules`.
5. Install runtime dependency needed by the vendored lib:
   - `pngjs`
6. Keep the vendored lib in JavaScript initially.
7. Create TypeScript wrappers and app-level types around the JS library.
8. Build the editor MVP:
   - model selector
   - open `.bin`
   - parse parameters/images
   - JSON editor
   - canvas preview
   - image strip/list
   - export `.bin`
9. Fix export fidelity issues in the vendored library.
10. Validate with:
   - `pnpm exec tsc -b`
   - `pnpm run build`
   - `pnpm run lint`

## Migration Strategy For watchface-js

Do not rewrite the whole library to TypeScript at once.

Chosen approach:

1. Use vendored JS and typed wrappers first.
2. Make the app functional.
3. Add tests/diagnostics around parser/export behavior.
4. Gradually migrate critical modules to TypeScript:
   - `watchFaceBinParser.js`
   - `imageParser.js`
   - `previewGenerator.js`
   - `parametersParser.js`
   - `tgaReaderWriter.js`

Reason: the library includes binary parsing/writing logic. A full rewrite before the app works would raise the risk of binary compatibility regressions.
