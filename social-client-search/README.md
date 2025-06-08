# Social Client Search

This example demonstrates a small Node.js web app that searches for potential clients on Facebook, Instagram and Twitter.
It uses Meta's Graph API and Twitter's v2 API. You must supply your own API tokens.
Пример ожидает файл `.env` с вашими токенами. Скопируйте `.env.example` и заполните значения.

## Quick start

Install dependencies with `pnpm install` (requires [pnpm](https://pnpm.io)).

Run the server:

```bash
cp .env.example .env # fill in your tokens
pnpm start
```

Open <http://localhost:3000> in your browser and enter a search query.

You can still run the CLI script for Facebook and Instagram only:

```bash
FACEBOOK_ACCESS_TOKEN=<token> node client-search.js "search query"
```

Для корректной работы нужны действующие токены от Meta и Twitter.
