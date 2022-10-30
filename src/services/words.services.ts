import redis from '@managers/redis.manager';

export const getWords = async () => {
  const res = await redis.get('words');
  if (!res) return [];
  return JSON.parse(res);
};

export const addWords = async (newWords: string[]) => {
  const oldWords = await getWords();
  const words = Array.from(new Set([...oldWords, ...newWords]));
  return redis.set('words', JSON.stringify(words.sort((a, b) => a.localeCompare(b))));
};
