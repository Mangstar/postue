import Vue from 'vue';
import Vuex from 'vuex';

import { users } from './modules';

import * as postService from '../services/posts';
import * as userService from '../services/users';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,

    currentUser: {},

    posts: [],

    filter: {
      name: '',
      users: []
    },

    ui: {
      error: {

      }
    }
  },

  getters: {
    currentUserId (state) {
      return state.currentUser.id;
    },

    selectOptions (state) {
      return state.posts.map(post => ({
        value: post.id,
        label: post.title
      }));
    },

    visiblePosts (state) {
      const posts = state.posts.filter(post => post.title.includes(state.filter.name));

      if (state.filter.users.length === 0) {
        return posts;
      }

      return posts.filter(post => state.filter.users.includes(post.userId));
    }
  },

  mutations: {
    startLoading (state) {
      state.isLoading = true;
    },

    finishLoading (state) {
      state.isLoading = false;
    },

    setCurrentUser (state, payload) {
      state.currentUser = payload;
    },

    setPosts (state, payload) {
      state.posts = payload;
    },

    addPost (state, payload) {
      state.posts.unshift(payload);
    },

    deletePost (state, payload) {
      state.posts = state.posts.filter(post => post.id !== payload);
    },

    setFilterName (state, payload) {
      state.filter.name = payload;
    },

    setFilterUsers (state, payload) {
      state.filter.users = payload;
    },

    setApiResponseError (state, payload) {
      state.apiResponseError = payload;
    }
  },

  actions: {
    async fetchCurrentUser (context) {
      const response = await userService.fetchCurrent();

      if (response.success) {
        context.commit('setCurrentUser', response.data);
      }
    },

    async fetchPosts (context) {
      const response = await postService.fetchAll();

      if (response.success) {
        context.commit('setPosts', response.data);
      }
    },

    async addPost (context, payload) {
      const response = await postService.createPost(payload);

      if (response.success) {
        context.commit('addPost', response.data);
      }
    },

    async deletePost (context, id) {
      const response = await postService.deletePost(id);

      if (response.success) {
        context.commit('deletePost', id);
      }
    },

    setApiResponseError (context, payload) {
      const status = payload.status;
      const defaultMessages = {
        401: 'Вы не авторизановы',
        403: 'Доступ запрещен',
        404: 'Страница не найдена'
      };
      const message = payload.message ?? defaultMessages[status] + ' (' + payload.url + ')';

      context.commit('setApiResponseError', message);
    }
  },

  modules: {
    users
  }
});
