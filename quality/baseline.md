# Quality Baseline

## Purpose

This file is the initial quality baseline for the project. It is intentionally concise and versioned so future AI agents and CI jobs can understand what quality gates exist and what the current expectations are.

## Quality Gate

Required local/MR command:

```bash
pnpm quality:gate
```

This runs:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm coverage`
5. `pnpm duplication`
6. `pnpm unused`

## Manual Mutation Testing

Mutation testing is intentionally manual because it can be slow:

```bash
pnpm quality:mutation
```

The current mutation thresholds are permissive and exist to generate a starting report, not to block development.

## Current Baseline Intent

The first baseline is not intended to enforce high coverage or low complexity immediately. It is intended to make regressions visible and create a repeatable quality gate.

Latest local baseline run:

- Date: `2026-05-07`
- Command: `pnpm quality:gate`
- Result: passed
- Test files: `3`
- Tests: `10`
- Coverage statements: `27.1%`
- Coverage branches: `21.16%`
- Coverage functions: `27.34%`
- Coverage lines: `27.44%`

Initial thresholds are permissive:

- Coverage thresholds: `0`
- jscpd duplication threshold: `100`
- Stryker mutation break threshold: `0`
- Sonar cognitive complexity: warning at `15`

Future improvements should ratchet these values upward after reports stabilize.

## Fixture

Current binary fixture:

```text
tests/fixtures/1570391280390.bin
```

Known expected properties:

- model: `miband4`
- image count: `58`
- image `0`: `120 x 240`, `32 bpp`, `pixelFormat 0x10`

The fixture may be replaced later, but tests should keep validating roundtrip fidelity:

- same image count
- same dimensions
- same `bitsPerPixel`
- same `pixelFormat`
- image `0` alpha remains visible after export

## GitHub Actions

The workflow is prepared at:

```text
.github/workflows/quality.yml
```

It runs `pnpm quality:gate` on pull requests and pushes to `main`.

## Notes

- The vendored `watchface-js` source is intentionally included in quality analysis, except generated/legacy areas are excluded from some tools where noise is too high.
- shadcn generated UI components are excluded from the React fast refresh lint rule.
- `quality/reports` is ignored except `.gitkeep`; reports are local/CI artifacts, not baseline source.
