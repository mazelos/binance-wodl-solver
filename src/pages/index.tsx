import { FormEvent, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import axios from 'axios';

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
  const [count, setCount] = useState<number>(5);
  const [validLetters, setValidLetters] = useState<string>('');
  const [badLetters, setBadLetters] = useState<string>('');
  const [convertWords, setConvertWords] = useState<boolean>(false);
  const [newWords, setNewWords] = useState<string>('');
  // const [words, setWords] = useState<string[]>([]);
  const [submitFired, setSubmitFired] = useState<boolean>(false);

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

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    switch (name) {
      case 'word-count':
        setCount(Number(value) || 0);
        break;
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

  return (
    <div>
      <Head>
        <title>Wodl Solver</title>
        <meta name="description" content="Wodl solver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-xl">WODL SOLVER</h1>
      <p>Search potential crypto words to solve WODL</p>
      <form onSubmit={handleSubmit}>
        <label id="word-count">Select the word length </label>
        <input
          type="range"
          id="word-count"
          name="word-count"
          min="2"
          max="20"
          placeholder="Enter word length"
          value={count}
          onChange={handleChange}
        />
        <label id="valid-letters">Type the valid letters </label>
        <input
          type="text"
          id="valid-letters"
          name="valid-letters"
          placeholder="Enter valid letters"
          value={validLetters}
          onChange={handleChange}
        />
        <label id="bad-letters">Type the bad letters </label>
        <input
          type="text"
          id="bad-letters"
          name="bad-letters"
          placeholder="Enter bad letters"
          value={badLetters}
          onChange={handleChange}
        />
        <label id="convert-words">Convert plurals to singular and vice versa? </label>
        <input type="checkbox" id="convert-words" name="convert-words" onChange={handleChange} checked={convertWords} />

        <button type="submit">{`Search ${count} letters words`}</button>
      </form>

      <h2>Words {words?.length || 0}</h2>
      <ul>
        {words?.map(w => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      {/* <form onSubmit={() => {}}>
        <label id='new-words'>Add new words (separated by ,) </label>
        <input
          type="text"
          id='new-words'
          name="new-words"
          onChange={handleChange}
          value={newWords}
        />
      </form> */}
    </div>
  );
};

export default Home;
