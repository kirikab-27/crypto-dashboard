# 技術的決定事項

このドキュメントは、プロジェクトの技術的な決定とその理由を記録します。

---
id: k002
title: prism-react-renderer solution
date: 2025-06-21
tags: [library, syntax-highlighting, vite]
versions:
  vite: ">=4.0.0"
  react: ">=18.0.0"
  prism-react-renderer: "^2.3.0"
category: solution
---

### 決定内容
prismjsからprism-react-rendererへの移行

### 変更履歴
1. 初期: prismjs → Viteビルドエラー（k001）
2. 最終: prism-react-renderer

### 決定理由
- Reactコンポーネントとして提供
- Viteとの完全な互換性
- TypeScript型定義が組み込み
- テーマのカスタマイズが容易

### 実装詳細
```typescript
import { Highlight, themes } from 'prism-react-renderer';
// VS Codeダークテーマを使用
theme={themes.vsDark}
```

### 関連知識
- k001: prismjs Vite build error
- k003: React + Vite互換性パターン

---
id: k003
title: React + Vite compatibility pattern
date: 2025-06-21
tags: [pattern, vite, react, compatibility]
versions:
  vite: ">=4.0.0"
  react: ">=18.0.0"
category: pattern
---

### パターン内容
ViteとReactでライブラリ選択時の互換性確認手順

### 適用条件
- Viteビルドツール使用
- React + TypeScript環境
- サードパーティライブラリ導入時

### 確認手順
1. ESモジュール対応の確認
2. TypeScript型定義の確認
3. Viteプラグインの必要性確認
4. ビルド結果の動作確認

### 関連知識
- k001: prismjs Vite build error
- k002: prism-react-renderer solution

---
id: k016
title: Vite build tool selection
date: 2025-06-21
tags: [build-tool, vite, performance]
versions:
  vite: ">=4.0.0"
category: decision
---

### 決定内容
ビルドツールとしてViteを選択

### 決定理由
- 高速なHMR (Hot Module Replacement)
- TypeScriptのネイティブサポート
- ゼロコンフィグで始められる
- 本番ビルドの最適化が優秀

### 考慮した代替案
- Create React App → メンテナンス停止
- Webpack → 設定が複雑
- Parcel → コミュニティが小さい

### 関連知識
- k003: React + Vite互換性パターン

---
id: k017
title: Tailwind CSS UI framework
date: 2025-06-21
tags: [ui, css, tailwind]
versions:
  tailwindcss: ">=3.0.0"
category: decision
---

### 決定内容
UIフレームワークとしてTailwind CSSを選択

### 決定理由
- ユーティリティファーストで開発速度向上
- ビルドサイズの最適化（未使用CSSの削除）
- レスポンシブデザインが簡単
- カスタマイズ性が高い

### 考慮した代替案
- CSS Modules → スタイルの再利用性が低い
- styled-components → ランタイムオーバーヘッド
- Material-UI → カスタマイズが困難

---
id: k018
title: marked.js markdown parser
date: 2025-06-21
tags: [markdown, parser, library]
versions:
  marked: ">=4.0.0"
category: decision
---

### 決定内容
マークダウンパーサーとしてmarked.jsを選択

### 決定理由
- 軽量で高速
- 拡張性が高い（カスタムレンダラー）
- 活発にメンテナンスされている
- TypeScriptサポート

### 実装方針
```typescript
// カスタムレンダラーでコードブロックを処理
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  // カスタム処理
};
```

### 関連知識
- k008: marked.js async type error

---
id: k005
title: WSL network configuration patterns
date: 2025-06-21
tags: [pattern, wsl, network, development]
versions:
  wsl: "2.0"
  vite: ">=4.0.0"
category: pattern
---

### パターン内容
WSL環境での開発サーバー設定パターン

### 適用条件
- WSL2環境での開発
- Viteまたは類似の開発サーバー使用

### 設定内容
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',  // WSL環境でのアクセス許可
    port: 5173
  }
})
```

### 関連知識
- k004: WSL localhost access issue

---
id: k007
title: TypeScript generics best practices
date: 2025-06-21
tags: [pattern, typescript, generics, best-practices]
versions:
  typescript: ">=5.0.0"
category: pattern
---

### パターン内容
TypeScriptジェネリクス使用時のベストプラクティス

### 適用条件
- カスタムフック作成時
- 型の再利用が必要な場合

### ベストプラクティス
1. 明示的な型指定を優先
2. 制約（constraints）を適切に設定
3. デフォルト型パラメータの活用
4. 型推論に頼りすぎない

### 実装例
```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 明示的な型指定で型安全性を確保
}
```

### 関連知識
- k006: TypeScript generic type inference error

---
id: k019
title: LocalStorage data persistence
date: 2025-06-21
tags: [persistence, localstorage, pattern]
versions:
  react: ">=18.0.0"
category: decision
---

### 決定内容
データ永続化としてLocalStorageを選択

### 決定理由
- ブラウザ標準API
- 実装がシンプル
- 5-10MBの容量で十分
- オフライン対応

### 実装方針
- カスタムフックで抽象化
- エラーハンドリングを徹底
- 型安全性を確保

### 将来の拡張性
- 必要に応じてIndexedDBへ移行可能
- サーバーサイド永続化との統合

---
id: k020
title: Component design principles
date: 2025-06-21
tags: [pattern, components, react, architecture]
versions:
  react: ">=18.0.0"
category: pattern
---

### パターン内容
Reactコンポーネント設計の原則

### 設計方針
**単一責任の原則:**
- 各コンポーネントは一つの責任のみ
- 疎結合で再利用性を高める

**Props設計:**
- コールバック関数で親子通信
- 型定義を明確に
- オプショナルプロパティは最小限

### 実装パターン
```typescript
interface ComponentProps {
  data: EntityType[];
  onAction: (id: string) => void;
  className?: string; // オプショナルは最小限
}
```

---

最終更新: 2025-06-21