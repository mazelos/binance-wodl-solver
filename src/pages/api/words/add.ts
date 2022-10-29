import type { NextApiRequest, NextApiResponse } from 'next';
import { addWords } from '../../../services/words.services';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ ok: boolean }>) {
  const { words }: { words: string[] } = req.body;

  if (!words?.length) {
    return res.status(400).json({ ok: false });
  }

  try {
    const wordsRes = await addWords(words);
    if (!wordsRes) throw new Error('Error adding words');
    return res.status(200).json({ ok: true });
  } catch (error) {
    //eslint-disable-next-line no-console
    console.log('error', error);
    return res.status(500).json({ ok: false });
  }
}
