<template>
  <div class="post-preview">
    <h2 class="post-preview-title">
      {{ post.title }}
    </h2>

    <p class="post-preview-text">
      {{ post.body }}
    </p>
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
    max-width: 580px;
    height: 50vh;
    position: fixed;
    top: 25%;
    padding: 15px 25px;
    box-sizing: border-box;
    border: 2px solid $base-blue;
    border-radius: 10px;
    background-color: whitesmoke;

    &-title {
      margin: 0;
      padding: 0;
      font-size: 24px;
    }

    &-text {
      margin: 10px 0 0 0;
      padding: 0;
      font-size: 20px;
    }
  }
</style>
