import { FormEvent } from 'react';
import { classNames } from '@utils/tailwind.utils';

export default function Button({
  onClick,
  type = 'default',
  action,
  fullWidth = false,
  style,
  children,
}: {
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
  type?: 'default' | 'clear';
  action?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  style?: string;
  children: JSX.Element | string;
}): JSX.Element {
  return (
    <button
      type={action || 'button'}
      className={classNames(
        'relative flex justify-center items-center px-4 py-2 text-sm font-medium border rounded-md group',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        type === 'default'
          ? 'text-white bg-indigo-600 border-transparent  hover:bg-indigo-700'
          : 'text-indigo-700 bg-white border-indigo-700 hover:bg-indigo-700 hover:text-white',
        fullWidth ? 'w-full' : 'w-auto',
        style || ''
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
