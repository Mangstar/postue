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

      <div class="post-review">
        <h2 class="main-subtitle mb-20">
          Связь с автором поста
        </h2>

        <el-input v-model="review.text"
                  type="textarea"
                  :row="3"
                  placeholder="Напишите автору поста"
                  class="mb-20"
        />

        <el-button type="primary" @click="sendReview">
          Отправить
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui';

export default {
  name: 'post-page',

  props: {
    id: {
      type: [Number, String]
    }
  },

  data () {
    return {
      post: {},
      review: {
        text: '',
        modified: false
      }
    };
  },

  async beforeRouteLeave (to, from, next) {
    if (!this.review.modified) {
      next(); return;
    }

    try {
      await MessageBox.confirm(
        'У вас есть не сохраненные изменения. Вы уверены, что хотите покинуть страницу?'
      );

      next();
    } catch (err) {
      next(false);
    }
  },

  watch: {
    'review.text' () {
      this.review.modified = true;
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
    },

    sendReview () {
      this.review.modified = false;
    }
  }
};
</script>
