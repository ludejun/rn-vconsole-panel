# Changelog

All notable changes to this project are documented here. Versions follow
[Semantic Versioning](https://semver.org/).

## Unreleased

### Fixed

- **The panel crashed as soon as it opened.** `index.tsx` used `Platform.OS`
  twice without importing `Platform` from react-native, so
  `ReferenceError: Platform is not defined` was thrown on render. Because `tsc`
  only strips types, the published `lib/index.js` carried the same omission.
  The file's `// @ts-nocheck` is what kept the compiler quiet about it.
- `StorageBoard`'s `getItem` prop was typed `(key: string) => Promise<string> | null`.
  AsyncStorage resolves to `string | null`, so the signature said the wrong
  thing about the wrong value; it is now `Promise<string | null>`.
- `LogContent` used one interface as both its props and its state type, while
  the state is really a map of expanded/collapsed node ids. Props and state are
  now separate types, and toggling uses the functional `setState` form rather
  than reading `this.state` mid-update.

### Changed

- **`package.json` declared `"type": "lib/index.d.ts"`**, which is not a valid
  value for `type` — the key should have been `types`. The package therefore
  shipped no type entry point at all, despite being written in TypeScript.
  Fixed, and `exports` added alongside it.
- `files` now limits the tarball to `lib` and the docs. The published package
  drops from ~850 kB to a fraction of that; the rest was the screenshots in
  `examples/`.
- `@ts-nocheck` removed from all five files that carried it, `strict` turned on,
  and the 46 type errors that surfaced fixed.
- TypeScript 4.5 → 5.9. `@types/react-native` is dropped: React Native has
  shipped its own types since 0.71.
- The package uses pnpm.

### Added

- Ambient declarations for the React Native internals the network panel hooks
  into (`XHRInterceptor`, `FileReader`), which React Native ships untyped.
- ESLint 9 flat config with typescript-eslint, react and react-hooks, plus
  Prettier. 0 errors.
- Vitest, with 26 tests covering the utilities and a regression guard that fails
  if a react-native API is used without being imported, or if `@ts-nocheck`
  comes back.
- `CONTRIBUTING.md`, in English and Chinese.

## 1.0.3

- Add `readme_CN.md`.

## 1.0.2

- Storage panel: edit and delete individual entries.

## 1.0.1

- Rework the UI and the README.

## 1.0.0

- First release: Console, Network, Router stack, Storage and System panels.
