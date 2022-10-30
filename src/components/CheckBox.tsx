import { classNames } from '@utils/tailwind.utils';
import { FormEvent } from 'react';

export default function Checkbox({
  handleChange,
  isChecked,
  style,
}: {
  handleChange: (e: FormEvent<HTMLInputElement>) => void;
  isChecked: boolean;
  style?: string;
}): JSX.Element {
  return (
    <div className={classNames('flex items-center', style || '')}>
      <input
        type="checkbox"
        id="convert-words"
        name="convert-words"
        onChange={handleChange}
        checked={isChecked}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
        Convert plurals to singular and vice versa?
      </label>
    </div>
  );
}
