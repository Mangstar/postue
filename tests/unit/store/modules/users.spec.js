import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { state, getters, mutations, actions } from '@/store/modules/users';
import * as userService from '@/services/users';
import { cloneDeep } from 'lodash-es';
import { getUsers } from 'faker';

jest.mock('@/services/users');

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
      state: cloneDeep(state),
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
        { value: 1, label: 'Leanne Graham' },
        { value: 2, label: 'Ervin Howell' },
        { value: 3, label: 'Clementine Bauch' },
        { value: 4, label: 'Patricia Lebsack' },
        { value: 5, label: 'Chelsey Dietrich' }
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
    describe('fetchUsers', () => {
      it('User list doesn\'t fetch', async () => {
        userService.fetchAll.mockResolvedValueOnce({ success: false });

        await store.dispatch('fetchUsers');

        expect(userService.fetchAll).toHaveBeenCalled();
        expect(mutations.setUsers).not.toHaveBeenCalled();
      });

      it('User list fetched successfully', async () => {
        await store.dispatch('fetchUsers');

        expect(userService.fetchAll).toHaveBeenCalled();
        expect(mutations.setUsers).toHaveBeenCalled();
      });
    });
  });
});
