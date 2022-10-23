// import { writeFile } from 'fs';
import data from '@data/glossary.json';

type Glossary = Record<string, string[]>;

const glossary: Glossary = data;

const checkWordIsValid = (word: string, count: number, validLetters: string, badLetters: string) => {
  if (word.length !== count) return false;
  if (!/^[a-zA-Z]+$/.test(word)) return false;

  for (let i = 0; i < badLetters.length; i++) {
    if (word.includes(badLetters[i])) return false;
  }
  for (let i = 0; i < validLetters.length; i++) {
    if (!word.includes(validLetters[i])) return false;
  }
  return true;
};

const convertWord = (word: string) => {
  // transform plurals to singular and vice versa
  // singular to plural
  if (/^[a-z]+ss$/.test(word)) {
    return word + 'es';
  }
  if (!/^[a-z]+s$/.test(word)) {
    return word + 's';
  }
  // plural to singular
  if (/^[a-z]+es$/.test(word)) {
    return word.slice(0, -2);
  }
  if (/^[a-z]+s$/.test(word)) {
    return word.slice(0, -1);
  }
  return null;
};

export const filterData = (
  count: number,
  validLetters: string,
  badLetters: string,
  includeConvertedWords?: boolean
) => {
  if (!count) return [];
  const all: Record<string, string> = {};

  Object.values(glossary).forEach(d =>
    d.forEach(a => {
      const title = a.replace(/[^a-z0-9 -]/gi, '').toLowerCase();

      if (checkWordIsValid(title, count, validLetters, badLetters)) {
        all[title] = title;
      }

      a.toLowerCase()
        .split(' ')
        .forEach(word => {
          if (word.match(/-/i)) {
            word.split('-').forEach(w => {
              if (checkWordIsValid(w, count, validLetters, badLetters)) {
                all[w] = w;
              }
            });
          }
          if (checkWordIsValid(word, count, validLetters, badLetters)) {
            all[word] = word;
          }
          if (includeConvertedWords) {
            const convertedWord = convertWord(word);
            if (convertedWord && checkWordIsValid(convertedWord, count, validLetters, badLetters)) {
              all[convertedWord] = convertedWord;
            }
          }
        });
      const moreWords = title.split(' ').filter(d => checkWordIsValid(d, count, validLetters, badLetters));
      moreWords.forEach(mw => (all[mw] = mw));
    })
  );

  return Object.values(all);
};
