<template>
  <el-card class="post-item">
    <template v-slot:header>
      <router-link :to="{ name: 'post-page', params: { id } }"
                   class="base-link"
      >
        {{ slicedTitle }}
      </router-link>
    </template>

    <div class="base-text mb-15">
      {{ slicedBody }}
    </div>

    <div class="text-align-right">
      <el-button type="danger"
                 @click="$emit('delete-post', id)"
      >
        Удалить
      </el-button>

      <el-button type="primary"
                 @click="$emit('show-preview', id)"
      >
        Превью
      </el-button>

      <el-button type="success"
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
      return this.title.slice(0, 15) + '...';
    },

    slicedBody () {
      return this.body.slice(0, 40) + '...';
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_parts/_vars";

  .post-item {
    &.is-active {
      border: 3px solid $base-blue;
    }
  }
</style>
