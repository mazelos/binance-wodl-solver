import dotenv from 'dotenv';
import Redis from 'ioredis';
import data from '../data/glossary.json';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

const getWords = async () => {
  const res = await redis.get('words');
  if (!res) return [];
  return JSON.parse(res);
};

const addWords = async (words: string[]) => {
  return redis.set('words', JSON.stringify(words));
};

const main = async () => {
  const glossary = Object.keys(data).reduce((acc: string[], curr) => {
    // eslint-disable-next-line
    // @ts-ignore
    return [...acc, ...data[curr].reduce((acc, curr) => [...acc, ...curr.toLowerCase().split(' ')], [])];
  }, []);

  const oldWords = await getWords();
  console.log(`${oldWords.length} words already in Redis (${process.env?.REDIS_HOST})`);
  // merging old and new words removing duplicates and sorting
  const words = Array.from(new Set([...oldWords, ...glossary])).sort((a, b) => a.localeCompare(b));

  console.log(`${words.length - oldWords.length} new words ready to be added`);
  console.log(`Pushing new words to Redis...`);
  await addWords(words);
};

main();
