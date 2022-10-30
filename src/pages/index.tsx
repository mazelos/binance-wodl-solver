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
import Checkbox from '@components/CheckBox';
import Button from '@components/Button';
import TextInput from '@components/TextInput';
import Divider from '@components/Divider';

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

  const { refetch: refetchSubmitNewWords } = useQuery(['submit-new-words'], () => submitNewWords(newWords), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
            <div>
              <div className="mb-8">
                <SizeSelector size={count} setSize={handleCountChange} />
              </div>

              <TextInput
                onChange={handleChange}
                value={validLetters}
                name="valid-letters"
                placeholder="Enter found letters"
                style="mb-8"
              >
                Found letters ✔
              </TextInput>

              <TextInput
                onChange={handleChange}
                value={badLetters}
                name="bad-letters"
                placeholder="Enter invalid letters"
                style="mb-8"
              >
                Invalid letters ✖
              </TextInput>
            </div>

            <Checkbox isChecked={convertWords} handleChange={handleChange} />

            <div className="flex flex-col xs:flex-row">
              <Button type="clear" action="reset" fullWidth>
                Clear
              </Button>
              <Divider />
              <Button action="submit" fullWidth>{`Search ${count} character words`}</Button>
            </div>
          </form>
        </div>

        {!words?.length && submitFired && !wordsLoading ? (
          <div className="flex flex-col items-center w-full max-w-md mt-16 mb-8">
            <h2 className="text-lg text-gray-800">No words found 🤷🏻</h2>
            <p className="text-sm text-gray-600">Submit new words below (separated by comma or space).</p>

            <form
              className="flex flex-col xs:flex-row items-center justify-between w-full mt-4"
              onSubmit={handleSubmitNewWords}
            >
              <TextInput
                name="new-words"
                placeholder="Enter new words"
                value={newWords}
                onChange={handleChange}
                style="xs:w-auto w-full"
              />
              <Divider />
              <Button action="submit">Submit ✔</Button>
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
