export const sum = (a, b) => {
  if (a === undefined && b === undefined) {
    throw new Error('Не переданы аргументы');
  }

  a = parseFloat(a);
  b = parseFloat(b);

  if (Number.isNaN(a)) {
    throw new TypeError('Аргумент "a" не числового типа');
  } else if (Number.isNaN(b)) {
    throw new TypeError('Аргумент "b" не числового типа');
  }

  return a + b;
};
