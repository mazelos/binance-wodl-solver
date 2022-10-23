import { FormEvent, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import axios from 'axios';
import Image from 'next/image';
import BinanceLogo from '@assets/binance.png';
import SizeSelector from '@components/sizeSelection';
import WordsList from '@components/wordList';

const fetchWords = async (
  count: number,
  validLetters: string,
  badLetters: string,
  convertWords: boolean
): Promise<string[]> => {
  try {
    const { data } = await axios.get('/api/words', { params: { count, validLetters, badLetters, convertWords } });
    return data;
  } catch (error) {
    return [];
  }
};

const Home: NextPage = () => {
  const [count, setCount] = useState(5);
  const [validLetters, setValidLetters] = useState('');
  const [badLetters, setBadLetters] = useState('');
  const [convertWords, setConvertWords] = useState(false);
  const [submitFired, setSubmitFired] = useState(false);
  // const [newWords, setNewWords] = useState('');
  // const [words, setWords] = useState<string[]>([]);

  const { data: words, refetch: refetchWords } = useQuery(
    ['get-words', count, validLetters, badLetters, convertWords],
    () => fetchWords(count, validLetters, badLetters, convertWords),
    {
      refetchOnWindowFocus: false,
      enabled: submitFired,
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitFired(true);
    refetchWords();
  };

  const handleCountChange = (value: number) => {
    setCount(value || 0);
    setValidLetters(l => (value ? l.slice(0, value) : ''));
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    switch (name) {
      case 'valid-letters':
        setValidLetters(value ? value.toLowerCase() : '');
        break;
      case 'bad-letters':
        setBadLetters(value ? value.toLowerCase() : '');
        break;
      case 'convert-words':
        setConvertWords(currVal => !currVal);
        break;
      // case 'new-words':
      //   setNewWords(value || '');
      //   break;
      default:
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Wodl Solver</title>
        <meta name="description" content="Wodl solver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Image className="h-12 w-auto" src={BinanceLogo} alt="Your Company" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Wodl Solver</h2>
            <p className="mt-2 text-sm text-gray-600">Search potential crypto words to solve your WODL</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="">
              <div className="mb-8">
                <SizeSelector size={count} setSize={handleCountChange} />
              </div>

              <div>
                <label id="valid-letters" className="text-sm">
                  Found letters ✔
                </label>
                <p></p>
                <input
                  type="text"
                  id="valid-letters"
                  name="valid-letters"
                  placeholder="Enter found letters"
                  value={validLetters}
                  onChange={handleChange}
                  className="mb-8 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label id="bad-letters" className="text-sm">
                  Invalid letters ✖
                </label>
                <input
                  type="text"
                  id="bad-letters"
                  name="bad-letters"
                  placeholder="Enter invalid letters"
                  value={badLetters}
                  onChange={handleChange}
                  className="mb-8 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="convert-words"
                  name="convert-words"
                  onChange={handleChange}
                  checked={convertWords}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Convert plurals to singular and vice versa?
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >{`Search ${count} character words`}</button>
            </div>
          </form>
        </div>
        <div className="mt-8">
          <WordsList words={words} />
        </div>
      </div>
    </>
  );
};

export default Home;
