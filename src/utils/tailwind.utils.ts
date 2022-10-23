export const classNames = (...classes: string[]): string => {
  return (classes as string[]).filter(Boolean).join(' ');
};
