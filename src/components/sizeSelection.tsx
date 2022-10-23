import { RadioGroup } from '@headlessui/react';
import { classNames } from '@utils/tailwind.utils';

const sizes = [3, 4, 5, 6, 7, 8];

export default function SizeSelector({
  size,
  setSize,
}: {
  size: number;
  setSize: (size: number) => void;
}): JSX.Element {
  return (
    <div>
      <div className="flex items-center justify-start">
        <h2 className="text-sm font-medium text-gray-900">Select word length</h2>
      </div>

      <RadioGroup value={size} onChange={setSize} className="mt-2">
        <RadioGroup.Label className="sr-only"> Choose the number of letters of the Wodl </RadioGroup.Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {sizes.map(option => (
            <RadioGroup.Option
              key={option}
              value={option}
              className={({ active, checked }) =>
                classNames(
                  'cursor-pointer focus:outline-none',
                  active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                  checked
                    ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                  'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
                )
              }
            >
              <RadioGroup.Label as="span">{option}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
