import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import PostPage from '../views/PostPage';
import PostPreview from '../views/PostPreview';
import ClientErrorPage from '../views/404';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    alias: '/posts',
    children: [
      {
        path: '/post-preview/:id',
        name: 'post-preview',
        props: true,
        component: PostPreview
      }
    ]
  },
  {
    path: '/posts/:id',
    name: 'post-page',
    props: true,
    component: PostPage
  },
  {
    path: '*',
    name: '404',
    component: ClientErrorPage
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
