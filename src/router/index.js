import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import PostPreview from '../views/PostPreview';
import ClientErrorPage from '../views/404';
import store from '../store/';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: false
    },
    alias: '/posts',
    children: [
      {
        path: '/post-preview/:id',
        name: 'post-preview',
        props: true,
        component: PostPreview,
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '/posts/:id',
    name: 'post-page',
    props: true,
    component: () => import(/* webpackChunkName: "post-page" */ '../views/PostPage'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '*',
    name: '404',
    component: ClientErrorPage
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next(); return;
  }

  if (store.state.token !== undefined) {
    next(); return;
  }

  next({ name: 'login' });
});

export default router;
