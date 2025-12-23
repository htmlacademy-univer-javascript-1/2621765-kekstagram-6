const DEBOUNCE_DELAY = 500;

const isEscKey = (evt) => evt.key === 'Escape' || evt.code === 'Escape';


const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};


const shuffleArray = (array) => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};


const getCommentWordForm = (number, singular, dual, plural) => {
  const absoluteNumber = Math.abs(number);
  const lastTwoDigits = absoluteNumber % 100;
  const lastDigit = absoluteNumber % 10;

  if (lastTwoDigits > 10 && lastTwoDigits < 20) {
    return plural;
  }

  if (lastDigit > 1 && lastDigit < 5) {
    return dual;
  }

  if (lastDigit === 1) {
    return singular;
  }

  return plural;
};


export { isEscKey, debounce, shuffleArray, getCommentWordForm };
