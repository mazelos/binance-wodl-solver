import type { Words } from '@prisma/client';

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
  words: Words[],
  count: number,
  validLetters: string,
  badLetters: string,
  includeConvertedWords: boolean
) => {
  if (!count) return [];
  const all: Record<string, string> = {};

  words.forEach(word => {
    const title = word.word.replace(/[^a-z0-9 -]/gi, '').toLowerCase();
    if (checkWordIsValid(title, count, validLetters, badLetters)) {
      all[title] = title;
    }
    title
      .split(' ')
      .filter(d => checkWordIsValid(d, count, validLetters, badLetters))
      .forEach(w => (all[w] = w));

    word.word
      .toLowerCase()
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
  });

  return Object.values(all);
};
