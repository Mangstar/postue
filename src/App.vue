<template>
  <div v-cloak id="app">
    <app-header />

    <app-loading :show="isLoading" />

    <el-main>
      <el-container class="mb-20">
        <el-row type="flex"
                justify="space-between"
                align="middle"
                class="w-100"
        >
          <el-col :span="6">
            <app-filter :filters="postsFilters"
                        @submit="onFilterSubmit"
            />
          </el-col>

          <el-col :span="3" class="text-align-right">
            <el-button type="primary" size="small" @click="showPostModal = true">
              Добавить пост
            </el-button>
          </el-col>
        </el-row>
      </el-container>

      <el-container>
        <p v-if="visiblePosts.length === 0">
          Постов нет
        </p>

        <el-row v-else type="flex" :gutter="20" class="f-wrap">
          <el-col v-for="post in visiblePosts"
                  :key="post.id"
                  :span="6"
                  class="mb-20"
          >
            <app-post v-bind="post"
                      @delete-post="deletePost"
                      @share-post="sharePost"
            />
          </el-col>
        </el-row>
      </el-container>

      <share-post-modal v-model="showShareModal"
                        :post="postToShare"
                        @input="postToShare = null"
      />

      <create-post-modal v-model="showPostModal" />
    </el-main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AppHeader from './components/layout/header';
import AppLoading from './components/loading';
import AppFilter from './components/filter';
import AppPost from './components/post';
import SharePostModal from './components/modals/share-post';
import CreatePostModal from './components/modals/create-post';

export default {
  name: 'app',
  components: {
    AppHeader,
    AppLoading,
    AppFilter,
    AppPost,
    SharePostModal,
    CreatePostModal
  },

  data () {
    return {
      postsFilters: [
        {
          name: 'Название',
          key: 'name',
          type: 'text',
          placeholder: 'Введите название'
        },
        {
          name: 'Пользователь',
          key: 'user',
          type: 'select',
          placeholder: 'Выберете пользователя',
          options: []
        }
      ],
      showPostModal: false,
      showShareModal: false,
      postToShare: null
    };
  },

  computed: {
    ...mapState([
      'isLoading'
    ]),

    ...mapGetters({
      visiblePosts: 'visiblePosts',
      usersOptions: 'users/selectOptions'
    })
  },

  async created () {
    this.$store.commit('startLoading');

    const currentUser = this.$store.dispatch('fetchCurrentUser');
    const users = this.$store.dispatch('users/fetchUsers');
    const posts = this.$store.dispatch('fetchPosts');

    await currentUser;
    await posts;
    await users;

    this.postsFilters
      .find(filter => filter.key === 'user')
      .options = this.usersOptions;
    this.$store.commit('finishLoading');
  },

  methods: {
    onFilterSubmit (submitFilter) {
      const titleFilter = submitFilter.find(item => item.key === 'name');
      const userFilter = submitFilter.find(item => item.key === 'user');
      const postTitleValue = titleFilter ? titleFilter.value : '';
      const userValue = userFilter ? userFilter.value : [];

      this.$store.commit('setFilterName', postTitleValue);
      this.$store.commit('setFilterUsers', [...userValue]);
    },

    deletePost (id) {
      this.$store.dispatch('deletePost', id);
    },

    sharePost (id) {
      this.postToShare = this.visiblePosts.find(post => post.id === id);
      this.showShareModal = true;
    }
  }
};
</script>

<style lang="scss">
  [v-cloak] {
    display: none;
  }
</style>
