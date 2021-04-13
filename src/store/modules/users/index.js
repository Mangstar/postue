import * as userService from '@/services/users';

export const state = {
  list: []
};

export const getters = {
  selectOptions (state) {
    return state.list.map(user => ({
      value: user.id,
      label: user.name
    }));
  }
};

export const mutations = {
  setUsers (state, payload) {
    state.list = payload;
  }
};

export const actions = {
  async fetchUsers (context) {
    const response = await userService.fetchAll();

    if (response.success) {
      context.commit('setUsers', response.data);
    }
  }
};

export const config = { state, getters, mutations, actions };

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
