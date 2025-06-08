import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Небольшой веб-сервер для поиска клиентов

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Токены API берутся из переменных окружения
const fbToken = process.env.FACEBOOK_ACCESS_TOKEN;
const igToken = process.env.INSTAGRAM_ACCESS_TOKEN || fbToken; // Instagram может использовать тот же токен Meta
const twToken = process.env.TWITTER_BEARER_TOKEN;

if (!fbToken) {
  console.warn('FACEBOOK_ACCESS_TOKEN not set');
}
if (!igToken) {
  console.warn('INSTAGRAM_ACCESS_TOKEN not set');
}
if (!twToken) {
  console.warn('TWITTER_BEARER_TOKEN not set');
}

app.use(express.static(__dirname));

// Маршрут API для выполнения поиска во всех сетях
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'query required' });

  const results = {};

  if (fbToken) {
    try {
      const [pages, hashtags] = await Promise.all([
        fetch(
          `https://graph.facebook.com/v19.0/search?type=page&q=${encodeURIComponent(
            query
          )}&access_token=${fbToken}`
        ).then((r) => r.json()),
        fetch(
          `https://graph.facebook.com/v19.0/ig_hashtag_search?q=${encodeURIComponent(
            query
          )}&access_token=${igToken}`
        ).then((r) => r.json()),
      ]);
      results['Facebook Pages'] = (pages.data || []).map(
        (p) => `${p.name} (ID: ${p.id})`
      );
      results['Instagram Hashtags'] = (hashtags.data || []).map(
        (t) => `#${t.name} (ID: ${t.id})`
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (twToken) {
    try {
      const twRes = await fetch(
        `https://api.twitter.com/2/users/by?usernames=${encodeURIComponent(
          query
        )}`,
        {
          headers: { Authorization: `Bearer ${twToken}` },
        }
      ).then((r) => r.json());
      results['Twitter Users'] = (twRes.data || []).map(
        (u) => `${u.name} (@${u.username})`
      );
    } catch (err) {
      console.error(err);
    }
  }

  res.json(results);
});

// Сервер по умолчанию слушает порт 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
