import type { NextApiRequest, NextApiResponse } from 'next';
import { filterData } from '@utils/glossary.utils';

export default function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
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
  res.status(200).json(filterData(Number(count), validLetters, badLetters, convertWords === 'true'));
}
