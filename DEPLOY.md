# GitHub Pages へのデプロイ手順

## 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名を入力（例: `pokemon-battle`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

## 2. ローカルでGitを初期化してプッシュ

ターミナルで以下のコマンドを実行：

```bash
# Gitを初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: Pokemon battle game"

# メインブランチに名前を変更（必要に応じて）
git branch -M main

# GitHubリポジトリをリモートとして追加
# YOUR_USERNAME と YOUR_REPO_NAME を実際の値に置き換えてください
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# コードをプッシュ
git push -u origin main
```

## 3. GitHub Pagesの設定

1. GitHubリポジトリのページで「Settings」タブをクリック
2. 左側のメニューから「Pages」を選択
3. 「Source」で「GitHub Actions」を選択
4. 設定が保存されると、自動的にデプロイが開始されます

## 4. デプロイの確認

- デプロイには数分かかることがあります
- 「Actions」タブでデプロイの進行状況を確認できます
- デプロイが完了すると、`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` でアクセスできます

## 注意事項

- リポジトリ名が `YOUR_USERNAME.github.io` の場合は、ルートURL（`https://YOUR_USERNAME.github.io/`）でアクセスできます
- それ以外のリポジトリ名の場合は、`https://YOUR_USERNAME.github.io/リポジトリ名/` でアクセスします
- 後者の場合、`vite.config.ts` の `base` を設定する必要があるかもしれません

