<template>
  <div class="post-page">
    <div class="container">
      <h1 class="main-title">
        {{ post.title }}
      </h1>

      <div class="post-body base-text mb-20">
        {{ post.body }}
      </div>

      <div class="post-comments">
        <h2 class="main-subtitle mb-20">
          Список комментариев
        </h2>

        <el-card v-for="comment in post.comments"
                 :key="comment.id"
                 class="post-comment mb-20"
        >
          <template v-slot:header>
            <h3>{{ comment.name }} ( email: {{ comment.email }} )</h3>
          </template>

          <div class="comment-body base-text">
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
      this.$store.commit('startLoading');

      this.post = await this.$store.dispatch('fetchOne', this.id);

      this.$store.commit('finishLoading');
    }
  }
};
</script>

<style lang="scss" scoped>
  .post {
    &-comment {
      max-width: 50%;
    }
  }
</style>
