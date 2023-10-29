import express from 'express';
import { summaly } from 'summaly';
import cors from 'cors';

const app = express();
app.listen(process.env.PORT, () => console.log(`Server running`));

// cors from environment variable
const corsValiable = process.env.CORS || '*';
app.use(cors({ origin: corsValiable }));

const cache = new Map();
const cacheTTL = 1000 * 60 * 60 * 24; // 1 day
const cacheCleanUpInterval = 1000 * 60 * 5; // 5 minutes

const isCacheExpired = (timestamp) => {
  return Date.now() > timestamp + cacheTTL;
};

app.get("/", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'url query is required' });

  try {
    const cachedEntry = cache.get(url);

    if (cachedEntry && !isCacheExpired(cachedEntry.timestamp)) {
      console.log(`cache-hit: ${url}`)
      res.json(cache.get(url).data);
    } else {
      console.log(`cache-miss: ${url}`)
      const result = await summaly(url);
      cache.set(url, {
        timestamp: Date.now(),
        data: result,
      });
      res.json(result);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const cleanUpCache = () => {
  for (const [url, { timestamp }] of cache.entries()) {
    if (isCacheExpired(timestamp)) {
      console.log(`Removing expired cache for URL: ${url}`);
      cache.delete(url);
    }
  }
  console.log('Cache clean up done.');
};

setInterval(cleanUpCache, cacheCleanUpInterval);

