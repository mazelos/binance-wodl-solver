import { FormEvent, FC, ReactNode } from 'react';
import { classNames } from '@utils/tailwind.utils';

const TextInput: FC<{
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
  name: string;
  children?: ReactNode;
  style?: string;
}> = ({ onChange, value, placeholder, name, style, children }): JSX.Element => {
  return (
    <div className={classNames('flex flex-col flex-grow', style || '')}>
      <label className="text-sm">{children}</label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type="text"
        className="flex-grow px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default TextInput;
