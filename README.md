# 🚀 vibe-coding-template

![Version](https://img.shields.io/badge/version-v2.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Knowledge Entries](https://img.shields.io/badge/knowledge_entries-207-brightgreen)

**AI開発用プロジェクトテンプレート**

Claude Codeを活用した効率的な開発のためのテンプレートプロジェクトです。過去の知見を活かし、AI アシスタントとの協働開発を最適化します。

## 🎯 このテンプレートの特徴

- **📚 知識の蓄積**: エラーと解決策を `.ai/` ディレクトリで体系的に管理
- **🔧 Claude Code最適化**: プロジェクト固有の設定ファイルとドキュメント
- **⚡ 高速な開発開始**: 基本的なReact + TypeScript環境をすぐに利用可能
- **🎨 VIBE Coding**: 効率的な開発手法のガイドライン

## 📁 プロジェクト構造

```
vibe-coding-template/
├── .ai/                    # AI開発アシスタント用ドキュメント（重要）
│   ├── CLAUDE.md          # メインの作業指示書
│   ├── context.md         # プロジェクトコンテキスト
│   ├── troubleshooting.md # エラーと解決策
│   ├── tech-notes.md      # 技術的決定事項
│   ├── lessons-learned.md # 学習した知識
│   └── journal/           # 開発記録
├── .claude/               # Claude Code設定
│   └── settings.json      # プロジェクト固有設定
├── src/                   # アプリケーションソース
│   ├── App.tsx           # メインコンポーネント
│   └── main.tsx          # エントリーポイント
├── VIBE_GUIDE.md         # VIBE Codingガイド
└── README.md             # このファイル
```

## 🚀 使い方

### 🎯 推奨方法: 自動プロジェクト作成（new-project.sh）

```bash
# 新しいプロジェクトを自動作成（知識共有システム統合）
bash scripts/new-project.sh my-awesome-project

# または npm script で実行
npm run new-project my-awesome-project

# 指定ディレクトリに作成
bash scripts/new-project.sh my-app ~/projects/
```

**🌟 自動セットアップ内容:**
- ✅ テンプレートファイルのコピー
- ✅ プロジェクト固有情報の更新（package.json, context.md等）
- ✅ 共有知識システムへの自動接続
- ✅ Git リポジトリの初期化と初期コミット
- ✅ Claude Code 最適化設定の適用

**📝 使用例:**
```bash
# テンプレート外のディレクトリから実行（推奨）
cd ~/projects
bash ~/vibe-coding-template/scripts/new-project.sh my-amazing-app

# カレントディレクトリに作成
bash ~/vibe-coding-template/scripts/new-project.sh my-app

# 指定ディレクトリに作成
bash ~/vibe-coding-template/scripts/new-project.sh my-app ~/workspace/
```

### 📋 手動方法: テンプレートのコピー

```bash
# このテンプレートをコピー
cp -r vibe-coding-template my-new-project
cd my-new-project

# Git初期化（オプション）
git init
```

### 2. 知識管理システムの初期化

**自動プロジェクト作成を使用した場合はスキップ可能**

```bash
# 手動でセットアップする場合
npm run setup:knowledge

# または共有知識システムに接続
~/vibe-shared-knowledge/scripts/setup-shared-knowledge.sh
```

### 3. プロジェクト情報の更新

**重要**: 以下のファイルを必ず更新してください

#### `.ai/context.md`
```markdown
- 名前: [あなたのプロジェクト名]
- 目的: [プロジェクトの目的]
- 技術スタック: [使用する技術]
```

#### `.ai/CLAUDE.md`
- STEP7以降のプロジェクト固有の技術情報を更新
- 使用するライブラリやフレームワークに合わせて調整

#### `package.json`
```json
{
  "name": "your-project-name",
  "description": "your project description"
}
```

### 4. 依存関係のインストール

```bash
npm install
```

### 5. 開発開始

```bash
# 開発サーバー起動
npm run dev

# Claude Code セッション開始
claude
```

## 📖 重要なファイルの説明

### `.ai/` ディレクトリ（最重要）

このディレクトリは**高度なAI知識管理システム**のコアです：

### 知識管理システム v2.2 🧠✨
- **共有知識**: ~/vibe-shared-knowledge/ に全プロジェクトの知識を集約
- **ローカル知識**: current-local/ にプロジェクト固有の知識
- **自動共有**: どのプロジェクトで得た知見も即座に全体で利用可能
- **自動接続**: new-project.sh使用時に共有システムに自動接続

初期セットアップ：
```bash
# 自動プロジェクト作成時は自動実行
bash scripts/new-project.sh my-project

# 手動セットアップ
~/vibe-shared-knowledge/scripts/setup-shared-knowledge.sh
```

#### 🧠 知識管理システム構造
```
.ai/knowledge/
├── current-local/        # プロジェクト固有の知識
│   ├── troubleshooting.md    # 構造化された問題・解決策（ID付き）
│   ├── tech-notes.md         # 技術的決定事項（ID付き）
│   └── lessons-learned.md    # パターン・ベストプラクティス（ID付き）
├── shared/              # 全プロジェクト共有知識（シンボリックリンク）
├── shared-index.json    # 共有知識インデックス（シンボリックリンク）
├── index.json           # 検索可能なメタデータ
├── knowledge-graph.json # 知識間の関係性マッピング
├── archive/            # 月別アーカイブ
└── scripts/            # 知識管理ユーティリティ
```

#### 🎯 主要な機能
- **構造化された知識**: 各エントリーに一意ID（k001、k002...）
- **関係性マッピング**: 知識グラフで問題→解決策→パターンを関連付け
- **コンテキスト検索**: 開発状況に応じた知識の自動発見
- **バージョン管理**: 技術スタックバージョンとの互換性管理
- **自動化ツール**: CLI経由での知識検索・管理

#### 🛠️ 知識管理ツール
```bash
# 知識検索
node .ai/scripts/knowledge-manager.cjs search "typescript generics"

# 関連知識の探索  
node .ai/scripts/knowledge-manager.cjs related k007

# 新エントリー作成
node .ai/scripts/knowledge-manager.cjs add-entry problem

# 整合性チェック
node .ai/scripts/knowledge-manager.cjs validate
```

#### 📊 現在の知識ベース
- **30+ 構造化エントリー**: 問題、解決策、パターン、技術決定
- **10+ 関係性**: 知識グラフでの相互関連
- **6つのコンテキストパターン**: AI の文脈理解用
- **バージョン対応**: React、TypeScript、Vite等の互換性情報

### `.claude/settings.json`

Claude Code の プロジェクト固有設定：

```json
{
  "permissions": {
    "allowedDirectories": ["src", "public", "docs", ".ai"],
    "allowedCommands": ["npm", "npx", "git", "node"],
    "requireApproval": ["rm", "sudo"]
  }
}
```

## 🎨 VIBE Coding とは

**VIBE** = **V**elocity（速度）**I**nsight（洞察）**B**alance（バランス）**E**fficiency（効率）

効率的なAI協働開発のための手法です。詳細は `VIBE_GUIDE.md` を参照してください。

## 📚 実装例

具体的な実装例として、以下のプロジェクトを参照できます：

- **markdown-memo-app**: マークダウンメモアプリの実装例
  - React + TypeScript + Vite
  - マークダウンプレビュー機能
  - ローカルストレージでの永続化

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# Lint チェック
npm run lint

# プレビュー
npm run preview
```

## 🤖 Claude Code との協働

### 基本的な使い方

```bash
# Claude Code セッション開始
claude

# メモリファイル編集
claude -p \"/memory\"

# 設定確認
claude -p \"/config\"
```

### 効果的な使い方

1. **開発開始時**: まず `.ai/CLAUDE.md` を読ませる
2. **エラー発生時**: `troubleshooting.md` で既知の問題を確認
3. **新機能追加時**: `tech-notes.md` で技術方針を確認
4. **解決後**: 必ず知見を該当ファイルに記録

## 🎯 このテンプレートの利点

### 🚀 高速な立ち上げ
- 環境構築の手順が明確
- よくあるエラーの解決策が蓄積済み
- Claude Code の設定が最適化済み

### 📚 知識の継承
- 過去のエラーと解決策を参照可能
- 技術的決定の理由が記録済み
- 新しいAIアシスタントでも一貫した開発が可能

### 🔄 継続的改善
- 開発中に得た知見を体系的に蓄積
- プロジェクト固有の知識ベースを構築
- 同様のプロジェクトで知見を再利用

## 🌟 推奨ワークフロー

1. **プロジェクト開始** 🚀
   ```bash
   # 🎯 推奨: 自動プロジェクト作成（完全自動化）
   bash scripts/new-project.sh my-awesome-project
   cd my-awesome-project
   
   # 📦 依存関係のインストール
   npm install
   
   # ⚡ 開発開始
   npm run dev
   
   # 🤖 Claude Code で設定確認
   claude -p \"/config\"
   ```
   
   **または従来の手動方法:**
   ```bash
   # 手動でテンプレートコピー
   cp -r vibe-coding-template my-project
   cd my-project
   
   # 共有知識システムセットアップ
   ~/vibe-shared-knowledge/scripts/setup-shared-knowledge.sh
   
   # Claude Code で設定確認
   claude -p \"/config\"
   ```

2. **開発フェーズ**
   ```bash
   # Claude Code セッション開始
   claude
   
   # メモリファイル（CLAUDE.md）を読ませる
   # 新機能の実装指示
   # エラーが発生したら即座に記録
   ```

3. **知見の蓄積**
   - エラー解決後は `troubleshooting.md` に記録
   - 技術選択の理由は `tech-notes.md` に記録
   - 重要な学びは `lessons-learned.md` に記録

## 📞 サポート

- **VIBE Coding手法**: `VIBE_GUIDE.md` を参照
- **Claude Code公式ドキュメント**: https://docs.anthropic.com/ja/docs/claude-code/overview
- **トラブルシューティング**: `.ai/troubleshooting.md` を確認

## 📝 ライセンス

MIT License - 自由に使用・改変してください

---

**🎉 Happy Coding with AI! 🤖**

このテンプレートを使って、効率的なAI協働開発を体験してください。