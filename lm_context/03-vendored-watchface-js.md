# Vendored watchface-js

## Location

```text
src/vendor/watchface-js
```

Copied from:

```text
/Users/vitor.almeida/Downloads/mib4wf/watchface-web-editor/node_modules/watchface-js
```

Vendored `node_modules` was removed. Project-level dependency `pngjs` was installed with pnpm.

## App Imports

The app imports the vendored library source modules:

```ts
import {
  getAvailableModels,
  parseWatchFaceBin,
  writeWatchFaceBin,
} from "@/vendor/watchface-js/src/watchFaceBinTools/watchFaceBinParser"

import { generatePreview } from "@/vendor/watchface-js/src/watchFaceBinTools/previewGenerator"
```

## Important Files

```text
src/vendor/watchface-js/src/watchFaceBinTools/watchFaceBinParser.js
src/vendor/watchface-js/src/watchFaceBinTools/imageParser.js
src/vendor/watchface-js/src/watchFaceBinTools/previewGenerator.js
src/vendor/watchface-js/src/watchFaceBinTools/parametersParser.js
```

## Current Local Fixes

### Preview Image Offset

`previewGenerator.js` was adjusted to validate image IDs with `imageCountOffset`.

Original issue:

- Preview validation compared image IDs directly with `images.length`.
- For formats with `imageCountOffset`, valid image IDs could be reported as out of range.

Current behavior:

- Compute `zeroBasedImageId = imageInfo.imageId - imageCountOffset`
- Validate against `0..images.length - 1`
- Error message now includes valid range.

### Export Preserves Image Format

`watchFaceBinParser.js` now imports:

```js
import { parseImage, writeImagePreserveFormat } from './imageParser'
```

and writes images with:

```js
const binaryImage = new Uint8Array(writeImagePreserveFormat(image))
```

instead of:

```js
writeImage(image.pixels, image.width, image.height)
```

Reason:

- Old writer tried 8 bpp indexed first and fell back to 24 bpp.
- This changed image bpp during roundtrip export.

### Added Image Writers

`imageParser.js` now has:

- `writeImagePreserveFormat(image)`
- `writeImage16Bits(...)`
- `writeImage24BitsWithFormat(...)`
- `writeImage32Bits(...)`
- `writeImage32BitsExtended(...)`

Fallback still uses old `writeImage(...)` if preservation is not supported.

### 32 bpp Alpha Fix

For normal `32 bpp` formats like `pixelFormat 0x10`, alpha must be inverted when writing because the parser inverts alpha when reading:

```js
pixels[..., 3] = 0xFF - alpha
```

Writer fix:

```js
dataView.setUint8(... + 3, 0xFF - pixels[i * 4 + 3])
```

For `pixelFormat 0xFFFF`, the extended parser does not invert alpha, so extended writer keeps alpha direct.

## Known Risk

The format preservation is pragmatic and tested through user workflow/build, but binary format coverage is still incomplete. Future work should add roundtrip tests comparing original/exported metadata per image.
