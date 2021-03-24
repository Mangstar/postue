<template>
  <el-popover v-model="isVisible"
              trigger="manual"
              placement="bottom"
              width="400"
  >
    <template v-slot:reference>
      <div class="filter-reference" @click="isVisible = !isVisible">
        <div class="filter-search">
          <i class="el-icon-search" />
        </div>

        <div v-show="selectedValues.length === 0" class="filter-placeholder">
          Поиск
        </div>

        <div class="filter-tags">
          <el-tag v-for="tag in selectedValues"
                  :key="tag.key"
                  closable
                  :disable-transitions="false"
                  @click.native.stop
                  @close.stop="deleteSelectedFilter(tag.key)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
    </template>

    <section v-for="filter in filters"
             :key="filter.key"
             class="mb-15"
    >
      <div class="mb-5">
        <strong class="filter-name">{{ filter.name }}:</strong>
      </div>

      <template v-if="filter.type === 'text'">
        <el-input v-model.trim="getModel(filter.key).value"
                  :placeholder="filter.placeholder"
        />
      </template>

      <template v-if="filter.type === 'select'">
        <el-select v-model="getModel(filter.key).value"
                   :placeholder="filter.placeholder"
                   multiple
                   class="w-100"
        >
          <el-option v-for="item in filter.options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
          />
        </el-select>
      </template>
    </section>

    <div class="filter-actions">
      <el-button @click="clear">
        Отмена
      </el-button>
      <el-button type="success" @click="submit">
        Принять
      </el-button>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'app-filter',

  data () {
    return {
      isVisible: false,

      filters: [
        {
          name: 'Название',
          value: '',
          key: 'name',
          type: 'text',
          placeholder: 'Введите название',
          commit: 'setFilterName'
        },
        {
          name: 'Пользователи',
          value: [],
          key: 'users',
          type: 'select',
          placeholder: 'Выберете пользователей',
          options: this.$store.getters['users/selectOptions'],
          commit: 'setFilterUsers'
        }
      ]
    };
  },

  computed: {
    selectedValues () {
      return this.filters.filter(filter => filter.value.length > 0);
    }
  },

  methods: {
    submit () {
      const { commit } = this.$store;

      this.isVisible = false;
      this.filters.forEach(filter => {
        commit(filter.commit, filter.value);
      });
    },

    clear () {
      const { commit } = this.$store;

      this.isVisible = false;
      this.filters.forEach(filter => {
        filter.value = filter.type === 'text' ? '' : [];
        commit(filter.commit, filter.value);
      });
    },

    deleteSelectedFilter (tagId) {
      const { commit } = this.$store;
      const filterToDelete = this.filters.find(filter => filter.key === tagId);

      filterToDelete.value = filterToDelete.type === 'text' ? '' : [];
      commit(filterToDelete.commit, filterToDelete.value);
    },

    getModel (key) {
      return this.filters.find(filter => filter.key === key);
    }
  }
};
</script>

<style lang="scss" scoped>
  .filter {
    &-reference {
      min-width: 300px;
      display: flex;
      align-items: center;
      border: 1px solid $base-blue-hover;
      border-radius: 4px;
      cursor: pointer;
    }

    &-search {
      height: 32px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 5px;
      margin-right: 3px;
      background-color: #ececec;
      border-radius: 4px 0 0 4px;
    }

    &-placeholder {
      font-size: 16px;
      color: $base-gray;
    }

    &-name {
      font-size: 24px;
    }

    &-actions {
      text-align: center;
    }
  }
</style>
