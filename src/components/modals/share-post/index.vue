<template>
  <el-dialog :visible.sync="value"
             width="30%"
             title="Поделиться постом"
             class="modal-share"
             @close="close"
  >
    <section v-if="post" class="mb-15">
      <el-input :value="post.title" disabled />
    </section>

    <section>
      <div class="mb-5">
        <strong>Получатель: </strong>
      </div>
      <el-select v-model="userTo"
                 multiple
                 placeholder="Поделиться с"
                 class="w-100"
      >
        <el-option v-for="user in options"
                   :key="user.value"
                   :label="user.label"
                   :value="user.value"
        />
      </el-select>
    </section>

    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="close">Отмена</el-button>
        <el-button type="primary"
                   :loading="isLoading"
                   :disabled="isLoading"
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
      isLoading: false
    };
  },

  computed: {
    ...mapGetters({
      currentUserId: 'currentUserId',
      selectOptions: 'users/selectOptions'
    }),

    options () {
      return this.selectOptions.filter(user => user.value !== this.currentUserId);
    }
  },

  methods: {
    async submit () {
      this.isLoading = true;

      await new Promise((resolve, reject) => {
        setTimeout(resolve, 2000);
      });

      this.isLoading = false;

      this.close();
    },

    close () {
      this.userTo = [];
      this.$emit('input', false);
    }
  }
};
</script>

<style lang="scss">
  .modal-share {
    text-align: left;
  }
</style>
