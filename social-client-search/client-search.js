#!/usr/bin/env node
// Простая утилита для поиска клиентов в Facebook и Instagram
// Требуется действительный токен доступа в переменной окружения FACEBOOK_ACCESS_TOKEN

const token = process.env.FACEBOOK_ACCESS_TOKEN;
if (!token) {
  console.error("FACEBOOK_ACCESS_TOKEN environment variable not set");
  process.exit(1);
}

const query = process.argv[2];
if (!query) {
  console.error('Usage: node client-search.js "search query"');
  process.exit(1);
}

// Поиск публичных страниц Facebook
async function searchFacebookPages(search) {
  const url = `https://graph.facebook.com/v19.0/search?type=page&q=${encodeURIComponent(search)}&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Facebook API error: ${res.status}`);
  }
  const data = await res.json();
  return data.data || [];
}

// Поиск хэштегов Instagram
async function searchInstagramHashtags(search) {
  const url = `https://graph.facebook.com/v19.0/ig_hashtag_search?q=${encodeURIComponent(search)}&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Instagram API error: ${res.status}`);
  }
  const data = await res.json();
  return data.data || [];
}

(async () => {
  // Основной поток выполнения
  try {
    const [pages, hashtags] = await Promise.all([
      searchFacebookPages(query),
      searchInstagramHashtags(query),
    ]);

    console.log("Matching Facebook pages:");
    for (const page of pages) {
      console.log(`- ${page.name} (ID: ${page.id})`);
    }

    console.log("\nMatching Instagram hashtags:");
    for (const tag of hashtags) {
      console.log(`- ${tag.name} (ID: ${tag.id})`);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
