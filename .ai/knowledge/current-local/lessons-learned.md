# 学習した知識と教訓

このドキュメントは、プロジェクト開発を通じて得られた知見を記録します。

---
id: k021
title: React TypeScript best practices
date: 2025-06-21
tags: [pattern, react, typescript, best-practices]
versions:
  react: ">=18.0.0"
  typescript: ">=5.0.0"
category: pattern
---

### パターン内容
React + TypeScript開発のベストプラクティス

### 型定義の重要性
- インターフェースは必ず定義する
- anyは絶対に使わない（unknownを使用）
- ジェネリクスを活用して再利用性を高める

### 実装例
```typescript
// ❌ 悪い例
const [data, setData] = useState<any>([]);

// ✅ 良い例
const [data, setData] = useState<Memo[]>([]);
```

### 関連知識
- k007: TypeScript generics best practices
- k020: Component design principles

---
id: k022
title: Vite library selection patterns
date: 2025-06-21
tags: [pattern, vite, library, compatibility]
versions:
  vite: ">=4.0.0"
category: pattern
---

### パターン内容
Viteプロジェクトでのライブラリ選定パターン

### 重要な確認点
- ビルドツールとの互換性を最優先に確認
- ESモジュール対応のライブラリを選ぶ
- TypeScript型定義の有無を確認

### 具体例
- prismjs → ビルドエラー（k001）
- prism-react-renderer → 完璧に動作（k002）

### 関連知識
- k003: React + Vite compatibility pattern
- k001: prismjs Vite build error

---
id: k023
title: Custom hooks design patterns
date: 2025-06-21
tags: [pattern, hooks, react, design]
versions:
  react: ">=18.0.0"
  typescript: ">=5.0.0"
category: pattern
---

### パターン内容
カスタムフックの設計パターン

### 設計原則
```typescript
// 汎用的なフックと特化型フックの組み合わせ
function useLocalStorage<T>() { /* 汎用 */ }
function useMemosStorage() { /* 特化 */ }
```

### メリット
- 再利用性と型安全性の両立
- テストが容易
- 責任の分離が明確

### 関連知識
- k019: LocalStorage data persistence
- k007: TypeScript generics best practices

---
id: k024
title: Error handling patterns
date: 2025-06-21
tags: [pattern, error-handling, localstorage]
versions:
  react: ">=18.0.0"
category: pattern
---

### パターン内容
エラーハンドリングのベストプラクティス

### LocalStorageの例
```typescript
try {
  localStorage.setItem(key, value);
} catch (err) {
  if (err instanceof DOMException && err.code === 22) {
    // QuotaExceededError
  }
}
```

### 学んだこと
- 具体的なエラー型で分岐
- ユーザーフレンドリーなメッセージ
- 復旧可能な方法を提供

### 関連知識
- k019: LocalStorage data persistence

---
id: k025
title: WSL development environment patterns
date: 2025-06-21
tags: [pattern, wsl, environment, development]
versions:
  wsl: "2.0"
category: pattern
---

### パターン内容
WSL環境での開発ベストプラクティス

### ネットワーク設定
- 必ずhost: '0.0.0.0'を設定
- localhostだけでなくネットワークIPも確認
- ファイアウォール設定に注意

### ファイルシステム
- パフォーマンスはWSL2内が最速
- Windows側のファイルアクセスは遅い
- 大文字小文字の区別に注意

### 関連知識
- k004: WSL localhost access issue
- k005: WSL network configuration patterns

---
id: k026
title: Git workflow best practices
date: 2025-06-21
tags: [pattern, git, workflow, commits]
versions:
  git: ">=2.30.0"
category: pattern
---

### パターン内容
Git運用のベストプラクティス

### コミットメッセージ
```bash
# ✅ 良い例
feat: ローカルストレージ保存機能を実装
fix: prism-react-rendererに切り替えてビルドエラーを解消

# ❌ 悪い例
update
fix bug
```

### ブランチ戦略
- 小規模プロジェクトはmainのみで十分
- 機能開発が並行したらfeatureブランチ

### 関連知識
- k013: Git authentication error in WSL

---
id: k027
title: Performance optimization patterns
date: 2025-06-21
tags: [pattern, performance, react, optimization]
versions:
  react: ">=18.0.0"
category: pattern
---

### パターン内容
パフォーマンス最適化のアプローチ

### 早すぎる最適化は避ける
1. まず動くものを作る
2. 実際に遅い部分を計測
3. 必要な箇所だけ最適化

### React特有の注意点
- useEffectの依存配列は正確に
- 不要な再レンダリングを避ける
- key属性を適切に設定

### 関連知識
- k020: Component design principles

---
id: k028
title: TypeScript utility patterns
date: 2025-06-21
tags: [pattern, typescript, utilities, type-guards]
versions:
  typescript: ">=5.0.0"
category: pattern
---

### パターン内容
TypeScript活用パターン

### 型ガード
```typescript
function isMemo(obj: unknown): obj is Memo {
  return typeof obj === 'object' && obj !== null && 
         'id' in obj && 'title' in obj;
}
```

### ユーティリティ型
```typescript
type MemoFormData = Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>;
```

### 関連知識
- k007: TypeScript generics best practices
- k021: React TypeScript best practices

---
id: k029
title: Documentation management patterns
date: 2025-06-21
tags: [pattern, documentation, knowledge, management]
category: pattern
---

### パターン内容
ドキュメント作成と知識管理のパターン

### 即座に記録する習慣
- エラーが発生したらすぐ記録
- 解決策が見つかったらすぐ記録
- 後回しにすると忘れる

### 構造化の重要性
- 問題・原因・解決・予防の4点セット
- 具体的なコード例を含める
- 日付を必ず記録

### 知識の蓄積方法
**即座に記録:**
- 問題が発生したら即座にメモ
- 解決したら詳細を記録
- 定期的に見直しとブラッシュアップ

**構造化:**
- カテゴリ別に整理
- 検索しやすいキーワードを含める
- 具体例とコードサンプルを含める

---
id: k030
title: Efficient development workflow
date: 2025-06-21
tags: [pattern, workflow, efficiency, tools]
category: pattern
---

### パターン内容
効率的な開発フローのパターン

### 並行作業の活用
```bash
# ✅ 複数のツールを同時実行
git status & git diff & git log --oneline -3
```

### ツール使用の最適化
- 関連するコマンドは並行実行
- ファイル読み込みもバッチで実行
- 検索操作は事前に戦略を立てる

### デバッグテクニック
**console.logの活用:**
```typescript
console.log('レンダリング:', { memos, isLoading });
```

**React Developer Tools:**
- コンポーネントツリーの確認
- Props/Stateの監視
- レンダリング回数の確認

---
id: k031
title: Claude Codeへの効果的な指示方法
date: 2025-06-22
tags: [claude-code, best-practice, workflow]
importance: high
---

### 学び
Claude Codeに依頼する際は、具体的なファイルパスと存在確認を含めることで、
意図しないファイル作成を防げる

### 問題
- 曖昧な指示で新規ファイルが作成される
- 既存ファイルの更新のつもりが重複作成

### 解決策
1. 明確なファイルパス指定
2. 存在確認の手順を含める
3. 更新前後の確認を明記

### 実践例
```
# 良い例
ls -la .ai/CLAUDE.md を確認してから
.ai/CLAUDE.md を更新してください

# 悪い例  
CLAUDE.mdを更新してください
```

### 効果
- ミスの削減
- 開発効率の向上
- AIとの意思疎通の改善

---

最終更新: 2025-06-22