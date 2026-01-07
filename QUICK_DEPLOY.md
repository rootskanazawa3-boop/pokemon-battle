# GitHub公開の簡単手順

## 必要な情報（GitHubから確認）

1. **GitHubのユーザー名**を教えてください
   - [GitHub.com](https://github.com)にログイン
   - 右上のプロフィール画像をクリック
   - 表示されるユーザー名を確認

2. **リポジトリ名**を決めてください
   - 例: `pokemon-battle`, `pokemon-game`, `my-pokemon` など
   - お好きな名前で構いません

## または、GitHub CLIで自動化

もしGitHub CLI（gh）がインストールされていれば、もっと簡単にできます。

```bash
# GitHub CLIでログイン
gh auth login

# リポジトリを作成してプッシュ
gh repo create pokemon-battle --public --source=. --remote=origin --push
```

---

**まずは、GitHubのユーザー名とリポジトリ名を教えてください！**

