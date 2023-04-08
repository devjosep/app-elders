const getFirstLetters = (text: string): string =>
  text
    .split(' ')
    .reduce((acc, word) => {
      if (word?.[0]) {
        acc.push(word[0].toUpperCase());
      }
      return acc;
    }, [] as string[])
    .join(' ');

export { getFirstLetters };
