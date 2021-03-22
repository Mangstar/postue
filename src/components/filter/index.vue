<template>
  <el-popover v-model="isVisible"
              trigger="manual"
              placement="bottom"
              width="300"
  >
    <template v-slot:reference>
      <div class="filter-reference" @click="isVisible = !isVisible">
        <div class="filter-search">
          <i class="el-icon-search" />
        </div>
        <div class="filter-tags">
          <el-tag v-for="tag in selectedValues"
                  :key="tag.key"
                  closable
                  :disable-transitions="false"
                  @click.native.stop
                  @close.stop="deleteSelected(tag.key)"
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
        <strong v-if="filter.name">
          {{ filter.name }}:
        </strong>
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

  props: {
    filters: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      isVisible: false,

      possibleValues: []
    };
  },

  computed: {
    selectedValues () {
      return this.possibleValues.filter(item => item.value.length > 0);
    }
  },

  watch: {
    filters: {
      immediate: true,
      handler () {
        this.possibleValues = this.filters.map(filter => ({
          name: filter.name,
          key: filter.key,
          value: filter.type === 'text' ? '' : []
        }));
      }
    }
  },

  methods: {
    submit () {
      this.$emit('submit', [
        ...this.selectedValues
      ]);
      this.isVisible = false;
    },

    clear () {
      this.isVisible = false;
      this.possibleValues.forEach(item => {
        item.value = item.type === 'text' ? '' : [];
      });
    },

    deleteSelected (tagId) {
      this.possibleValues.find(item => item.key === tagId).value = [];

      this.$emit('submit', [
        ...this.selectedValues
      ]);
    },

    getModel (key) {
      return this.possibleValues.find(item => item.key === key);
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
      border: 1px solid #c5d9e8;
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

    &-actions {
      text-align: center;
    }
  }
</style>
