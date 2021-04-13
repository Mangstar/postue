import Vue from 'vue';
import Vuex from 'vuex';

import { users } from './modules';

import * as postService from '../services/posts';
import * as userService from '../services/users';
import { cloneDeep } from 'lodash-es';

Vue.use(Vuex);

export const state = {
  isLoading: false,

  currentUser: {},
  token: 'atxldjfkjfl67dsmn3dsf43k43279fdjf6ghnfuid732jkfodp23kjflsd_f3',

  posts: [],

  filter: {
    name: '',
    users: []
  },

  ui: {
    error: null
  }
};

export const stateInitial = cloneDeep(state);

export const getters = {
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
};

export const mutations = {
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

  setUIError (state, payload) {
    state.ui.error = payload;
  }
};

export const actions = {
  async fetchCurrentUser (context) {
    const response = await userService.fetchCurrent();

    if (response.success) {
      context.commit('setCurrentUser', response.data);
    }
  },

  async fetchAll (context) {
    const response = await postService.fetchAll();

    if (response.success) {
      context.commit('setPosts', response.data);
    }
  },

  async fetchOne (context, payload) {
    const postResponse = await postService.fetchOne(payload);
    const responseComments = await postService.fetchPostComments(payload);

    if (postResponse.success && responseComments.success) {
      return {
        ...postResponse.data,
        comments: responseComments.data
      };
    }

    return null;
  },

  async fetchPreview (context, payload) {
    const response = await postService.fetchPreview(payload);

    if (response.success) {
      return response.data;
    }

    return null;
  },

  async fetchPostComments (context, payload) {
    const response = await postService.fetchPostComments(payload);

    if (response.success) {
      return response.data;
    }

    return null;
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

  setUIError (context, payload) {
    const status = payload.status;
    const defaultMessages = {
      401: 'Вы не авторизановы',
      403: 'Доступ запрещен',
      404: 'Страница не найдена'
    };
    const message = payload.message ?? defaultMessages[status] + ' (' + payload.url + ')';

    context.commit('setUIError', {
      status,
      url: payload.url,
      message
    });
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,

  modules: {
    users
  }
});
