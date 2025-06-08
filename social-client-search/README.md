# Social Client Search

This example demonstrates a small Node.js web app that searches for potential clients on Facebook, Instagram and Twitter.
It uses Meta's Graph API and Twitter's v2 API. You must supply your own API tokens.

## Quick start

Install dependencies with `pnpm install` (requires [pnpm](https://pnpm.io)).

Run the server:

```bash
FACEBOOK_ACCESS_TOKEN=<fb-token> \
TWITTER_BEARER_TOKEN=<twitter-token> \
pnpm start
```

Open <http://localhost:3000> in your browser and enter a search query.

You can still run the CLI script for Facebook and Instagram only:

```bash
FACEBOOK_ACCESS_TOKEN=<token> node client-search.js "search query"
```
