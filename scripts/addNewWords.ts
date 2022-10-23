import { writeFileSync } from 'fs';
import data from '../src/data/glossary.json';

type Glossary = Record<string, string[]>;
const newData: Glossary = { ...data };

const words = process.argv
  .slice(2)
  .map(w => w.replace(',', ' ').trim().toLowerCase())
  .join(' ')
  .split(' ');

// group them by letter
const newWords = words.reduce((acc: Glossary, curr) => {
  const key = /^[a-z]/i.test(curr[0]) ? curr[0].toLowerCase() : '#';
  if (!acc[key]) acc[key] = [];
  acc[key].push(curr);
  return acc;
}, {});

// merge them and sort alphabetically
Object.keys(newWords).forEach(key => {
  if (!newData[key]) newData[key] = [];
  // eslint-disable-next-line
  // @ts-ignore
  newData[key] = [...new Set([...newData[key], ...newWords[key]])];
  //order alphabetically
  newData[key].sort((a, b) => a.localeCompare(b));
});
// write to file and update glossary
writeFileSync('data/glossary.json', JSON.stringify(newData, null, 2));
