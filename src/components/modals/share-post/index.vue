<template>
  <el-dialog :visible.sync="show"
             width="30%"
             class="modal-share"
             @close="close"
  >
    <template v-slot:title>
      <h3 style="text-align: center">
        Поделиться постом
      </h3>
    </template>

    <section v-if="post" class="post-title-section mb-15">
      <div class="mb-5">
        <strong>Пост: </strong>
      </div>
      <el-input :value="post.title" disabled />
    </section>

    <section class="post-recipient-section">
      <div class="mb-5">
        <strong>Получатель: </strong>
      </div>
      <el-select v-model="userTo"
                 multiple
                 placeholder="Поделиться с"
                 class="w-100"
      >
        <el-option v-for="user in userOptions"
                   :key="user.value"
                   :label="user.label"
                   :value="user.value"
        />
      </el-select>
    </section>

    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button class="cancel-btn" @click="close">Отмена</el-button>
        <el-button type="primary"
                   :loading="isLoading"
                   :disabled="isLoading"
                   class="submit-btn"
                   @click="submit"
        >
          Отправить
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'share-post-modal',

  props: {
    value: {
      type: Boolean,
      default: false
    },

    post: {
      type: Object
    }
  },

  data () {
    return {
      userTo: [],
      show: false,
      isLoading: false
    };
  },

  computed: {
    ...mapGetters({
      currentUserId: 'currentUserId',
      selectOptions: 'users/selectOptions'
    }),

    userOptions () {
      return this.selectOptions.filter(user => user.value !== this.currentUserId);
    }
  },

  watch: {
    value () {
      this.show = this.value;
    }
  },

  methods: {
    async submit () {
      this.isLoading = true;

      await this.sendPost();

      this.isLoading = false;

      this.close();
    },

    sendPost (ms = 200) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    clearData () {
      this.userTo = [];
    },

    close () {
      this.clearData();
      this.$emit('input', false);
    }
  }
};
</script>

<style lang="scss" scoped>
  .modal-share {
    text-align: left;
  }
</style>
