<template>
  <div v-cloak class="post-page">
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

        <el-row type="flex" :gutter="20" class="f-wrap">
          <el-col v-for="comment in post.comments"
                  :key="comment.id"
                  :span="12"
                  class="mb-20"
          >
            <el-card class="post-comment">
              <template v-slot:header>
                <h3>{{ comment.name }} ( email: {{ comment.email }} )</h3>
              </template>

              <div class="comment-body base-text">
                {{ comment.body }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'post-page',

  props: {
    id: {
      type: Number
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
