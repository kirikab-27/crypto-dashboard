# 🚀 Crypto Dashboard

リアルタイムで仮想通貨の価格を監視するダッシュボードアプリケーション

![Crypto Dashboard](./screenshots/main.png)

## ✨ 特徴

- **リアルタイム価格更新**: 30秒ごとに自動更新
- **TOP 8 仮想通貨**: BTC, ETH, USDT, XRP, BNB, SOL, USDC, TRONを表示
- **詳細情報**: 24時間変動率、高値・安値、時価総額
- **インタラクティブチャート**: 1H, 24H, 7D, 30Dの価格チャート
- **ポートフォリオ管理**: 保有通貨の追加・削除・損益計算
- **美しいUI**: ダークモードのプロフェッショナルなデザイン
- **レスポンシブ対応**: モバイル、タブレット、デスクトップ完全対応

## 🛠️ 技術スタック

- **Frontend**: React + TypeScript
- **スタイリング**: Tailwind CSS + CSS Modules
- **チャート**: Chart.js
- **API**: CoinGecko API
- **状態管理**: React Hooks (useState, useEffect)
- **ローカルストレージ**: Portfolio永続化
- **ビルドツール**: Vite

## 🚀 セットアップ

```bash
# クローン
git clone https://github.com/kirikab-27/crypto-dashboard.git
cd crypto-dashboard

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## 📊 機能ロードマップ

### Phase 1 (完了) ✅
- 基本的な価格表示
- リアルタイム更新
- レスポンシブデザイン

### Phase 2 (完了) ✅
- インタラクティブ価格チャート (1H, 24H, 7D, 30D)
- 通貨詳細情報表示
- チャート操作機能

### Phase 3 (完了) ✅
- ポートフォリオ管理機能
- 保有通貨の追加・削除
- リアルタイム損益計算
- ポートフォリオ永続化

### Phase 4 (将来)
- [ ] 価格アラート機能
- [ ] テクニカル指標
- [ ] 検索・フィルター機能
- [ ] 通貨比較機能

## 🏗️ プロジェクト構造

```
crypto-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx              # メインダッシュボード
│   │   ├── PriceCard.tsx             # 価格表示カード
│   │   ├── Portfolio.tsx             # ポートフォリオ管理
│   │   └── AddToPortfolioModal.tsx   # 通貨追加モーダル
│   ├── services/
│   │   ├── coinGeckoApi.ts           # 価格・チャートAPI
│   │   └── portfolioService.ts       # ポートフォリオ永続化
│   ├── hooks/
│   │   ├── useCryptoData.ts          # 価格データフェッチング
│   │   └── usePortfolio.ts           # ポートフォリオ状態管理
│   └── types/
│       ├── crypto.ts                 # 仮想通貨型定義
│       └── portfolio.ts              # ポートフォリオ型定義
├── public/
└── README.md
```

## 📝 開発について

このプロジェクトは [vibe-coding-template v2.2.0](https://github.com/kirikab-27/vibe-coding-template) を使用して開発されました。

### 開発時間
- Phase 1: 約30分 (基本価格表示)
- Phase 2: 約45分 (インタラクティブチャート)
- Phase 3: 約60分 (ポートフォリオ管理)
- 知識ベースの活用により高速開発を実現

## 📸 スクリーンショット

### メイン画面
![Dashboard](./screenshots/dashboard.png)

### モバイル表示
![Mobile View](./screenshots/mobile.png)

## 🤝 貢献

Issue、Pull Requestを歓迎します！

## 📄 ライセンス

MIT License

## 🙏 謝辞

- [CoinGecko API](https://www.coingecko.com/api) - 価格データ提供
- [vibe-coding-template](https://github.com/kirikab-27/vibe-coding-template) - 開発効率化