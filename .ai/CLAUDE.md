# CLAUDE.md - AI開発アシスタント作業指示書

## 概要
このドキュメントは、AI開発プロジェクト用の完全な作業指示書テンプレートです。
過去の問題と解決策を蓄積し、将来の開発効率を向上させます。

**⚠️ 使用前に必ず以下を更新してください:**
- プロジェクト固有の技術スタック情報
- 実際のディレクトリ構造
- プロジェクト特有のコマンドやツール設定

## 公式ドキュメント
**Claude Code公式ドキュメント:** https://docs.anthropic.com/ja/docs/claude-code/overview

## STEP0: Claude Code前提知識

### Claude Codeの基本機能
- **ターミナルベースのコーディングツール**で開発を加速
- プロジェクト全体の構造を理解し、コンテキストを維持
- 自然言語でのコマンド実行
- ファイル編集、バグ修正、テスト実行、Git操作が可能

### 基本コマンド
```bash
# 対話型セッション開始
claude

# ワンタイムクエリ実行
claude -p "query"

# 最新の会話を継続
claude -c

# アップデート
claude update
```

### CLIフラグ
```bash
--add-dir          # 追加の作業ディレクトリを指定
--print, -p        # 対話型モードなしで応答を表示
--output-format    # 出力形式を指定 (text, json, stream-json)
--verbose          # 詳細ログを有効化
--model            # AIモデルを設定
```

### スラッシュコマンド
```bash
/bug               # バグ報告
/clear             # 会話履歴をクリア
/config            # 設定の表示・変更
/memory            # CLAUDE.mdメモリファイルを編集
/model             # AIモデルの選択・変更
/permissions       # 権限の表示・更新
/vim               # Vimライクキーバインディング
```

### 特別なショートカット
- `#` でメモリに素早く追加
- `\` または Option+Enter/Shift+Enter で複数行入力
- 自然言語での複雑なタスク指示

### 設定ファイル管理
**設定の優先順位:**
1. エンタープライズポリシー
2. コマンドライン引数
3. ローカルプロジェクト設定 (`.claude/settings.local.json`)
4. 共有プロジェクト設定 (`.claude/settings.json`)
5. ユーザー設定 (`~/.claude/settings.json`)

**推奨設定ファイル構成:**
```json
// .claude/settings.json (チーム共有)
{
  "permissions": {
    "allowedDirectories": ["src", "docs", ".ai"],
    "allowedCommands": ["npm", "git", "lint"],
    "requireApproval": ["rm", "sudo", "curl"]
  },
  "environment": {
    "NODE_ENV": "development"
  }
}

// .claude/settings.local.json (個人用、Git除外)
{
  "apiKey": "your-api-key",
  "preferences": {
    "outputFormat": "text",
    "verbose": true
  }
}
```

### セキュリティとベストプラクティス
**権限ベースアーキテクチャ:**
- デフォルトで読み取り専用権限
- ファイル編集やコマンド実行には明示的承認が必要
- 開始ディレクトリとサブディレクトリのみアクセス可能

**セキュリティ機能:**
- プロンプトインジェクション保護
- 危険なコマンドのブロック (`curl`, `wget`等)
- コンテキスト認識による有害な指示の検出
- ユーザー入力のサニタイズ

**推奨セキュリティ設定:**
1. センシティブなリポジトリでは厳格な権限設定
2. 変更承認前の確認を徹底
3. 定期的な権限設定の監査
4. 追加分離が必要な場合はdevcontainerを使用

### 開発ワークフローの最適化
**効率的な使用方法:**
- 関連するタスクはバッチで実行
- `/memory`コマンドでプロジェクト知識を蓄積
- `#`でクイックメモを活用
- プロジェクト固有の設定で一貫性を保持

**避けるべき事項:**
- 未確認のファイル変更の一括承認
- セキュリティ設定の無効化
- 機密情報のプレーンテキスト保存

## 知識管理システム（重要！）

### 新しい知識ベース構造
```
.ai/knowledge/
├── current/           # 現在アクティブな知識
│   ├── troubleshooting.md  # 問題と解決策（ID付き）
│   ├── tech-notes.md       # 技術的決定事項（ID付き）
│   └── lessons-learned.md  # 学習した知識（ID付き）
├── index.json        # 検索可能なメタデータ
├── knowledge-graph.json    # 知識間の関係性
├── archive/          # 過去の知識アーカイブ
└── tags/            # タグ別整理
```

### 知識の記録ルール（必須）
1. **新しい問題/解決策は必ず一意のIDを付与**
   - 形式: `k001`, `k002` など
   - 自動採番: `node .ai/scripts/knowledge-manager.js add-entry`

2. **必ずバージョン情報を記録**
   ```yaml
   versions:
     vite: ">=4.0.0"
     react: ">=18.0.0"
   ```

3. **関連する知識がある場合はリンクを作成**
   ```
   ### 関連知識
   - k002: prism-react-renderer solution
   - k003: React + Vite互換性パターン
   ```

4. **index.jsonとknowledge-graph.jsonを同時更新**
   - 手動更新または知識管理スクリプトを使用

### 知識の検索ルール
1. **現在のコンテキストから関連キーワードを抽出**
   ```bash
   node .ai/scripts/knowledge-manager.js search "vite build error"
   ```

2. **コンテキストパターンでマッチング**
   ```bash
   node .ai/scripts/knowledge-manager.js context-search vite import resolve
   ```

3. **知識グラフで関連知識を辿る**
   ```bash
   node .ai/scripts/knowledge-manager.js related k001
   ```

4. **バージョン互換性を確認**
   - `applicable_versions`フィールドをチェック

### 知識管理ユーティリティ
```bash
# 知識検索
node .ai/scripts/knowledge-manager.js search "typescript generics"

# 関連知識の探索
node .ai/scripts/knowledge-manager.js related k007

# 新エントリーテンプレート生成
node .ai/scripts/knowledge-manager.js add-entry problem

# 知識ベース検証
node .ai/scripts/knowledge-manager.js validate

# 統計情報
node .ai/scripts/knowledge-manager.js stats
```

## 前提条件
1. **必ず以下のドキュメントを参照してから作業を開始**
   - `.ai/knowledge/current/troubleshooting.md` - 過去のエラーと解決策
   - `.ai/knowledge/current/tech-notes.md` - 技術的決定事項
   - `.ai/knowledge/current/lessons-learned.md` - 学習した知識
   - `.ai/knowledge/index.json` - 検索可能な知識メタデータ

2. **開発環境**
   - WSL2 (Linux環境)
   - Node.js 18+ / npm 9+
   - Git設定済み

3. **プロジェクト技術スタック** 
   **⚠️ プロジェクトに合わせて更新してください**
   - [フロントエンド技術]
   - [ビルドツール]
   - [スタイリング技術]
   - [その他のライブラリ/フレームワーク]

## ドキュメント管理システム

### 記録すべき情報の種類
1. **トラブルシューティング (troubleshooting.md)**
   - エラーメッセージ
   - 発生状況
   - 解決方法
   - 予防策

2. **技術ノート (tech-notes.md)**
   - 技術選定の理由
   - 実装方針の決定
   - パフォーマンス考慮事項

3. **学習記録 (lessons-learned.md)**
   - ベストプラクティス
   - アンチパターン
   - 効率化のヒント

## STEP1-5: 環境構築

### STEP1: プロジェクト初期化
```bash
# React + TypeScript + Viteの場合
npm create vite@latest [プロジェクト名] -- --template react-ts
cd [プロジェクト名]

# Next.jsの場合
# npx create-next-app@latest [プロジェクト名] --typescript

# Nuxt.jsの場合 
# npx create-nuxt-app [プロジェクト名]
```

**⚠️ エラーが発生したら:**
```markdown
## troubleshooting.mdに追記
### [日付] プロジェクト初期化エラー
**エラー:** [エラーメッセージ]
**原因:** [原因]
**解決:** [解決方法]
```

## STEP 2: 知識管理システムの初期化
以下のコマンドを実行して共有知識システムをセットアップ：
```bash
node .ai/scripts/setup-knowledge-sharing.js
```
これにより：
- current-local/: プロジェクト固有の知識
- shared/: 全プロジェクト共有の知識（シンボリックリンク）

### STEP3: 依存関係インストール
```bash
npm install

# プロジェクトに必要な依存関係を追加
# 例: CSS Framework
# npm install -D tailwindcss postcss autoprefixer

# 例: UI ライブラリ
# npm install @mui/material @emotion/react @emotion/styled

# 例: 状態管理
# npm install zustand  # or redux, jotai

# 例: その他のライブラリ
# npm install [必要なパッケージ]
```

**💡 技術選定の記録:**
```markdown
## tech-notes.mdに追記
### [日付] ライブラリ選定
- **prism-react-renderer選択理由:** 
  - prismjsはViteとの互換性問題あり
  - Reactコンポーネントとして統合が容易
  - TypeScript型定義が充実
```

### STEP4: Tailwind CSS設定
```bash
npx tailwindcss init -p
```

設定ファイル更新:
```javascript
// tailwind.config.js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

### STEP5: TypeScript設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### STEP6: 開発サーバー設定
```typescript
// vite.config.ts
server: {
  host: '0.0.0.0',  // WSL環境でのアクセス許可
  port: 5173
}
```

**📝 既知の問題:**
```markdown
## troubleshooting.mdに追記
### WSL localhost接続問題
**問題:** WSLからlocalhostにアクセスできない
**解決:** vite.config.tsでhost: '0.0.0.0'を設定
```

## STEP7-11: 基本機能実装

### STEP7: ディレクトリ構造
```
src/
├── components/     # Reactコンポーネント
├── hooks/         # カスタムフック
├── types/         # TypeScript型定義
├── utils/         # ユーティリティ関数
└── styles/        # CSS/スタイルファイル
```

### STEP8: 型定義
```typescript
// src/types/[Entity].ts
// プロジェクトのドメインに合わせて型定義を作成
export interface [EntityName] {
  id: string;
  // プロジェクト固有のプロパティを定義
  createdAt: Date;
  updatedAt: Date;
}

// 例: ユーザー管理アプリの場合
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'user';
//   createdAt: Date;
//   updatedAt: Date;
// }
```

### STEP9: 基本コンポーネント作成
**プロジェクトのドメインに合わせてコンポーネントを作成**

例:
- [Entity]List: 一覧表示コンポーネント
- [Entity]Form: 作成・編集フォーム
- [Entity]Detail: 詳細表示コンポーネント
- App: 状態管理とルーティング

**💡 コンポーネント設計の記録:**
```markdown
## tech-notes.mdに追記
### コンポーネント設計方針
- 単一責任の原則を遵守
- propsによる疎結合
- TypeScriptで型安全性を確保
```

### STEP10: 状態管理
```typescript
// プロジェクトの規模に応じて状態管理手法を選択

// 小規模: useState + useContext
const [items, setItems] = useState<EntityType[]>([]);

// 中規模: Zustand
// import { create } from 'zustand'
// interface Store {
//   items: EntityType[]
//   addItem: (item: EntityType) => void
// }

// 大規模: Redux Toolkit
// import { configureStore, createSlice } from '@reduxjs/toolkit'
```

### STEP11: Git初期化とコミット
```bash
git init
git add .
git commit -m "feat: 初期実装"
```

**⚠️ コミット規約:**
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット
- refactor: リファクタリング

## STEP12-16: 高度な機能

### STEP12-13: プロジェクト固有の機能実装
**⚠️ 以下はマークダウンエディタの例です。プロジェクトに合わせて更新してください**

```typescript
// プロジェクトに必要な外部ライブラリの統合例
// 
// マークダウンの場合:
// import { marked } from 'marked';
//
// 日付処理の場合:
// import { format } from 'date-fns';
//
// API通信の場合:
// import axios from 'axios';
//
// フォーム検証の場合:
// import { z } from 'zod';
```

**重要な技術的決定は tech-notes.md に記録:**
```markdown
## tech-notes.mdに追記
### [ライブラリ名]の選定
**理由:**
1. [選定理由1]
2. [選定理由2]
3. [選定理由3]

**代替案との比較:**
- [代替案1]: [比較ポイント]
- [代替案2]: [比較ポイント]
```

### STEP14: データ永続化
```typescript
// プロジェクトの要件に応じてデータ永続化を実装

// ローカルストレージの場合
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 実装
}

// IndexedDBの場合
// import Dexie from 'dexie';

// サーバーAPIの場合
// const saveData = async (data: EntityType) => {
//   await fetch('/api/save', {
//     method: 'POST',
//     body: JSON.stringify(data)
//   });
// };
```

**📝 エラーハンドリング:**
```markdown
## lessons-learned.mdに追記
### ローカルストレージのエラー処理
- QuotaExceededErrorの検出
- JSONパースエラーの処理
- 型安全性の確保 (ジェネリクス使用)
```

### STEP15: プロジェクト固有のUI機能
**プロジェクトの要件に応じてUI機能を実装**

例:
- 検索・フィルタリング機能
- ソート機能
- ページネーション
- モーダル・ダイアログ
- ローディング状態
- エラーハンドリング

### STEP16: エラーバウンダリ
```typescript
// エラー境界の実装（オプション）
class ErrorBoundary extends React.Component {
  // 実装
}
```

## STEP17-21: 品質保証とドキュメント化

### STEP17: Linting設定
```bash
npm run lint
```

**⚠️ よくあるLintエラー:**
```markdown
## troubleshooting.mdに追記
### @typescript-eslint/no-explicit-any
**解決:** 具体的な型を定義するか、unknownを使用
### no-prototype-builtins
**解決:** Object.prototype.hasOwnProperty.call()を使用
```

### STEP18: ビルド最適化
```bash
npm run build
```

**📊 パフォーマンス記録:**
```markdown
## tech-notes.mdに追記
### ビルドサイズ最適化
- 初期: 300KB+
- 最適化後: 277KB
- 手法: 動的インポート、Tree shaking
```

### STEP19: テスト（オプション）
```bash
npm test
```

## STEP 20: 開発セッション完了時の知識蓄積
開発が完了したら、必ず以下を実行すること：

### 必須記録項目
1. **lessons-learned.md への追加**
   - 今回の開発で学んだ新しいパターン
   - 効率的だった実装方法
   - 次回に活かせる知見
   - 新規エントリーにはk031以降のIDを付与

2. **tech-notes.md への記録**
   - 新しく採用した技術やライブラリ
   - アーキテクチャの決定事項
   - パフォーマンス最適化の方法

3. **journal への開発記録**
   - journal/YYYY-MM-DD.md に以下を記載：
     - 実装した機能の概要
     - 開発時間
     - 遭遇した課題（なくても「エラーなし」と記録）
     - 使用した過去の知識ID

4. **troubleshooting.md の確認**
   - エラーが発生しなかった場合も「スムーズに完了」と記録
   - 予防的に回避できた問題があれば記録

### 自動チェック
開発完了時に以下を確認：
```bash
# 新しい知識が追加されたか確認
git diff .ai/knowledge/current/
```

## STEP 21: README.md の更新
プロジェクト固有のREADME.mdを必ず更新：
- プロジェクト名と説明
- 実装した機能一覧
- 使用技術の明記
- セットアップ手順
- 使用方法

## 実際に発生した問題と解決策

### 1. prismjsビルドエラー
**問題:**
```
Cannot find module 'prismjs/components/prism-javascript'
```

**解決:**
```bash
npm uninstall prismjs @types/prismjs
npm install prism-react-renderer
```

### 2. WSL環境でのlocalhost問題
**問題:** ブラウザからlocalhostにアクセスできない

**解決:**
```typescript
// vite.config.ts
server: {
  host: '0.0.0.0',
  port: 5173
}
```

### 3. 文字化け問題
**問題:** 日本語が文字化けする

**解決:**
- UTF-8エンコーディングを確認
- HTMLメタタグでcharset指定
- エディタの文字コード設定確認

## 開発フロー

### 新機能追加時
1. `troubleshooting.md`で過去の類似問題を確認
2. `tech-notes.md`で技術方針を確認
3. 実装
4. エラーが発生したら即座に記録
5. 解決後、`lessons-learned.md`に知見を追加

### エラー対応時
1. エラーメッセージを正確に記録
2. `troubleshooting.md`で既知の問題か確認
3. 新規の場合は解決策を探す
4. 解決後、必ず文書化

### コードレビュー時
1. Lintエラーがないか確認
2. TypeScript型エラーがないか確認
3. ビルドが成功するか確認
4. 新しい学びがあれば記録

## メンテナンス

### 定期的な更新
- 月1回: ドキュメントの整理
- 四半期: 依存関係の更新
- 半年: 大規模リファクタリング検討

### 知識の継承
- 新しいAIアシスタントは必ずこれらのドキュメントを読む
- 重要な決定は必ず記録する
- エラーと解決策は即座に文書化

## プロジェクト固有の設定

### Claude Code設定ファイル
**⚠️ プロジェクトに合わせて設定を更新してください**

**`.claude/settings.json` (チーム共有設定):**
- 許可ディレクトリ: `src`, `public`, `docs`, `.ai` [プロジェクトに合わせて追加]
- 許可コマンド: `npm`, `npx`, `git`, `node` [プロジェクトで使用するツールを追加]
- 承認必須コマンド: `rm`, `sudo`, `curl`, `wget`, `chmod`, `chown`
- その他のプロジェクト固有設定

**個人設定 (`.claude/settings.local.json`):**
```json
{
  "apiKey": "your-api-key",
  "preferences": {
    "outputFormat": "text",
    "verbose": true,
    "theme": "dark"
  }
}
```

### セキュリティ設定
- **読み取り専用デフォルト:** ファイル変更には明示的承認が必要
- **ディレクトリ制限:** プロジェクトディレクトリ内のみアクセス可能
- **コマンド制限:** 危険なコマンドはブロックまたは承認必須

## コマンドリファレンス

### Claude Codeコマンド
```bash
# 対話型セッション開始
claude

# プロジェクト設定確認
claude -p "/config"

# メモリファイル編集
claude -p "/memory"

# 権限確認
claude -p "/permissions"

# モデル変更
claude -p "/model"
```

### 開発コマンド
**⚠️ プロジェクトのpackage.jsonに合わせて更新してください**

```bash
# 開発サーバー起動
npm run dev          # or yarn dev / pnpm dev

# ビルド
npm run build        # or yarn build / pnpm build

# Lint
npm run lint         # or yarn lint / pnpm lint

# テスト
npm run test         # or yarn test / pnpm test

# その他のプロジェクト固有コマンド
# npm run [custom-command]
```

### Git操作
```bash
git add .
git commit -m "feat: 機能説明"
git push origin main
```

---

最終更新: 2025-06-21
次回レビュー予定: 2025-07-21