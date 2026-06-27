# Kosuke Okude Photography Portfolio

写真家 KOSUKE OKUDE のポートフォリオサイト。Astro をベースにしたフロントエンドと、コンテンツ管理用の Sanity Studio（`photo-portfolio-cms/`）の2つのプロジェクトで構成されています。

## 技術スタック

- **フロントエンド**: [Astro](https://astro.build) 5 / React 19 / Tailwind CSS v4
- **アニメーション**: GSAP / Lenis（スムーススクロール）
- **CMS**: [Sanity](https://www.sanity.io)（`photo-portfolio-cms/` に同梱、別プロジェクトとして起動が必要）
- **お問い合わせフォーム**: [Resend](https://resend.com)
- **デプロイ**: [Vercel](https://vercel.com)（`@astrojs/vercel` アダプタ使用）

## プロジェクト構成

```text
/
├── src/
│   ├── pages/          # ルーティング（index, works, gallery, about, news, contact）
│   ├── components/     # セクション・UIコンポーネント（Entrance, Hero, Works, Gallery, About, News, Contact など）
│   ├── sanity/         # Sanityクライアント・クエリ（client.ts, site-settings.ts など）
│   ├── data/           # 静的データ・型定義
│   ├── gsap/           # GSAPアニメーションのプリセット
│   ├── layouts/        # 共通レイアウト
│   └── utils/          # ユーティリティ関数
├── photo-portfolio-cms/  # Sanity Studio（独立したNode.jsプロジェクト）
└── astro.config.mjs
```

## セットアップ

このリポジトリは **フロントエンド** と **Sanity Studio** で `node_modules` が分かれているため、それぞれ個別にインストールします。

```sh
# フロントエンド（リポジトリルート）
npm install

# Sanity Studio
cd photo-portfolio-cms
npm install
```

### Node.js バージョンについて

Sanity Studio は Node.js `>=20.19.1 <22` または `>=22.12` を要求します。`nodebrew` / `nvm` などのバージョン管理ツールで対応バージョンに切り替えてから実行してください。

```sh
# nodebrew の場合の例
nodebrew install v22.23.1
nodebrew use v22.23.1
```

## 環境変数

リポジトリルートに `.env` を作成し、以下のキーを設定します（値は各サービスのダッシュボードから取得）。

```env
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

| 変数名 | 用途 |
| :--- | :--- |
| `PUBLIC_SANITY_PROJECT_ID` | Sanityプロジェクトの参照に使用 |
| `PUBLIC_SANITY_DATASET` | 参照するデータセット名（通常 `production`） |
| `SANITY_API_TOKEN` | Sanity APIへの書き込み・プレビュー用トークン |
| `RESEND_API_KEY` | お問い合わせフォーム送信（Resend）用APIキー |
| `CONTACT_TO_EMAIL` | お問い合わせフォームの送信先メールアドレス |

## コマンド

### フロントエンド（リポジトリルート）

| コマンド | 内容 |
| :--- | :--- |
| `npm run dev` | 開発サーバー起動（`localhost:4321`） |
| `npm run build` | 本番ビルド（`./dist/`） |
| `npm run preview` | ビルド後のプレビュー |

### Sanity Studio（`photo-portfolio-cms/`）

| コマンド | 内容 |
| :--- | :--- |
| `npm run dev` | Studio開発サーバー起動（`localhost:3333`） |
| `npm run build` | Studioのビルド |
| `npm run deploy` | SanityのホストへStudioをデプロイ |

## コンテンツ管理（Sanity）

トップページに表示するWorks・Galleryカテゴリ・About文言・News記事・エントランスのフィルム画像・ヒーロー背景動画などは、Sanity Studioの「トップページ設定」（`siteSettings`）ドキュメントから管理できます。クライアントが直接更新できるよう、画像・動画・テキストの差し替えはすべてStudio上から行える設計です。

#### ヒーロー背景動画の推奨サイズ

| | 解像度 | 形式 | ファイルサイズ |
| :--- | :--- | :--- | :--- |
| PC用（必須） | 1920×1080px（16:9） | MP4（H.264） | 10MB以内を推奨 |
| モバイル用（任意） | 1280×720px（16:9） | MP4（H.264） | 8MB以内を推奨 |

- モバイル用が未設定の場合、スマホでもPC用動画が使用されます
- ポスター画像（読み込み中に表示する静止画）は任意。設定する場合は1920×1080px推奨

## デプロイ

Vercel上にデプロイします。環境変数はVercelのプロジェクト設定にも同様に登録してください。
