<template>
  <el-header>
    <el-container>
      <nav class="navigation">
        <ul class="menu">
          <router-link v-for="item in menuItems"
                       :key="item.routeName"
                       v-slot="{ href, navigate, isExactActive }"
                       :to="{ name: item.routeName }"
          >
            <li class="menu-item" :class="{ 'is-active': isExactActive }">
              <a :href="href"
                 class="menu-link"
                 @click="navigate"
              >
                {{ item.title }}
              </a>
            </li>
          </router-link>
        </ul>
      </nav>
    </el-container>
  </el-header>
</template>

<script>
export default {
  name: 'app-header',

  data () {
    return {
      menuItems: [
        {
          title: 'Главная',
          path: '/',
          routeName: 'home'
        },
        {
          title: 'О нас',
          path: '/about',
          routeName: 'about'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_parts/_vars";

  .menu {
    display: flex;
    padding: 0;
    margin: 0;

    &-item {
      box-sizing: border-box;
      list-style: none;
      border-bottom: 4px solid transparent;

      &.is-active, &:hover {
        border-bottom-color: $base-blue;
      }
    }

    &-item.is-active &-link,
    &-item:hover &-link {
      color: $base-blue;
    }

    &-link {
      display: block;
      height: 60px;
      box-sizing: border-box;
      padding: 0 25px;
      font-size: 24px;
      line-height: 60px;
      text-decoration: none;
      color: $base-gray;
    }
  }
</style>
