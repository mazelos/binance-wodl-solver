import { writeFileSync } from 'fs';
import oldGlossary from '../src/data/oldGlossary.json';

console.log('Converting old glossary to new format...');

const glossary = Object.keys(oldGlossary).reduce((acc, curr) => {
  // eslint-disable-next-line
  // @ts-ignore
  return { ...acc, [curr]: oldGlossary[curr].map(item => item.title.toLowerCase()).sort((a, b) => a.localeCompare(b)) };
}, {});

console.log('Writing new glossary to file...');

writeFileSync('./data/glossary.json', JSON.stringify(glossary, null, 2));
