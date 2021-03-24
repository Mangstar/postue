<template>
  <div id="app">
    <app-header />

    <app-loading :show="isLoading" />

    <el-main>
      <router-view />
    </el-main>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppHeader from './components/layout/header';
import AppLoading from './components/loading';

export default {
  name: 'app',

  components: {
    AppHeader,
    AppLoading
  },

  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      apiError: state => state.ui.error
    })
  },

  async created () {
    await this.loadApp();
  },

  methods: {
    async loadApp () {
      this.$store.commit('startLoading');

      await this.$store.dispatch('fetchCurrentUser');
      await this.$store.dispatch('users/fetchUsers');

      this.$store.commit('finishLoading');
    }
  }
};
</script>

<style lang="scss">
  [v-cloak] {
    display: none;
  }
</style>
