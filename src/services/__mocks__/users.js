import { getUsers, getCurrentUser } from 'faker';

export const fetchCurrent = jest
  .fn(() => ({
    success: true,
    data: getCurrentUser()
  }))
  .mockName('fetchCurrent');

export const fetchAll = jest
  .fn(() => ({
    success: true,
    data: getUsers()
  }))
  .mockName('fetchAll');
