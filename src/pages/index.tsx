import { FormEvent, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import axios from 'axios';
import Image from 'next/image';
import BinanceLogo from '@assets/binance.png';
import SizeSelector from '@components/sizeSelection';
import WordsList from '@components/wordList';
import Notification from '@components/notification';

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

const submitNewWords = async (newWordsRaw: string) => {
  try {
    await axios.post('/api/words/add', {
      words: newWordsRaw
        .replaceAll(',', ' ')
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(w => w.length),
    });
  } catch (error) {
    return;
  }
};

const Home: NextPage = () => {
  const [count, setCount] = useState(5);
  const [validLetters, setValidLetters] = useState('');
  const [badLetters, setBadLetters] = useState('');
  const [convertWords, setConvertWords] = useState(false);
  const [submitFired, setSubmitFired] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [newWords, setNewWords] = useState('');
  // const [words, setWords] = useState<string[]>([]);

  const {
    data: words,
    refetch: refetchWords,
    isLoading: wordsLoading,
  } = useQuery(
    ['get-words', count, validLetters, badLetters, convertWords],
    () => fetchWords(count, validLetters, badLetters, convertWords),
    {
      refetchOnWindowFocus: false,
      enabled: submitFired,
    }
  );

  const { refetch: refetchSubmitNewWords, isLoading: submintNewWordsLoading } = useQuery(
    ['submit-new-words'],
    () => submitNewWords(newWords),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log('submit');
    e.preventDefault();
    setSubmitFired(true);
    refetchWords();
  };

  const handleSubmitNewWords = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newWords?.length) return;
    refetchSubmitNewWords();
    setNewWords('');
    setNotification('Words submitted successfully!');
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
      case 'new-words':
        setNewWords(value || '');
        break;
      default:
        break;
    }
  };

  const clearInputs = () => {
    setValidLetters('');
    setBadLetters('');
    setConvertWords(false);
  };

  return (
    <>
      <Head>
        <title>Wodl Solver</title>
        <meta name="description" content="Wodl solver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Notification message={notification || ''} show={!!notification} setShow={setNotification} />

      <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Image className="w-auto h-12" src={BinanceLogo} alt="Your Company" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Wodl Solver</h2>
            <p className="mt-2 text-sm text-gray-600">Search potential crypto words to solve your WODL</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} onReset={clearInputs}>
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
                  className="relative block w-full px-3 py-2 mb-8 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="relative block w-full px-3 py-2 mb-8 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                  Convert plurals to singular and vice versa?
                </label>
              </div>
            </div>

            <div className="flex">
              <button
                type="reset"
                className="relative flex justify-center w-full px-4 py-2 mr-3 text-sm font-medium bg-white border border-indigo-700 rounded-md group text-indigo-700 hover:bg-indigo-700 hover:text-white"
              >
                Clear
              </button>

              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700"
              >{`Search ${count} character words`}</button>
            </div>
          </form>
        </div>

        {!words?.length && submitFired && !wordsLoading ? (
          <div className="flex flex-col items-center w-full max-w-md mt-16 mb-8">
            <h2 className="text-lg text-gray-800">No words found 🤷🏻</h2>
            <p className="text-sm text-gray-600">Submit new words below (separated by comma or space).</p>

            <form className="flex items-end justify-between w-full space-y-6" onSubmit={handleSubmitNewWords}>
              <input
                type="text"
                id="new-words"
                name="new-words"
                placeholder="Enter new words"
                value={newWords}
                onChange={handleChange}
                className="flex-grow px-3 py-2 mr-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />

              <button
                type="submit"
                className="relative flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit ✔
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <WordsList words={words} setNotification={setNotification} />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
