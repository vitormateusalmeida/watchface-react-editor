# Watchface React Editor - Overview

## Goal

Build a modern React-based replacement for the original Svelte watchface web editor.

The app edits Huami/Xiaomi/Amazfit `.bin` watchface files:

- open a `.bin`
- parse parameters and image resources
- show a live preview
- show editable JSON parameters
- list embedded images
- export a new `.bin`

The new project intentionally vendors/adapts `watchface-js` instead of depending on it as an npm package, so parser/export behavior can be fixed locally.

## Project Location

```text
/Users/vitor.almeida/personal_projects/watchface-react-editor
```

## Stack

- React
- TypeScript
- Vite
- pnpm
- shadcn/ui
- Radix preset
- Tailwind CSS v4
- lucide-react icons

## Important Constraint

The user requested that actions be shown and confirmed before execution. In later workflow, commands/edits were executed after menu confirmation.

## Source Project Used As Reference

Original deployed site:

```text
https://watchface-web-editor.vercel.app/
```

Original open-source project:

```text
https://github.com/Nadeflore/watchface-web-editor
```

Copied local reference:

```text
/Users/vitor.almeida/Downloads/mib4wf/watchface-web-editor
```

Vendored library source:

```text
src/vendor/watchface-js
```
