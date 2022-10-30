import data from '../data/glossary.json';
import { addWords } from '../src/services/words.services';

const main = async () => {
  const glossary = Object.keys(data).reduce((acc: string[], curr) => {
    // eslint-disable-next-line
    // @ts-ignore
    return [...acc, ...data[curr].reduce((acc, curr) => [...acc, ...curr.toLowerCase().split(' ')], [])];
  }, []);
  console.log('pushing glossary...', glossary.length);
  await addWords(glossary.sort((a, b) => a.localeCompare(b)));
};

main();
