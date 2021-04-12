<template>
  <el-card class="post-item">
    <template v-slot:header>
      <router-link :to="{ name: 'post-page', params: { id } }"
                   class="post-title base-link"
      >
        {{ slicedTitle }}
      </router-link>
    </template>

    <div class="post-body base-text mb-15">
      {{ slicedBody }}
    </div>

    <div class="text-align-right">
      <el-button type="danger"
                 class="delete-btn"
                 @click="$emit('delete-post', id)"
      >
        Удалить
      </el-button>

      <el-button type="primary"
                 class="show-preview-btn"
                 @click="$emit('show-preview', id)"
      >
        Превью
      </el-button>

      <el-button type="success"
                 class="share-btn"
                 @click="$emit('share-post', id)"
      >
        Поделиться
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'app-post',

  props: {
    id: {
      type: Number
    },

    title: {
      type: String
    },

    body: {
      type: String
    }
  },

  computed: {
    slicedTitle () {
      if (this.title.length <= 15) {
        return this.title;
      }

      return this.title.slice(0, 15) + '...';
    },

    slicedBody () {
      if (this.body.length <= 40) {
        return this.body;
      }

      return this.body.slice(0, 40) + '...';
    }
  }
};
</script>

<style lang="scss" scoped>
  .post-item {
    &.is-active {
      border: 3px solid $base-blue;
    }
  }
</style>
