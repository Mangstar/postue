import transport from './index';

export const fetchCurrent = async () => {
  return await transport.get('users/1');
};

export const fetchAll = async () => {
  return await transport.get('users');
};
