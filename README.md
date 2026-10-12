# Kaleiopi UI

Brand tokens and UI primitives for the [Kaleiopi](https://github.com/jdicasolo/kaleiopi) frontend, documented in Storybook.

React 19 · Tailwind CSS v4 · Storybook 10 · Node 20.19+

```sh
npm install
npm run storybook       # http://localhost:6007
npm run build           # dist/: ESM bundle, type declarations, theme.css
npm run tokens          # regenerate src/tokens/ from scripts/generate-tokens.mjs
```

## What's here

- **Foundations:** the seven brand colors from `kaleiopi/docs/brand-colors.md`, each with a generated 50–950 scale and WCAG contrast ratios.
- **Components:** Assistant, AssistantModal, Button, Input, Textarea, Select, PasswordInput, Field, Card, Badge, Alert, Modal, Avatar, AvatarStack, ProgressBar, StepIndicator, Logo.
- **Tables:** DataTable (TanStack Table: sorting, search, and a server mode with paging) and UserTable (the admin users list, built on DataTable). Build DataTable columns with `createDataTableColumns<Row>()`.

Each component is extracted from a pattern the app repeats inline today, recolored from Tailwind's `indigo` to the brand tokens.

## Using it in the app

Components ship as Tailwind class names, so the app's own Tailwind build styles them:

```css
@import 'tailwindcss';
@import 'kaleiopi-ui/theme.css';
@source '../node_modules/kaleiopi-ui/dist';
```
