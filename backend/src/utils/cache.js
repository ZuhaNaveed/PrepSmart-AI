const inMemoryCache = new Map();
const expiryTimers = new Map();

const getCache = async (key) => {
  const entry = inMemoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    await deleteCache(key);
    return null;
  }

  return entry.value;
};

const setCache = async (key, value, durationInSeconds = 3600) => {
  inMemoryCache.set(key, {
    value,
    expiresAt: Date.now() + durationInSeconds * 1000,
  });

  if (expiryTimers.has(key)) {
    clearTimeout(expiryTimers.get(key));
  }

  const timer = setTimeout(() => {
    inMemoryCache.delete(key);
    expiryTimers.delete(key);
  }, durationInSeconds * 1000);

  expiryTimers.set(key, timer);
};

const deleteCache = async (key) => {
  inMemoryCache.delete(key);

  if (expiryTimers.has(key)) {
    clearTimeout(expiryTimers.get(key));
    expiryTimers.delete(key);
  }
};

const clearCacheByPrefix = async (prefix) => {
  for (const key of [...inMemoryCache.keys()]) {
    if (key.startsWith(prefix)) {
      await deleteCache(key);
    }
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  clearCacheByPrefix,
};
