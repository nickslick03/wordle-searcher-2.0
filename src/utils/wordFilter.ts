// Color mapping for the filter function
const color_map: Record<number, string> = {
  0: 'absent',
  1: 'present', 
  2: 'correct'
};

/**
 * Creates a binary representation of letter positions in a word
 */
function create_binary_rep(word: string, letter: string): number {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result |= (1 << i);
    }
  }
  return result;
}

/**
 * Returns all the valid wordle words in the word_list given the search_word and the respective colors for each letter.
 */
export function word_filter(word_list: string[], search_word: string, colors: number[]): string[] {
  const search_list = colors
    .map((color, index) => ({ color, index }))
    .sort((a, b) => b.color - a.color)
    .map(o => o.index);

  return word_list.filter(word => {
    let modifiedWord = word;
    for (let i of search_list) {
      const letter = search_word.charAt(i);
      switch (color_map[colors[i]]) {
        case 'absent':
          if (modifiedWord.includes(letter)) return false;
          break;
        case 'present':
          const search_word_num = create_binary_rep(search_word, letter);
          const word_num = create_binary_rep(modifiedWord, letter);
          if ((word_num === 0) || ((search_word_num & word_num) > 0))
            return false;
          modifiedWord = modifiedWord.replace(search_word[i], ' ');
          break;
        case 'correct':
          if (modifiedWord[i] !== letter) return false;
          modifiedWord = modifiedWord.substring(0, i) + ' ' + modifiedWord.substring(i + 1);
          break;
      }
    }
    return true;
  });
}

/**
 * Converts LetterState to color number for the filter function
 */
export function letterStateToColor(letterState: string): number {
  switch (letterState) {
    case 'absent': return 0;
    case 'present': return 1;
    case 'correct': return 2;
    default: return 0;
  }
}
