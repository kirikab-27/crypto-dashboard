# 🚀 Crypto Dashboard

リアルタイムで仮想通貨の価格を監視するダッシュボードアプリケーション

![Crypto Dashboard](./screenshots/main.png)

## ✨ 特徴

- **リアルタイム価格更新**: 30秒ごとに自動更新
- **TOP 8 仮想通貨**: BTC, ETH, USDT, XRP, BNB, SOL, USDC, TRONを表示
- **詳細情報**: 24時間変動率、高値・安値、時価総額
- **美しいUI**: ダークモードのプロフェッショナルなデザイン
- **レスポンシブ対応**: モバイル、タブレット、デスクトップ完全対応

## 🛠️ 技術スタック

- **Frontend**: React + TypeScript
- **スタイリング**: Tailwind CSS
- **API**: CoinGecko API
- **状態管理**: React Hooks (useState, useEffect)
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

### Phase 2 (計画中)
- [ ] 価格チャート (1H, 24H, 7D, 30D)
- [ ] 通貨比較機能
- [ ] 検索・フィルター機能

### Phase 3 (将来)
- [ ] ポートフォリオ管理
- [ ] 価格アラート
- [ ] テクニカル指標

## 🏗️ プロジェクト構造

```
crypto-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx    # メインダッシュボード
│   │   └── PriceCard.tsx    # 価格表示カード
│   ├── services/
│   │   └── coinGeckoApi.ts  # API通信
│   ├── hooks/
│   │   └── useCryptoData.ts # データフェッチング
│   └── types/
│       └── crypto.ts        # 型定義
├── public/
└── README.md
```

## 📝 開発について

このプロジェクトは [vibe-coding-template v2.2.0](https://github.com/kirikab-27/vibe-coding-template) を使用して開発されました。

### 開発時間
- Phase 1: 約30分
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