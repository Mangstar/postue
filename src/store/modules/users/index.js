import * as userService from '../../../services/users';

export default {
  namespaced: true,

  state: {
    list: []
  },

  getters: {
    selectOptions (state) {
      return state.list.map(user => ({
        value: user.id,
        label: user.name
      }));
    }
  },

  mutations: {
    setUsers (state, payload) {
      state.list = payload;
    }
  },

  actions: {
    async fetchUsers (context) {
      const response = await userService.fetchAll();

      if (response.success) {
        context.commit('setUsers', response.data);
      }
    }
  }
};
