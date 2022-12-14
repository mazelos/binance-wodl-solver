import type { NextApiRequest, NextApiResponse } from 'next';
import { filterData } from '@utils/glossary.utils';
import { getWords } from '../../../services/words.services';

export default async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
  const { count, validLetters, badLetters, convertWords } = req.query;

  if (
    typeof count !== 'string' ||
    typeof validLetters !== 'string' ||
    typeof badLetters !== 'string' ||
    typeof convertWords !== 'string' ||
    !['true', 'false'].includes(convertWords)
  ) {
    return res.status(400).json([]);
  }

  try {
    const words = await getWords();
    const filteredWords = filterData(words, parseInt(count, 10), validLetters, badLetters, convertWords === 'true');

    return res.status(200).json(filteredWords);
  } catch (error) {
    //eslint-disable-next-line no-console
    console.log('error', error);
    return res.status(500).json([]);
  }
}
