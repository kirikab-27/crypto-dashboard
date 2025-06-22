# トラブルシューティング履歴

このドキュメントは、プロジェクト開発中に発生した問題と解決策を記録します。

---
id: k001
title: prismjs Vite build error
date: 2025-06-21
tags: [build-error, vite, library]
versions:
  vite: ">=4.0.0"
  react: ">=18.0.0"
  prismjs: "1.29.0"
severity: high
---

### 問題
Viteでprismjsをインポートしたときにモジュールresolutionエラーが発生

### エラーメッセージ
```
Cannot find module 'prismjs/components/prism-javascript'
```

### 発生状況
- Viteでビルド実行時
- prismjsをインポートしようとした際

### 原因
- prismjsのモジュール解決がViteと互換性がない
- ESモジュールとCommonJSの混在問題

### 解決策
prism-react-rendererに切り替えることで解決（→ k002）

```bash
# prismjsをアンインストール
npm uninstall prismjs @types/prismjs

# prism-react-rendererをインストール
npm install prism-react-renderer
```

### 関連知識
- k002: prism-react-renderer solution
- k003: React + Vite互換性パターン

### 予防策
- Viteプロジェクトではprism-react-rendererを使用
- ビルドツールとの互換性を事前確認

---
id: k004
title: WSL localhost access issue
date: 2025-06-21
tags: [wsl, network, vite]
versions:
  vite: ">=4.0.0"
  wsl: "2.0"
severity: medium
---

### 問題
WSL環境でVite開発サーバーにブラウザからアクセスできない

### 発生状況
- WSL環境でnpm run devを実行
- ブラウザからhttp://localhost:5173にアクセスできない

### 原因
- WSLのネットワーク設定
- Viteのデフォルトホスト設定が127.0.0.1

### 解決策
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

### 関連知識
- k005: WSL network configuration patterns

### 予防策
- WSL環境では常にhost: '0.0.0.0'を設定
- ネットワークURLも確認可能に

---
id: k006
title: TypeScript generic type inference error
date: 2025-06-21
tags: [typescript, generics, hooks]
versions:
  typescript: ">=5.0.0"
  react: ">=18.0.0"
severity: medium
---

### 問題
useLocalStorageフックでジェネリック型の推論エラー

### エラーメッセージ
```
Type 'Memo[]' is not assignable to type 'never[]'
```

### 発生状況
- useLocalStorageフックを使用時
- ジェネリック型の推論エラー

### 解決策
```typescript
// 明示的に型を指定
export function useMemosStorage() {
  return useLocalStorage<Memo[]>(STORAGE_KEY, []);
}
```

### 関連知識
- k007: TypeScript generics best practices

### 予防策
- カスタムフックでは明示的な型指定
- ジェネリック型の正しい使用

---
id: k008
title: marked.js async type error
date: 2025-06-21
tags: [markdown, types, async]
versions:
  marked: ">=4.0.0"
severity: low
---

### 問題
marked(markdown)の返り値の型エラー

### エラーメッセージ
```
Type 'string | Promise<string>' is not assignable to type 'string'
```

### 解決策
```typescript
const result = marked(markdown);
return typeof result === 'string' ? result : markdown;
```

### 関連知識
- k009: Library type handling patterns

### 予防策
- ライブラリのAPIドキュメントを確認
- 返り値の型を適切に処理

---
id: k010
title: ESLint no-explicit-any error
date: 2025-06-21
tags: [eslint, typescript, code-quality]
versions:
  eslint: ">=8.0.0"
  typescript: ">=5.0.0"
severity: low
---

### 問題
ESLint の no-explicit-any ルールエラー

### エラーメッセージ
```
Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```

### 解決策
- 具体的な型を定義
- やむを得ない場合はunknownを使用
- 型推論に任せる

### 関連知識
- k007: TypeScript best practices

### 予防策
- tsconfig.jsonでstrictモードを有効化
- 型定義を徹底

---
id: k011
title: ESLint no-prototype-builtins error
date: 2025-06-21
tags: [eslint, javascript, prototype]
versions:
  eslint: ">=8.0.0"
severity: low
---

### 問題
プロトタイプメソッドの直接アクセスエラー

### エラーメッセージ
```
Do not access Object.prototype method 'hasOwnProperty' from target object
```

### 解決策
```typescript
// 修正前
if (localStorage.hasOwnProperty(key))

// 修正後
if (Object.prototype.hasOwnProperty.call(localStorage, key))
```

### 関連知識
- k012: JavaScript prototype patterns

### 予防策
- プロトタイプメソッドの直接呼び出しを避ける
- ESLint推奨パターンに従う

---
id: k013
title: Git authentication error in WSL
date: 2025-06-21
tags: [git, authentication, wsl]
versions:
  git: ">=2.30.0"
  wsl: "2.0"
severity: medium
---

### 問題
WSL環境でgit pushコマンド実行時の認証エラー

### エラーメッセージ
```
fatal: could not read Username for 'https://github.com': No such device or address
```

### 解決策
1. Personal Access Token (PAT)を作成
2. git config --global credential.helper store
3. 手動でgit pushして認証情報を入力

### 関連知識
- k014: Git authentication patterns
- k015: WSL credential management

### 予防策
- GitHub CLIの使用を検討
- SSH認証の設定
- 認証情報の安全な管理

---

## 共通の対処法

### ビルドエラーが発生したら
1. npm run buildでエラー詳細を確認
2. node_modulesを削除して再インストール
3. package-lock.jsonも削除して完全リセット

### TypeScriptエラーが発生したら
1. npm run lintで型エラーを確認
2. tsconfig.jsonの設定を確認
3. 型定義ファイルの存在を確認

### 依存関係の問題
1. npm list [パッケージ名]で依存関係を確認
2. npm outdatedで古いパッケージを確認
3. 慎重にアップデート

---
id: k014
title: Monorepo "No tasks were executed" error
date: 2025-06-22
tags: [monorepo, turborepo, pnpm, build-error]
versions:
  pnpm: "latest"
  turborepo: "latest"
severity: high
---

### 問題
Turborepoでpnpm devを実行した際に「No tasks were executed」エラーが発生

### エラーメッセージ
```
No tasks were executed
```

### 発生状況
- モノレポセットアップ後の初回実行時
- apps/packages配下のパッケージが不完全

### 原因
- 各パッケージの実装が不足している
- package.jsonまたは必要なファイルが不足

### 解決策
各apps/packages配下に以下を含める：
1. 完全なpackage.json
2. 実装ファイル
3. 必要な設定ファイル

### 関連知識
- k015: PostgreSQL authentication patterns
- k016: Prisma schema configuration

### 予防策
- モノレポセットアップ時に各パッケージの完整性を確認
- Turborepoの設定ファイルを正しく構成

---
id: k015
title: PostgreSQL peer authentication error
date: 2025-06-22
tags: [postgresql, authentication, pg_hba, database]
versions:
  postgresql: ">=14.0"
severity: high
---

### 問題
PostgreSQLでpeer認証からmd5認証への変更が必要

### エラーメッセージ
```
Authentication failed for user 'postgres'
```

### 発生状況
- PostgreSQL初期セットアップ時
- アプリケーションからのデータベース接続時

### 原因
- pg_hba.confがpeer認証に設定されている
- パスワード認証が無効になっている

### 解決策
1. 一時的にtrust認証に変更
```bash
sudo vim /etc/postgresql/16/main/pg_hba.conf
# local   all   postgres   peer → trust に変更
sudo service postgresql restart
```

2. パスワードを設定
```sql
ALTER USER postgres WITH PASSWORD 'postgres';
```

3. md5認証に変更
```bash
# trust → md5 に変更
sudo service postgresql restart
```

### 関連知識
- k016: Prisma database configuration
- k017: Environment variable management

### 予防策
- PostgreSQL初期セットアップ時にmd5認証を設定
- 開発環境用の専用ユーザーを作成

---
id: k016
title: Prisma schema file placement error
date: 2025-06-22
tags: [prisma, database, schema, file-structure]
versions:
  prisma: ">=4.0.0"
severity: medium
---

### 問題
schema.prismaファイルの配置場所エラー

### エラーメッセージ
```
schema.prisma not found
```

### 発生状況
- prisma generateまたはprisma migrate実行時
- schema.prismaを直接配置した場合

### 原因
- schema.prismaがprisma/ディレクトリ内に配置されていない
- Prismaの規約に従っていない

### 解決策
```bash
mkdir prisma
mv schema.prisma prisma/
```

### 関連知識
- k015: PostgreSQL setup patterns
- k017: Monorepo environment management

### 予防策
- Prisma初期化時に正しいディレクトリ構造を確認
- prisma initコマンドを使用して標準構造を生成

---
id: k017
title: Monorepo environment variable inheritance problem
date: 2025-06-22
tags: [monorepo, environment-variables, turborepo, configuration]
versions:
  turborepo: "latest"
  node: ">=16.0.0"
severity: medium
---

### 問題
モノレポで環境変数が各パッケージに引き継がれない

### 発生状況
- packages/database等で環境変数が読み込めない
- ルートの.envが認識されない

### 原因
- Turborepoでの環境変数スコープの問題
- 各パッケージに.envファイルが必要

### 解決策
```bash
# 各パッケージに.envをコピー
cp ../../.env .
```

または turbo.jsonで環境変数を設定：
```json
{
  "pipeline": {
    "dev": {
      "env": ["DATABASE_URL", "NODE_ENV"]
    }
  }
}
```

### 関連知識
- k014: Monorepo task execution
- k016: Database configuration patterns

### 予防策
- モノレポセットアップ時に環境変数管理戦略を決定
- 各パッケージの環境変数要件を文書化

---
id: k018
title: Development environment essential tools check
date: 2025-06-22
tags: [setup, dependencies, tools-check, development-environment]
versions:
  node: ">=16.0.0"
  pnpm: "latest"
  postgresql: ">=12.0"
  docker: ">=20.0.0"
severity: low
---

### 問題
開発環境に必要なツールが不足している

### 発生状況
- プロジェクトセットアップ時
- 新しい開発環境での初回セットアップ

### 原因
- 必須ツールがインストールされていない
- 適切なバージョンがインストールされていない

### 解決策
**必須ツールのインストール:**
```bash
# pnpm
npm install -g pnpm

# PostgreSQL (Ubuntu/WSL)
sudo apt install postgresql

# 初期データベース作成
sudo -u postgres createdb task_management
```

**Docker (オプション):**
```bash
sudo apt install docker.io
sudo usermod -aG docker $USER
```

### 関連知識
- k015: PostgreSQL authentication setup
- k017: Environment configuration

### 予防策
- プロジェクトREADMEに必須ツール一覧を記載
- セットアップスクリプトで依存関係をチェック
- 開発環境の標準化

---

最終更新: 2025-06-22