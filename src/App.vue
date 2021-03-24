<template>
  <div id="app">
    <app-header />

    <app-loading :show="isLoading" />

    <el-main v-if="appLoaded">
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

  data () {
    return {
      appLoaded: false
    };
  },

  computed: {
    ...mapState([
      'isLoading'
    ])
  },

  created () {
    this.loadApp();
  },

  methods: {
    async loadApp () {
      this.$store.commit('startLoading');

      await this.$store.dispatch('fetchCurrentUser');
      await this.$store.dispatch('users/fetchUsers');

      this.$store.commit('finishLoading');

      this.appLoaded = true;
    }
  }
};
</script>
