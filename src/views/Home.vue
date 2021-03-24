<template>
  <div class="home-page">
    <el-row type="flex"
            justify="space-between"
            align="middle"
            class="w-100 mb-20"
    >
      <el-col :span="6">
        <app-filter />
      </el-col>

      <el-col :span="3" class="text-align-right">
        <el-button type="primary" size="small" @click="open.addPostModal = true">
          Добавить пост
        </el-button>
      </el-col>
    </el-row>

    <el-row type="flex" :gutter="30">
      <el-col :span="16">
        <p v-if="visiblePosts.length === 0">
          Постов нет
        </p>

        <el-row v-else type="flex" :gutter="20" class="f-wrap">
          <el-col v-for="post in visiblePosts"
                  :key="post.id"
                  :span="8"
                  class="mb-20"
          >
            <app-post v-bind="post"
                      :class="{ 'is-active': postPreviewId === post.id }"
                      @delete-post="deletePost"
                      @show-preview="showPreview"
                      @share-post="sharePost"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <transition mode="out-in" name="show" appear>
          <router-view :key="$route.path" />
        </transition>
      </el-col>
    </el-row>

    <share-post-modal v-model="open.sharePostModal"
                      :post="postToShare"
                      @input="postToShare = null"
    />

    <create-post-modal v-model="open.addPostModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import AppFilter from '../components/filter';
import AppPost from '../components/post';
import SharePostModal from '../components/modals/share-post';
import CreatePostModal from '../components/modals/create-post';

export default {
  name: 'home',

  components: {
    AppFilter,
    AppPost,
    SharePostModal,
    CreatePostModal
  },

  data () {
    return {
      open: {
        addPostModal: false,
        sharePostModal: false
      },

      postPreviewId: null,
      postToShare: null
    };
  },

  computed: {
    ...mapGetters({
      visiblePosts: 'visiblePosts'
    })
  },

  async created () {
    await this.loadPage();
  },

  methods: {
    async loadPage () {
      if (this.$store.state.posts.length === 0) {
        await this.$store.dispatch('fetchAll');
      }
    },

    deletePost (id) {
      this.$store.dispatch('deletePost', id);
      this.postPreviewId = null;
      this.$router.push({
        name: 'home'
      });
    },

    showPreview (id) {
      if (this.postPreviewId === id) {
        return;
      }

      this.postPreviewId = id;
      this.$router.push({
        name: 'post-preview',
        params: { id }
      });
    },

    sharePost (id) {
      this.postToShare = this.visiblePosts.find(post => post.id === id);
      this.open.sharePostModal = true;
    }
  }
};
</script>

<style lang="scss" scoped>
  .show-enter-active {
    animation: flipInX .8s ease;
    backface-visibility: visible !important;
  }

  .show-leave-active {
    animation: flipOutX .8s ease;
    backface-visibility: visible !important;
  }

  @keyframes flipInX {
    from {
      transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      animation-timing-function: ease-in;
      opacity: 0;
    }

    40% {
      transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      animation-timing-function: ease-in;
    }

    60% {
      transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      opacity: 1;
    }

    80% {
      transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }

    to {
      transform: perspective(400px);
    }
  }

  @keyframes flipOutX {
    from {
      transform: perspective(400px);
    }

    30% {
      transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      opacity: 1;
    }

    to {
      transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      opacity: 0;
    }
  }
</style>
