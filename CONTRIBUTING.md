# Contributing · 贡献指南

English | [中文](#中文)

Thanks for taking the time to contribute. Issues and pull requests are both welcome.

## "I don't have permission to push"

You don't need it, and you shouldn't ask for it. **Nobody outside the project can push a branch to
this repository** — that is how GitHub works for every public repo, not a restriction set up here.
Push to _your own_ fork and open a pull request from it:

```bash
# 1. Fork the repo on GitHub (the "Fork" button, top right)

# 2. Clone YOUR fork, not this one
git clone https://github.com/<your-username>/rn-vconsole-panel.git
cd rn-vconsole-panel

# 3. Point "upstream" at this repo so you can stay in sync
git remote add upstream https://github.com/ludejun/rn-vconsole-panel.git

# 4. Branch, commit, push to your fork
git checkout -b fix/some-bug
git commit -am "fix: describe what changed"
git push origin fix/some-bug

# 5. Open the pull request from your fork's branch against ludejun/master
```

Or with the [GitHub CLI](https://cli.github.com/):

```bash
gh repo fork ludejun/rn-vconsole-panel --clone
cd rn-vconsole-panel
git checkout -b fix/some-bug
# ...edit, commit...
gh pr create --repo ludejun/rn-vconsole-panel
```

Two things that look like a permission problem but aren't:

- **The checks on your PR sit there greyed out.** For a first-time contributor, GitHub Actions waits
  for a maintainer to click "Approve and run".
- **`git push` to `ludejun/…` returns 403.** Expected — push to your fork's remote.

## Development setup

This project uses [pnpm](https://pnpm.io/) and needs Node >= 18.

```bash
pnpm install
pnpm build
```

There is no example app in this repo. The practical way to try a change is to build and link it into
a React Native app of your own:

```bash
pnpm build
# in your app
pnpm add file:../rn-vconsole-panel
```

## Before you open the pull request

Please make sure all four pass — CI runs exactly these:

```bash
pnpm lint        # eslint, must report 0 errors
pnpm typecheck   # tsc --noEmit, must report 0 errors
pnpm test        # vitest
pnpm build       # emits lib/ and the declarations
```

## Two rules worth knowing

Both exist because of bugs this package actually shipped:

1. **Never add `@ts-nocheck` or `@ts-ignore`.** Up to 1.0.3, `index.tsx` had `@ts-nocheck` at the
   top, which hid the fact that `Platform` was used but never imported — the panel threw
   `ReferenceError: Platform is not defined` the moment it opened, in the published package. A test
   fails if either comment reappears. If you genuinely need a suppression, use `@ts-expect-error` on
   the single line, with a comment saying why.

2. **Import everything you use from `react-native`.** A test checks each source file for react-native
   APIs used without a matching import, for the same reason. `tsc` only strips types; it will not
   add an import for you.

## A few conventions

- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/):
  `fix:`, `feat:`, `docs:`, `chore:`, `refactor:`, `test:`.
- **Both READMEs.** If a change affects the documented API, update `readme.md` _and_ `readme_CN.md`.
- **The panels read from `global.$BOARD_LOGGER`**, which is typed in `globals.d.ts`. That buffer is
  heterogeneous, so narrow it in the board that owns the slot rather than loosening the global type.

## Reporting a bug

Open an [issue](https://github.com/ludejun/rn-vconsole-panel/issues) with:

- the package version, React Native version, and whether it is iOS or Android,
- the props you passed `<RNConsole />`,
- what you expected and what happened instead,
- the error and stack trace, if there is one.

---

<a id="中文"></a>

# 中文

感谢你愿意花时间参与。Issue 和 Pull Request 都非常欢迎。

## “我没有权限提交代码”

你不需要这个权限，也不用来要。**项目之外的任何人都无法直接往本仓库推送分支** —— 这是 GitHub 对所有公开仓库的默认行为，不是本项目做了什么限制。推到**你自己的 fork**，再从 fork 发起 Pull Request：

```bash
# 1. 在 GitHub 页面右上角点 "Fork"

# 2. clone 你自己的 fork，不是这个仓库
git clone https://github.com/<你的用户名>/rn-vconsole-panel.git
cd rn-vconsole-panel

# 3. 把 upstream 指向本仓库，方便后续同步
git remote add upstream https://github.com/ludejun/rn-vconsole-panel.git

# 4. 建分支、提交、推到你自己的 fork
git checkout -b fix/some-bug
git commit -am "fix: 描述你改了什么"
git push origin fix/some-bug

# 5. 从你 fork 的这个分支，向 ludejun/master 发起 Pull Request
```

也可以用 [GitHub CLI](https://cli.github.com/)：

```bash
gh repo fork ludejun/rn-vconsole-panel --clone
cd rn-vconsole-panel
git checkout -b fix/some-bug
# ...改代码、提交...
gh pr create --repo ludejun/rn-vconsole-panel
```

有两种情况看着像“没权限”，其实不是：

- **PR 上的 CI 检查一直灰着不跑。** 首次贡献者的 workflow 需要维护者点一下 “Approve and run”。
- **`git push` 到 `ludejun/…` 返回 403。** 这是预期行为，推到你自己 fork 的 remote 就好。

## 本地开发

本项目使用 [pnpm](https://pnpm.io/)，需要 Node >= 18。

```bash
pnpm install
pnpm build
```

仓库里没有示例 App。验证改动最实际的办法是构建后 link 进你自己的 RN 项目：

```bash
pnpm build
# 在你的 App 里
pnpm add file:../rn-vconsole-panel
```

## 提 PR 之前

请确认这四条全部通过 —— CI 跑的就是这四条：

```bash
pnpm lint        # eslint，必须 0 error
pnpm typecheck   # tsc --noEmit，必须 0 error
pnpm test        # 运行 vitest
pnpm build       # 产出 lib/ 和类型声明
```

## 两条值得一提的规则

这两条都是因为这个包真的出过对应的 bug：

1. **不要加 `@ts-nocheck` 或 `@ts-ignore`。** 1.0.3 之前，`index.tsx` 顶部有一行 `@ts-nocheck`，把「`Platform` 用了但从没 import」这件事完全盖住了 —— 已发布的包里，面板一打开就抛 `ReferenceError: Platform is not defined`。现在有测试守着，这两个注释一旦回来就会失败。确实需要压制某一行的话，用 `@ts-expect-error` 并写明原因。

2. **用到的 `react-native` API 必须 import。** 出于同样的原因，有测试会逐个文件检查「用了但没导入」的 react-native API。`tsc` 只剥类型，不会替你补 import。

## 一些约定

- **提交信息**遵循 [Conventional Commits](https://www.conventionalcommits.org/)：`fix:`、`feat:`、`docs:`、`chore:`、`refactor:`、`test:`。
- **两份 README。** 如果改动影响了对外 API，请同时更新 `readme.md` 和 `readme_CN.md`。
- **各面板从 `global.$BOARD_LOGGER` 读数据**，它的类型在 `globals.d.ts` 里。这个缓冲区本身是异构的，请在拥有该槽位的面板里做窄化，而不是把全局类型放松。

## 反馈 Bug

到 [Issues](https://github.com/ludejun/rn-vconsole-panel/issues) 提一条，请带上：

- 包版本、React Native 版本，以及是 iOS 还是 Android，
- 你传给 `<RNConsole />` 的 props，
- 你期望的行为，以及实际发生了什么，
- 如果有报错，附上错误信息和堆栈。
