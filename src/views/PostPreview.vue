<template>
  <div v-show="!previewLoading" class="post-preview-page">
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
export default {
  name: 'post-preview',

  props: {
    id: {
      type: [Number, String]
    }
  },

  data () {
    return {
      post: {},
      previewLoading: true
    };
  },

  async created () {
    await this.loadPost();
  },

  methods: {
    async loadPost () {
      this.previewLoading = true;

      this.post = await this.$store.dispatch('fetchPreview', this.id);

      this.previewLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
