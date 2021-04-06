import { sum } from '../../src/tests.js';
import 'regenerator-runtime/runtime';

describe('sum', () => {
  it('Should 2 + 3 to be 5', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('Should 34 + 89 to be 123', () => {
    expect(sum(34, 89)).toBe(123);
  });

  it('Should 0.1 + 0.2 to be close 0.3', () => {
    expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
  });

  it('Should \'11\' + \'51\' to be close 62', () => {
    expect(sum('11', '51')).toEqual(62);
  });

  it('Should throw Error when called without args', () => {
    expect(sum).toThrow('Не переданы аргументы');
  });

  it('Should throw TypeError when first arg is not a number or \'number\'', () => {
    expect(() => {
      sum('a', 3);
    }).toThrow('Аргумент "a" не числового типа');
  });

  it('Should throw TypeError when second arg is not a number or \'number\'', () => {
    expect(() => {
      sum(3, 'a');
    }).toThrow('Аргумент "b" не числового типа');
  });
});
