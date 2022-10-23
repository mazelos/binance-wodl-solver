import { useMemo } from 'react';
import { classNames } from '@utils/tailwind.utils';

export default function LettersInput({
  letters,
  handleChange,
  wordLength,
}: {
  letters: string;
  handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
  wordLength: number;
}): JSX.Element {
  const lettersArray = useMemo(() => {
    const lettersArray = [];
    for (let i = 0; i < wordLength; i++) {
      lettersArray.push(letters[i] || '');
    }
    return lettersArray;
  }, [letters, wordLength]);

  return (
    <div>
      <div className="flex items-center justify-start">
        <h2 className="text-sm font-medium text-gray-900">Select word length</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {lettersArray.map((letter, i) => (
          <input
            key={i}
            className={classNames(
              'cursor-pointer focus:outline-none',
              'ring-2 ring-offset-2 ring-indigo-500',
              'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
              'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
            )}
            type="text"
            value={letter}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}
