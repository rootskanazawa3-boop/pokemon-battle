# GitHub認証の設定

## Personal Access Token (PAT) の作成手順

1. [GitHub.com](https://github.com) にログイン
2. 右上のプロフィール画像をクリック → **Settings**
3. 左側のメニューから、一番下の **Developer settings** をクリック
4. 左側のメニューから **Personal access tokens** → **Tokens (classic)** をクリック
5. **Generate new token** → **Generate new token (classic)** をクリック
6. 以下を設定：
   - **Note**: `pokemon-battle-deploy`（メモ用、何でもOK）
   - **Expiration**: `90 days` またはお好みで
   - **Select scopes**: 以下の権限にチェック
     - ✅ `repo` （全てのリポジトリのフルコントロール）
7. **Generate token** をクリック
8. **⚠️ 重要**: 表示されたトークンをコピーしてください（このページを離れると二度と表示されません）
   - 例: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## トークンを使ってプッシュ

トークンが準備できたら、以下のコマンドを実行します：

```bash
git push -u origin main
```

ユーザー名とパスワードを聞かれたら：
- **Username**: `rootskanazawa3-boop`
- **Password**: コピーしたトークンを貼り付け

---

**トークンを作成したら、準備できたことを教えてください！**

