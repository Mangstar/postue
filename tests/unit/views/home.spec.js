import { mount, createLocalVue } from '@vue/test-utils';
import { Row, Col, Button } from 'element-ui';
import { cloneDeep } from 'lodash-es';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { initialState, getters, mutations, actions } from '@/store';
import Home from '@/views/Home';
import PostPreview from '@/views/PostPreview';
// import AppPost from '@/components/post';
import { getPosts } from 'faker';

jest.mock('@/services/posts');
jest.mock('@/services/users');

describe('HOME PAGE', () => {
  let wrapper;
  let store;
  let router;
  let dispatchSpy;
  let pushSpy;
  const stubs = ['app-filter', 'app-post', 'create-post-modal', 'share-post-modal'];
  const routes = [
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
    }
  ];
  const localVue = createLocalVue();

  Object.keys(Home.methods).forEach(methodName => {
    jest.spyOn(Home.methods, methodName);
  });

  localVue.use(Vuex);
  localVue.use(VueRouter);
  localVue.use(Row);
  localVue.use(Col);
  localVue.use(Button);

  beforeEach(() => {
    store = new Vuex.Store({
      state: cloneDeep(initialState),
      getters,
      mutations,
      actions
    });
    router = new VueRouter({ routes });

    dispatchSpy = jest.spyOn(store, 'dispatch').mockName('store.dispatch');
    pushSpy = jest.spyOn(router, 'push').mockName('router.push');

    wrapper = mount(Home, {
      stubs,
      localVue,
      store,
      router
    });

    wrapper.vm.$options.created = jest.fn();

    jest.clearAllMocks();
  });

  describe('RENDER', () => {
    it('should render Home page', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render paragraph "Постов нет" if [store.visiblePosts] is empty array', async () => {
      await wrapper.vm.$store.commit('setPosts', []);

      expect(wrapper.find('.posts-empty').isVisible()).toBe(true);
      expect(wrapper.find('.posts-list').isVisible()).toBe(false);
    });

    it('should render posts list if [store.visiblePosts] is not empty array', async () => {
      await wrapper.vm.$store.commit('setPosts', getPosts(20));

      expect(wrapper.find('.posts-list').isVisible()).toBe(true);
      expect(wrapper.find('.posts-empty').isVisible()).toBe(false);
    });
  });

  describe('LIFECIRCLE HOOKS', () => {
    it('created', () => {
      wrapper.vm.$options.created.mockReset();
      expect(Home.methods.loadPage).toHaveBeenCalled();
    });
  });

  describe('EMITS', () => {
    it('should calls method "deletePost" if "delete-post" event emits', () => {
      wrapper.find('app-post-stub').vm.$emit('delete-post');

      expect(Home.methods.deletePost).toHaveBeenCalled();
    });

    it('should calls method "showPreview" if "show-preview" event emits', () => {
      wrapper.find('app-post-stub').vm.$emit('show-preview');

      expect(Home.methods.showPreview).toHaveBeenCalled();
    });

    it('should calls method "sharePost" if "share-post" event emits', () => {
      wrapper.find('app-post-stub').vm.$emit('share-post');

      expect(Home.methods.sharePost).toHaveBeenCalled();
    });

    it('should set [data.postToShare] to null if "input" event emits', () => {
      wrapper.find('share-post-modal-stub').vm.$emit('input');

      expect(wrapper.vm.postToShare).toBeNull();
    });
  });

  describe('WATCH', () => {
    describe('postPreviewId', () => {
      it('should navigate to Home page if [data.postPreviewId] is null', async () => {
        await wrapper.setData({ postPreviewId: 1 });
        expect(pushSpy).not.toHaveBeenCalled();

        await wrapper.setData({ postPreviewId: null });
        expect(pushSpy).toHaveBeenCalledWith({
          name: 'home'
        });
      });
    });
  });

  describe('BUTTONS CLICKS', () => {
    async function triggerButton (buttonClass) {
      const button = wrapper.find(buttonClass);

      await button.trigger('click');
    }

    it('should open "Create post modal" by clicking "Добавить пост" button', async () => {
      expect(wrapper.vm.open.addPostModal).toBe(false);

      await triggerButton('.add-post-btn');

      expect(wrapper.vm.open.addPostModal).toBe(true);
    });
  });

  describe('METHODS', () => {
    describe('loadPage', () => {
      it('should dispatch "fetchAll" action if [state.posts] is empty array', async () => {
        wrapper.vm.$store.commit('setPosts', []);
        await wrapper.vm.loadPage();

        expect(dispatchSpy).toHaveBeenCalledWith('fetchAll');
      });

      it('shouldn\'t dispatch "fetchAll" action if [state.posts] is not empty array', async () => {
        wrapper.vm.$store.commit('setPosts', getPosts(20));
        await wrapper.vm.loadPage();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe('deletePost', () => {
      const postID = 1;

      beforeEach(() => {
        wrapper.vm.deletePost(postID);
      });

      it('should dispatch "deletePost" action with post id', () => {
        const actionName = 'deletePost';

        expect(dispatchSpy).toHaveBeenCalledWith(actionName, postID);
      });

      it('should reset "data.postPreviewId"', () => {
        expect(wrapper.vm.postPreviewId).toBeNull();
      });
    });

    describe('showPreview', () => {
      const postPreviewID = 1;

      it('should completed immediately if chosen post is equal opened post', async () => {
        await wrapper.setData({ postPreviewId: 1 });

        const response = wrapper.vm.showPreview(postPreviewID);

        expect(response).toBeUndefined();
      });

      it('should set [data.postPreviewId] to chosen post id', () => {
        wrapper.vm.showPreview(postPreviewID);
        expect(wrapper.vm.postPreviewId).toBe(postPreviewID);

        wrapper.vm.showPreview(5);
        expect(wrapper.vm.postPreviewId).toBe(5);
      });

      it('should open Post preview with chosen one', () => {
        wrapper.vm.showPreview(postPreviewID);

        expect(pushSpy).toHaveBeenCalledWith({
          name: 'post-preview',
          params: { id: postPreviewID }
        });
      });
    });

    describe('sharePost', () => {
      const postID = 5;

      beforeEach(() => {
        wrapper.vm.$store.commit('setPosts', getPosts(10));
        wrapper.vm.sharePost(postID);
      });

      it('should find by id and set [data.postToShare] to clicked post', () => {
        const expectedPost = {
          id: 5,
          title: 'Post 5',
          body: 'Post content 5',
          userId: 1
        };

        expect(wrapper.vm.postToShare).toEqual(expectedPost);
      });

      it('should open Share post modal', () => {
        expect(wrapper.vm.open.sharePostModal).toBe(true);
      });
    });
  });

  describe('ROUTER-VIEW', () => {
    const postID = 5;
    const innerComponentName = 'post-preview';

    it('should render "post-preview" page when [data.postPreviewId] is defined', async () => {
      await wrapper.vm.$router.push({
        name: innerComponentName,
        params: { id: postID }
      });

      expect(wrapper.getComponent({ name: innerComponentName }).exists()).toBe(true);
    });
  });
});
