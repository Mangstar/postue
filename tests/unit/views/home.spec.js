import { mount, createLocalVue } from '@vue/test-utils';
import { Row, Col, Button } from 'element-ui';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import PostPreview from '@/views/PostPreview';
import { getPosts, createPost } from 'faker';

jest.mock('@/services/posts');
jest.mock('@/services/users');

describe('HOME PAGE', () => {
  let wrapper;
  let store;
  let state;
  const getters = {
    visiblePosts (state) {
      return state.posts;
    }
  };
  const mutations = {
    startLoading: jest.fn().mockName('startLoading'),
    finishLoading: jest.fn().mockName('finishLoading'),
    setPosts: jest.fn().mockName('setPosts'),
    deletePost: jest.fn().mockName('deletePost')
  };
  const actions = {
    fetchAll: jest.fn().mockName('fetchAll'),
    fetchPreview: jest.fn()
      .mockImplementation(id => createPost(id))
      .mockName('fetchPreview'),
    deletePost: jest.fn().mockName('deletePost')
  };
  let router;
  let commitSpy;
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
      component: () => import(/* webpackChunkName: "post-page" */ '@/views/PostPage'),
      meta: {
        requiresAuth: true
      }
    }
  ];
  const localVue = createLocalVue();

  Object.keys(Home.methods).forEach(methodName => {
    jest.spyOn(Home.methods, methodName).mockName(methodName);
  });

  localVue.use(Vuex);
  localVue.use(VueRouter);
  localVue.use(Row);
  localVue.use(Col);
  localVue.use(Button);

  beforeEach(() => {
    state = {
      posts: []
    };

    store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    });
    router = new VueRouter({ routes });

    commitSpy = jest.spyOn(store, 'commit').mockName('commit');
    dispatchSpy = jest.spyOn(store, 'dispatch').mockName('dispatch');
    pushSpy = jest.spyOn(router, 'push').mockName('router.push');

    jest.clearAllMocks();

    wrapper = mount(Home, {
      stubs,
      localVue,
      store,
      router
    });
  });

  describe('RENDER', () => {
    it('should render Home page', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render page title with text from .env file', () => {
      expect(wrapper.find('.main-title').exists()).toBe(true);
      // eslint-disable-next-line no-undef
      expect(wrapper.find('.main-title').text()).toBe(APP_VUE_TITLE);
    });

    it('should render "Post filter" component', () => {
      expect(wrapper.getComponent({ name: 'app-filter' }).exists()).toBe(true);
    });

    it('should render "Добавить пост" button', () => {
      expect(wrapper.find('.add-post-btn').exists()).toBe(true);
    });

    it('should render "Share post modal" component', () => {
      expect(wrapper.getComponent({ name: 'share-post-modal' }).exists()).toBe(true);
    });

    it('should render "Create post modal" component', () => {
      expect(wrapper.getComponent({ name: 'create-post-modal' }).exists()).toBe(true);
    });

    describe('Conditional rendering of post list', () => {
      const EMPTY_POST_LIST_SELECTOR = '.post-empty';
      const FULL_POST_LIST_SELECTOR = '.post-list';

      it('should render paragraph "Постов нет" if [store.visiblePosts] is an empty array', () => {
        expect(wrapper.find(EMPTY_POST_LIST_SELECTOR).isVisible()).toBe(true);
        expect(wrapper.find(FULL_POST_LIST_SELECTOR).isVisible()).toBe(false);
      });

      it('should render posts list if [store.visiblePosts] isn\'t an empty array', async () => {
        state.posts = getPosts(20);

        await wrapper.vm.$nextTick();

        expect(wrapper.find(FULL_POST_LIST_SELECTOR).isVisible()).toBe(true);
        expect(wrapper.find(EMPTY_POST_LIST_SELECTOR).isVisible()).toBe(false);
      });
    });

    it('should set class "is-active" to post which open on preview', async () => {
      state.posts = getPosts(20);

      await wrapper.setData({ postPreviewId: 1 });
      expect(wrapper.find('app-post-stub[id="1"]').classes('is-active')).toBe(true);

      await wrapper.setData({ postPreviewId: 3 });
      expect(wrapper.find('app-post-stub[id="1"]').classes('is-active')).toBe(false);
      expect(wrapper.find('app-post-stub[id="3"]').classes('is-active')).toBe(true);
    });
  });

  describe('LIFECYCLE HOOKS', () => {
    it('created', () => {
      expect(Home.methods.loadPage).toHaveBeenCalled();
    });
  });

  describe('EMITS', () => {
    describe('app-post', () => {
      beforeEach(() => {
        state.posts = getPosts(1);
      });

      it('should calls method "deletePost" if "delete-post" event emits', () => {
        wrapper.getComponent({ name: 'app-post' }).vm.$emit('delete-post');
        expect(Home.methods.deletePost).toHaveBeenCalled();
      });

      it('should calls method "showPreview" if "show-preview" event emits', () => {
        wrapper.getComponent({ name: 'app-post' }).vm.$emit('show-preview');
        expect(Home.methods.showPreview).toHaveBeenCalled();
      });

      it('should calls method "sharePost" if "share-post" event emits', () => {
        wrapper.getComponent({ name: 'app-post' }).vm.$emit('share-post');
        expect(Home.methods.sharePost).toHaveBeenCalled();
      });
    });

    describe('share-post-modal', () => {
      it('should call method "resetSharePost" when "input" event emits', () => {
        wrapper.getComponent({ name: 'share-post-modal' }).vm.$emit('input');
        expect(Home.methods.resetSharePost).toHaveBeenCalled();
      });
    });
  });

  describe('BUTTONS CLICKS', () => {
    async function triggerButton (selector) {
      const button = wrapper.find(selector);

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
      beforeEach(() => {
        commitSpy.mockClear();
        dispatchSpy.mockClear();
      });

      it('should dispatch action "fetchAll" if [state.posts] is an empty array', async () => {
        await wrapper.vm.loadPage();
        expect(dispatchSpy).toHaveBeenCalledWith('fetchAll');
      });

      it('shouldn\'t dispatch action "fetchAll" if [state.posts] isn\'t an empty array', async () => {
        state.posts = getPosts(20);

        await wrapper.vm.loadPage();
        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should commit mutations "startLoading", "finishLoading" if [state.posts] is an empty array', async () => {
        await wrapper.vm.loadPage();

        expect(commitSpy.mock.calls[0]).toEqual(['startLoading']);
        expect(commitSpy.mock.calls[1]).toEqual(['finishLoading']);
      });

      it('shouldn\'t commit mutations "startLoading", "finishLoading" if [state.posts] isn\'t an empty array', async () => {
        state.posts = getPosts(20);

        await wrapper.vm.loadPage();

        expect(commitSpy).not.toHaveBeenCalled();
        expect(commitSpy).not.toHaveBeenCalled();
      });
    });

    describe('openPostModal', () => {
      it('should toggle [data.open.addPostModal] to true', () => {
        expect(wrapper.vm.open.addPostModal).toBe(false);

        wrapper.vm.openPostModal();
        expect(wrapper.vm.open.addPostModal).toBe(true);
      });
    });

    describe('deletePost', () => {
      const postID = 1;

      beforeEach(() => {
        wrapper.vm.deletePost(postID);
      });

      it('should dispatch action "deletePost" with post id', () => {
        expect(dispatchSpy).toHaveBeenCalledWith('deletePost', postID);
      });

      it('should reset [data.postPreviewId]', () => {
        expect(wrapper.vm.postPreviewId).toBeNull();
      });
    });

    describe('showPreview', () => {
      it('should completed immediately if selected post is already opened', async () => {
        const postPreviewID = 1;

        await wrapper.setData({ postPreviewId: 1 });

        wrapper.vm.showPreview(postPreviewID);
        expect(pushSpy).not.toHaveBeenCalled();
      });

      it('should set [data.postPreviewId] to selected post id', () => {
        const postPreviewID = 2;

        wrapper.vm.showPreview(postPreviewID);
        expect(wrapper.vm.postPreviewId).toBe(postPreviewID);
      });

      it('should navigate to "Post preview page" of the selected post', () => {
        const postPreviewID = 3;
        const expectedNavParams = {
          name: 'post-preview',
          params: { id: postPreviewID }
        };

        wrapper.vm.showPreview(postPreviewID);

        expect(pushSpy).toHaveBeenCalledWith(expectedNavParams);
      });
    });

    describe('sharePost', () => {
      beforeEach(() => {
        state.posts = getPosts(10);
      });

      it('should find selected post by id and set it to [data.postToShare]', () => {
        const postIds = [2, 5, 7];

        postIds.forEach(id => {
          const expectedPost = {
            id: id,
            title: 'Post ' + id,
            body: 'Post content ' + id,
            userId: 1
          };

          wrapper.vm.sharePost(id);
          expect(wrapper.vm.postToShare).toEqual(expectedPost);
        });
      });

      it('should open "Share post modal"', () => {
        const postID = 2;

        expect(wrapper.vm.open.sharePostModal).toBe(false);

        wrapper.vm.sharePost(postID);

        expect(wrapper.vm.open.sharePostModal).toBe(true);
      });
    });

    describe('resetSharePost', () => {
      it('should set [data.postToShare] to null', async () => {
        const postToShare = {
          id: 1,
          title: 'Post 1',
          body: 'Post content 1',
          userId: 1
        };

        await wrapper.setData({ postToShare });

        expect(wrapper.vm.postToShare).toEqual(postToShare);
        wrapper.vm.resetSharePost();
        expect(Home.methods.resetSharePost).toHaveBeenCalled();
      });
    });
  });

  describe('ROUTER-VIEW', () => {
    const postID = 5;

    it('should render "Post preview page" when [data.postPreviewId] is defined', async () => {
      await wrapper.vm.$router.push({
        name: 'post-preview',
        params: { id: postID }
      });

      expect(wrapper.getComponent({ name: 'post-preview' }).exists()).toBe(true);
    });
  });
});
