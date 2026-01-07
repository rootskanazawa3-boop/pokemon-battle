# 404エラーの確認項目

## 1. GitHub Pagesの設定確認

リポジトリのページで確認：
1. [リポジトリのSettings](https://github.com/rootskanazawa3-boop/pokemon-battle/settings/pages) にアクセス
2. 「Source」が **「GitHub Actions」** になっているか確認
3. なっていない場合は、「GitHub Actions」を選択して保存

## 2. Actions（デプロイ）の状況確認

リポジトリのページで確認：
1. 上部のタブから **「Actions」** をクリック
2. ワークフローの実行状況を確認
   - ✅ 緑のチェックマーク = 成功
   - ⏳ 黄色の丸 = 実行中
   - ❌ 赤いバツ = 失敗

## 3. デプロイが失敗している場合

「Actions」タブで失敗（❌）が見つかったら：
- エラーメッセージを確認
- 以下を教えてください：
  - エラーメッセージの内容
  - どのステップで失敗しているか

## 4. デプロイが成功している場合

デプロイが成功しているのに404の場合：
- URLを再確認: https://rootskanazawa3-boop.github.io/pokemon-battle/
- ブラウザのキャッシュをクリア（Cmd+Shift+R）
- 数分待ってから再度アクセス

