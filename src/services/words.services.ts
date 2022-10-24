import PrismaManager from '../managers/prisma.manager';

const prisma = PrismaManager.getInstance().client;

export const getWords = async (count: number, validLetters: string, badLetters: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const condition: Record<string, any[]> = { AND: [{ length: { gte: count - 2 } }, { length: { lte: count + 2 } }] };
  if (validLetters) condition.AND.push(...validLetters.split('').map((c: string) => ({ word: { contains: c } })));
  if (badLetters) condition.AND.push(...badLetters.split('').map((c: string) => ({ word: { not: { contains: c } } })));

  return prisma.words.findMany({ where: condition });
};

export const addWords = async (words: string[]) => {
  return prisma.words.createMany({
    data: words.map(word => ({ word, length: word.length })),
    skipDuplicates: true,
  });
};
