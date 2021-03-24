<template>
  <div class="post-preview-page">
    <h2 class="main-subtitle">
      {{ post.title }}
    </h2>

    <p class="post-preview-text base-text">
      {{ post.body }}
    </p>

    <div class="post-preview-actions">
      <router-link :to="{ name: 'post-page', params: { id } }" class="base-link">
        Открыть пост
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'post-preview',

  props: {
    id: {
      type: [Number, String]
    }
  },

  data () {
    return {
      post: {}
    };
  },

  computed: {
    ...mapState([
      'posts'
    ])
  },

  watch: {
    $route () {
      this.loadPost();
    }
  },

  async created () {
    await this.loadPost();
  },

  methods: {
    async loadPost () {
      this.post = await this.$store.dispatch('fetchPreview', this.id);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../assets/scss/_parts/_vars";

  .post-preview {
    &-page {
      max-width: 580px;
      min-height: 50vh;
      position: fixed;
      top: 25%;
      padding: 15px 25px;
      box-sizing: border-box;
      border: 2px solid $base-blue;
      border-radius: 10px;
      background-color: whitesmoke;
    }

    &-text {
      margin: 10px 0 0 0;
    }

    &-actions {
      margin-top: 20px;
    }
  }
</style>
