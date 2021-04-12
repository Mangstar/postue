<template>
  <el-dialog :visible.sync="show"
             width="30%"
             title="Создать пост"
             class="modal-create-post"
             @close="close"
  >
    <template v-slot:title>
      <h3 style="text-align: center">
        Создать пост
      </h3>
    </template>

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
        <el-button class="close-btn" @click="close">Отмена</el-button>
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
      isLoading: false,
      show: false
    };
  },

  watch: {
    value () {
      this.show = this.value;
    }
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
      this.clearData();
      this.$emit('input', false);
    },

    prepareData () {
      return {
        title: this.title.trim(),
        body: this.body.trim()
      };
    },

    clearData () {
      this.title = '';
      this.body = '';
    }
  }
};
</script>
