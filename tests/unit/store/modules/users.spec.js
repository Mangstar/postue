import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import _ from 'lodash';
import { state, getters, mutations, actions } from '@/store/modules/users';

function getUsers () {
  return [
    { id: 1, name: 'user1', age: 24 },
    { id: 2, name: 'user2', age: 29 }
  ];
}

jest.mock('@/services/users', () => {
  const data = [
    { id: 1, name: 'user1', age: 24 },
    { id: 2, name: 'user2', age: 29 }
  ];

  return {
    fetchAll: jest
      .fn()
      .mockResolvedValueOnce({
        success: false
      })
      .mockResolvedValueOnce({
        success: true,
        data
      })
  };
});

describe('Store module "Users"', () => {
  const localVue = createLocalVue();
  let store;

  localVue.use(Vuex);

  beforeEach(() => {
    Object.keys(mutations).forEach(key => {
      mutations[key] = jest
        .spyOn(mutations, key)
        .mockName('"' + key + '"');
    });

    store = new Vuex.Store({
      state: _.cloneDeep(state),
      getters,
      mutations,
      actions
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Getters', () => {
    it('selectOptions', () => {
      const users = getUsers();
      const expectedOptions = [
        { value: 1, label: 'user1' },
        { value: 2, label: 'user2' }
      ];
      store.commit('setUsers', users);

      expect(store.getters.selectOptions).toEqual(expectedOptions);
    });
  });

  describe('Mutations', () => {
    it('setUsers', () => {
      const users = getUsers();
      store.commit('setUsers', users);

      expect(store.state.list).toEqual(users);
    });
  });

  describe('Actions', () => {
    it('fetchUsers calls mutation "setUsers" only the API Request is completed successfully', async () => {
      const { setUsers } = mutations;

      await store.dispatch('fetchUsers');
      expect(setUsers).not.toHaveBeenCalled();

      await store.dispatch('fetchUsers');
      expect(setUsers).toHaveBeenCalled();
    });
  });
});
