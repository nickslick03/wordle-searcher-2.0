import { useState, useEffect } from 'react';

export const useWordList = () => {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [wordSet, setWordSet] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
        const text = await res.text();
        const words = text.split('\n');
        setAllWords(words);
        setWordSet(new Set(words));
      } catch (error) {
        console.error('Failed to fetch word list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  return { allWords, wordSet, isLoading };
};
