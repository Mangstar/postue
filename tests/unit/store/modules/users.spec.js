import { mutations } from '../../../../src/store/modules/users';

describe('Store module "Users"', () => {
  describe('Mutations', () => {
    const getState = () => {
      return {
        list: []
      };
    };
    const getUsers = () => {
      return [
        { id: 1, name: 'user1' },
        { id: 2, name: 'user2' }
      ];
    };

    it('setUsers', () => {
      const state = getState();
      const users = getUsers();
      const { setUsers } = mutations;

      setUsers(state, users);

      expect(state.list).toEqual(users);
    });
  });
});
