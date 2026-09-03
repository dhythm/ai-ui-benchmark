# AI の UI 比較ベンチマークリポジトリ

## 新規リポジトリ作成

```sh
pnpm dlx create-turbo@latest ai-ui-benchmark
```

## 新規アプリ作成

```sh
pnpm create vite apps/{{model}}-{{type}}-app --template react-ts
```

## アプリ起動

```sh
pnpm --filter {{app_name}} dev
```