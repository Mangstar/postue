<template>
  <div class="container">
    <div class="post-page">
      <h1 class="post-title">
        {{ post.title }}
      </h1>

      <div class="post-body mb-20">
        {{ post.body }}
      </div>

      <div class="post-comments">
        <h2 class="post-subtitle">
          Список комментариев
        </h2>

        <el-card v-for="comment in post.comments"
                 :key="comment.id"
                 class="post-comment mb-20"
        >
          <template v-slot:header>
            {{ comment.name }} ( {{ comment.email }} )
          </template>

          <div class="comment-body">
            {{ comment.body }}
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'post-page',

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

  watch: {
    $route () {
      this.loadPage();
    }
  },

  created () {
    this.loadPage();
  },

  methods: {
    async loadPage () {
      this.post = await this.$store.dispatch('fetchOne', this.id);
    }
  }
};
</script>

<style lang="scss" scoped>
  .post {
    &-title {
      margin: 0 0 20px 0;
      font-size: 64px;
    }

    &-subtitle {
      margin: 0 0 20px 0;
      font-size: 52px;
    }

    &-body {
      font-size: 28px;
    }

    &-comment {
      max-width: 50%;
      font-size: 20px;
    }
  }
</style>
