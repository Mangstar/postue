<template>
  <el-card class="box-card">
    <template v-slot:header>
      {{ slicedTitle }}
    </template>

    <div class="mb-15">
      {{ slicedBody }}
    </div>

    <div class="text-align-right">
      <el-button type="danger"
                 size="small"
                 @click="$emit('delete-post', id)"
      >
        Удалить
      </el-button>

      <el-button type="success"
                 size="small"
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
