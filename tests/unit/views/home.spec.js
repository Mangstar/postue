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
    setPosts: jest.fn()
      .mockImplementation((state, payload) => {
        state.posts = payload;
      })
      .mockName('setPosts'),
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
    describe('post list', () => {
      const EMPTY_POST_LIST_SELECTOR = '.post-empty';
      const FULL_POST_LIST_SELECTOR = '.post-list';

      it('should render Home page', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render paragraph "Постов нет" if [store.visiblePosts] is empty array', async () => {
        await wrapper.vm.$store.commit('setPosts', []);

        expect(wrapper.find(EMPTY_POST_LIST_SELECTOR).isVisible()).toBe(true);
        expect(wrapper.find(FULL_POST_LIST_SELECTOR).isVisible()).toBe(false);
      });

      it('should render posts list if [store.visiblePosts] is not empty array', async () => {
        await wrapper.vm.$store.commit('setPosts', getPosts(20));

        expect(wrapper.find(FULL_POST_LIST_SELECTOR).isVisible()).toBe(true);
        expect(wrapper.find(EMPTY_POST_LIST_SELECTOR).isVisible()).toBe(false);
      });
    });

    describe('post active class', () => {
      beforeEach(() => {
        wrapper.vm.$store.commit('setPosts', getPosts(20));
      });

      it('should set class "is-active" to post with id="1" which is open on preview', async () => {
        await wrapper.setData({ postPreviewId: 1 });

        expect(wrapper.find('app-post-stub[id="1"]').classes('is-active')).toBe(true);
      });

      it('should set class "is-active" to post with id="3" which is open on preview', async () => {
        await wrapper.setData({ postPreviewId: 3 });

        expect(wrapper.find('app-post-stub[id="3"]').classes('is-active')).toBe(true);
      });
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
        wrapper.vm.$store.commit('setPosts', getPosts(1));
      });

      const POST_ITEM_SELECTOR = 'app-post-stub';

      it('should calls method "deletePost" if "delete-post" event emits', () => {
        wrapper.find(POST_ITEM_SELECTOR).vm.$emit('delete-post');

        expect(Home.methods.deletePost).toHaveBeenCalled();
      });

      it('should calls method "showPreview" if "show-preview" event emits', () => {
        wrapper.find(POST_ITEM_SELECTOR).vm.$emit('show-preview');

        expect(Home.methods.showPreview).toHaveBeenCalled();
      });

      it('should calls method "sharePost" if "share-post" event emits', () => {
        wrapper.find(POST_ITEM_SELECTOR).vm.$emit('share-post');

        expect(Home.methods.sharePost).toHaveBeenCalled();
      });
    });

    describe('share-post-modal', () => {
      const SHARE_POST_MODAL_SELECTOR = 'share-post-modal-stub';

      it('should set [data.postToShare] to null if "input" event emits', () => {
        wrapper.find(SHARE_POST_MODAL_SELECTOR).vm.$emit('input');

        expect(wrapper.vm.postToShare).toBeNull();
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
      it('should dispatch "fetchAll" action if [state.posts] is empty array', async () => {
        wrapper.vm.$store.commit('setPosts', []);
        await wrapper.vm.loadPage();

        expect(dispatchSpy).toHaveBeenCalledWith('fetchAll');
      });

      it('shouldn\'t dispatch "fetchAll" action if [state.posts] is not empty array', async () => {
        dispatchSpy.mockClear();

        wrapper.vm.$store.commit('setPosts', getPosts(20));
        await wrapper.vm.loadPage();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should call "startLoading" mutation before fetch start', async () => {
        wrapper.vm.$store.commit('setPosts', []);

        await wrapper.vm.loadPage();

        expect(mutations.startLoading).toHaveBeenCalled();
      });

      it('should call "finishLoading" mutation after fetch end', async () => {
        wrapper.vm.$store.commit('setPosts', []);

        await wrapper.vm.loadPage();

        expect(mutations.finishLoading).toHaveBeenCalled();
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

      it('should reset [data.postPreviewId]', () => {
        expect(wrapper.vm.postPreviewId).toBeNull();
      });
    });

    describe('showPreview', () => {
      const postPreviewID = 2;

      afterEach(() => {
        if (
          wrapper.vm.$route.name === 'post-preview' &&
          Number(wrapper.vm.$route.params.id) === postPreviewID
        ) {
          router.push({ name: 'post-preview', params: { id: 1 } });
        }
      });

      it('should completed immediately if selected post is open opened post', async () => {
        await wrapper.setData({ postPreviewId: 2 });

        const response = wrapper.vm.showPreview(postPreviewID);

        expect(response).toBeUndefined();
      });

      it('should set [data.postPreviewId] to selected post.id', () => {
        wrapper.vm.showPreview(postPreviewID);
        expect(wrapper.vm.postPreviewId).toBe(postPreviewID);
      });

      it('should open "Post preview" with selected post', () => {
        const expectedNavParams = {
          name: 'post-preview',
          params: { id: postPreviewID }
        };

        wrapper.vm.showPreview(postPreviewID);

        expect(pushSpy).toHaveBeenCalledWith(expectedNavParams);
      });
    });

    describe('sharePost', () => {
      const postID = 5;

      beforeEach(() => {
        wrapper.vm.$store.commit('setPosts', getPosts(10));
        wrapper.vm.sharePost(postID);
      });

      it('should find clicked post by id and set it to [data.postToShare]', () => {
        const expectedPost = {
          id: 5,
          title: 'Post 5',
          body: 'Post content 5',
          userId: 1
        };

        expect(wrapper.vm.postToShare).toEqual(expectedPost);
      });

      it('should open "Share post modal"', () => {
        expect(wrapper.vm.open.sharePostModal).toBe(true);
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
