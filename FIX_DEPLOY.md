# デプロイ失敗の修正手順

## 1. Environmentの承認が必要な場合

GitHub Actionsで初めてデプロイする場合、環境（environment）の承認が必要なことがあります。

### 確認方法：
1. リポジトリの「Settings」→「Environments」を開く
2. 「github-pages」という環境があるか確認
3. なければ作成するか、ワークフローを再実行して承認を待つ

### または、ワークフローの詳細から承認：
1. 「Actions」タブで失敗したワークフローをクリック
2. ワークフローの実行画面で、「Review deployments」というボタンがある場合
3. そのボタンをクリックして承認

## 2. エラーメッセージの確認

失敗したワークフロー（赤いX）をクリックして：
1. どのステップで失敗しているか確認
2. エラーメッセージを確認
3. エラーメッセージを教えてください

## 3. よくあるエラーと対処法

### "Environment protection rules" エラー
→ Settings → Environments → github-pages で承認が必要

### "Build failed" エラー
→ ビルドエラーの内容を確認

### "Permission denied" エラー
→ Settings → Actions → General でワークフローの権限を確認

