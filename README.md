# AI の UI 比較ベンチマークリポジトリ

## 使用モデル

| エージェント | モデル |
| --- | --- |
| GPT | 5.6 Sol |
| Claude | Fable 5.1 |
| Gemini | Gemini 3.8 Flash |
| Grok | Grok 4.6 |
| Cursor | Auto（モデル選択なし） |
| Muse Spark | 1.3 |

## 新規リポジトリ作成

```sh
pnpm dlx create-turbo@latest ai-ui-benchmark
```

## 新規アプリ作成

### 雛形作成

```sh
pnpm create vite apps/{{model}}-{{type}}-app --template react-ts
```

### 実行プロンプト

```markdown
現在の作業ディレクトリには、React + TypeScript のアプリケーションのボイラープレートのみが用意されています。

このディレクトリ内の既存ファイルを利用・編集して、以下のWebアプリケーション画面を実装してください。

バックエンドやデータベースは不要です。必要なデータはフロントエンド内にモックデータとして用意してください。

作成する画面

社内で共有している備品を予約するWebアプリケーションの「備品一覧ページ」を作成してください。

今回は、この1ページだけを実装してください。

社員が利用可能な備品を探し、現在の利用状況を確認して、その場で予約できるページです。

扱う備品には以下のようなものがあります。

* ノートPC
* モニター
* カメラ
* プロジェクター
* モバイルWi-Fi
* その他の周辺機器

このページでは、以下のことができるようにしてください。

* 備品を一覧で確認する
* 備品名を検索する
* カテゴリで絞り込む
* 利用状況で絞り込む
* 各備品の現在の利用状況を確認する
* 利用可能な備品を予約する

日本企業の社員が日常的に利用する、社内向け業務アプリケーションを想定してください。

UI・デザイン

画面構成、レイアウト、コンポーネント構成、情報の見せ方、情報量、文言、ラベル、配色、余白、タイポグラフィ、一覧の表現方法などは、あなた自身が最適だと思う形で設計してください。

特定のデザインシステムや既存サービスを模倣する必要はありません。

PCでの利用を中心に設計してください。
また、画面幅が狭くなった場合にも大きくレイアウトが崩れないようにしてください。

実装要件

* 現在の作業ディレクトリ内だけで実装してください
* 新しいアプリケーションや別ディレクトリを作成する必要はありません
* 既存のボイラープレートをベースに実装してください
* 実際にブラウザで操作できる状態まで実装してください
* 検索は実際に動作させてください
* カテゴリ・利用状況による絞り込みも実際に動作させてください
* 予約操作にも簡単なインタラクションを持たせてください
* モックデータは、画面デザインを十分評価できる件数を用意してください
* 不要なページや機能は追加しないでください
* 1ページ内で完結させてください

重要

これは複数のAIコーディングエージェントのUI設計を比較するための検証です。

現在の要件から、あなた自身が業務アプリケーションとして最も適切だと考えるUIを設計・実装してください。

リポジトリ内に他の実装例や類似画面が存在する場合でも、それらのデザインを参考にしたり、寄せたりしないでください。

実装が完了したら、アプリケーションが正常に起動・ビルドできることを確認してください。
```

### ハーネスの準備

```sh
for app_dir in apps/*-agentsmd-app; do
  [[ -d "$app_dir" ]] || continue

  mkdir -p "$app_dir/.cursor/rules"

  cat > "$app_dir/AGENTS.md" <<'EOF'
# AGENTS.md

### UI Rules

- Do not add explanatory helper copy that restates what the control already implies (e.g. "optional", "works without selection", "failure falls back to X"). Prefer clear labels and option text; surface status in results when needed, not as instructional paragraphs under every field.
- Keep UI copy concise. Avoid tutorial-style descriptions unless the user explicitly asks for onboarding help.
EOF

  cat > "$app_dir/CLAUDE.md" <<'EOF'
# CLAUDE.md

## Context

- Read and follow all instructions in @AGENTS.md.
EOF

  cat > "$app_dir/.cursor/rules/agents.mdc" <<'EOF'
---
description: Shared application instructions
globs:
alwaysApply: true
---

Read and follow all instructions in @AGENTS.md.
EOF
done
```

## アプリ起動

```sh
pnpm --filter {{app_name}} dev
```