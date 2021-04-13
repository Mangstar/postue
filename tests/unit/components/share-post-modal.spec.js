import { mount, createLocalVue } from '@vue/test-utils';
import { Dialog, Button } from 'element-ui';
import { cloneDeep } from 'lodash-es';
import Vuex from 'vuex';
import { stateInitial as rootState, getters as rootGetters, mutations as rootMutations } from '@/store';
import { initialState as usersState, getters as usersGetters, mutations as usersMutations } from '@/store/modules/users';
import SharePostModal from '@/components/modals/share-post';
import { getCurrentUser, getPosts, getUsers } from 'faker';

describe('Share Post Modal Component', () => {
  let wrapper;
  let userModule;
  let store;
  const postToShare = getPosts(1)[0];
  const propsData = { value: false, post: null };
  const localVue = createLocalVue();

  Object.keys(SharePostModal.methods).forEach(methodName => {
    jest.spyOn(SharePostModal.methods, methodName).mockName(methodName);
  });

  function setApplicationUsers () {
    const currentUser = getCurrentUser();
    const users = getUsers();

    wrapper.vm.$store.commit('setCurrentUser', currentUser);
    wrapper.vm.$store.commit('users/setUsers', users);
  }

  localVue.use(Vuex);
  localVue.use(Dialog);
  localVue.use(Button);

  beforeEach(() => {
    userModule = {
      namespaced: true,
      state: cloneDeep(usersState),
      getters: usersGetters,
      mutations: usersMutations
    };
    store = new Vuex.Store({
      state: cloneDeep(rootState),
      getters: rootGetters,
      mutations: rootMutations,
      modules: {
        users: userModule
      }
    });
    wrapper = mount(SharePostModal, {
      stubs: ['el-select', 'el-option', 'el-input'],
      propsData,
      localVue,
      store
    });

    jest.clearAllMocks();
  });

  describe('RENDER', () => {
    it('shouldn\'t render section with post title if [props.post] is undefined', async () => {
      await wrapper.setProps({ value: true, post: null });

      const postTitleSection = wrapper.find('.post-title-section');

      expect(postTitleSection.exists()).toBe(false);
    });

    it('should render section with post title if [props.post] is defined', async () => {
      await wrapper.setProps({ value: true, post: postToShare });

      const postTitleSection = wrapper.find('.post-title-section');

      expect(postTitleSection.exists()).toBe(true);
      expect(postTitleSection.isVisible()).toBe(true);
    });
  });

  describe('PROPS', () => {
    describe('value', () => {
      it('should be hidden if value is false', async () => {
        await wrapper.setProps({ value: false });

        expect(wrapper.find('.el-dialog__wrapper').isVisible()).toBe(false);
      });

      it('should be visible if value is true', async () => {
        await wrapper.setProps({ value: true });

        expect(wrapper.find('.el-dialog__wrapper').isVisible()).toBe(true);
      });
    });
  });

  describe('EMITS', () => {
    it('should calls method "close" if "close" event emits', () => {
      wrapper.getComponent({ name: 'el-dialog' }).vm.$emit('close');

      expect(SharePostModal.methods.close).toHaveBeenCalled();
    });
  });

  describe('BUTTONS CLICKS', () => {
    async function triggerButton (buttonClass) {
      const button = wrapper.find(buttonClass);

      await button.trigger('click');
    }

    it('should call method "close" by clicking "Cancel" button', async () => {
      await triggerButton('.cancel-btn');

      expect(SharePostModal.methods.close).toHaveBeenCalled();
    });

    it('should call method "submit" by clicking "Submit" button', async () => {
      await triggerButton('.submit-btn');

      expect(SharePostModal.methods.submit).toHaveBeenCalled();
    });
  });

  describe('GETTERS', () => {
    it('[computed.userOptions] should return options for user selector without current user', () => {
      const expectedUserOptions = [
        { value: 2, label: 'Ervin Howell' },
        { value: 3, label: 'Clementine Bauch' },
        { value: 4, label: 'Patricia Lebsack' },
        { value: 5, label: 'Chelsey Dietrich' }
      ];
      setApplicationUsers();

      expect(wrapper.vm.userOptions).toEqual(expectedUserOptions);
    });
  });

  describe('METHODS', () => {
    describe('submit', () => {
      it('should call method "sendPost"', async () => {
        await wrapper.vm.submit();

        expect(SharePostModal.methods.sendPost).toHaveBeenCalled();
      });

      it('should call method "close"', async () => {
        await wrapper.vm.submit();

        expect(SharePostModal.methods.close).toHaveBeenCalled();
      });
    });

    describe('close', () => {
      it('should call method "clearData"', () => {
        wrapper.vm.close();

        expect(SharePostModal.methods.clearData).toHaveBeenCalled();
      });

      it('should emit event "input" with false', () => {
        wrapper.vm.close();

        expect(wrapper.emitted('input')[0]).toEqual([false]);
      });
    });

    describe('clearData', () => {
      it('should reset [data.userTo] to empty array', async () => {
        await wrapper.setData({ userTo: [1, 2, 3] });

        wrapper.vm.clearData();

        expect(wrapper.vm.userTo).toEqual([]);
      });
    });
  });
});
