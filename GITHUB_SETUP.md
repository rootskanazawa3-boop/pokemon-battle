# GitHubで公開する手順

## ✅ 完了したこと
- Gitリポジトリの初期化
- 初回コミット
- GitHub Pages用のデプロイ設定

## 📝 次のステップ

### 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタン → 「New repository」をクリック
3. リポジトリ名を入力（例: `pokemon-battle`）
4. 「Public」または「Private」を選択
5. ⚠️ **「Initialize this repository with a README」はチェックしない**
6. 「Create repository」をクリック

### 2. ローカルリポジトリをGitHubにプッシュ

GitHubでリポジトリを作成すると、表示されるコマンドを実行します。
または、以下のコマンドを実行してください（`YOUR_USERNAME` と `YOUR_REPO_NAME` を置き換えてください）：

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# メインブランチに名前を変更（既にmainの場合は不要）
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### 3. GitHub Pagesを有効化

1. リポジトリの「Settings」タブをクリック
2. 左側のメニューから「Pages」を選択
3. 「Source」で「GitHub Actions」を選択
4. 設定が保存されると、自動的にデプロイが開始されます

### 4. デプロイの確認

- 「Actions」タブでデプロイの進行状況を確認
- デプロイ完了後、以下のURLでアクセスできます：
  - リポジトリ名が `YOUR_USERNAME.github.io` の場合: `https://YOUR_USERNAME.github.io/`
  - それ以外の場合: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 🔄 今後の更新方法

コードを変更したら、以下のコマンドで更新できます：

```bash
git add .
git commit -m "変更内容の説明"
git push
```

プッシュすると、自動的にGitHub Actionsが実行され、数分でサイトが更新されます。


