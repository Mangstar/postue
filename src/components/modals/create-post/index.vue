<template>
  <el-dialog :visible.sync="value"
             width="30%"
             title="Создать пост"
             class="modal-create-post"
             @close="close"
  >
    <section class="mb-15">
      <div class="mb-5">
        <strong>Название: </strong>
      </div>
      <el-input v-model="title" placeholder="Введите название" />
    </section>

    <section>
      <div class="mb-5">
        <strong>Содержание: </strong>
      </div>
      <el-input v-model="body" type="textarea" placeholder="Введите содержимое" />
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
export default {
  name: 'create-post-modal',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      title: '',
      body: '',
      isLoading: false
    };
  },

  methods: {
    async submit () {
      const { title, body } = this.prepareData();

      if (title !== '' && body !== '') {
        this.isLoading = true;

        await this.$store.dispatch('addPost', {
          title,
          body
        });

        this.isLoading = false;

        this.close();
      }
    },

    close () {
      console.log('close');
      this.title = '';
      this.body = '';
      this.$emit('input', false);
    },

    prepareData () {
      return {
        title: this.title,
        body: this.body
      };
    }
  }
};
</script>
