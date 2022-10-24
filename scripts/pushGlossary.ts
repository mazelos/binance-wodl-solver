import oldGlossary from '../src/data/oldGlossary.json';
import { addWords } from '../src/services/words.services';

const main = async () => {
  const glossary = Object.keys(oldGlossary).reduce((acc: string[], curr) => {
    // eslint-disable-next-line
    // @ts-ignore
    return [...acc, ...oldGlossary[curr].map(item => item.title.toLowerCase()).sort((a, b) => a.localeCompare(b))];
  }, []);

  await addWords(glossary);
};

main();
