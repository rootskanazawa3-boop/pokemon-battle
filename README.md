# ポケモンバトルゲーム

React + TypeScript + Vite で作られたポケモンバトルゲームです。

## セットアップ

### 必要な環境
- Node.js (v16以上推奨)
- npm または yarn

### インストール

```bash
npm install
```

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## ビルド

本番用のビルドを作成する場合:

```bash
npm run build
```

ビルド結果をプレビューする場合:

```bash
npm run preview
```

## プロジェクト構成

- `src/App.tsx` - メインアプリケーションコンポーネント
- `src/BokemonGame.tsx` - バトルゲームのメインロジック
- `src/main.tsx` - エントリーポイント
- `src/index.css` - グローバルスタイル（Tailwind CSS）

## 機能

- ポケモンの選択とバトル
- 技の使用
- HP管理と勝敗判定
- ポケモンの交代
- 効果音（Web Audio API使用）

