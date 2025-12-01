const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

function isEscKey(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc' || evt.keyCode === 27;
}
export{getRandomInteger};

export{isEscKey};

