import { mount, createLocalVue } from '@vue/test-utils';
import { Dialog, Button } from 'element-ui';
import CreatePostModal from '@/components/modals/create-post';

describe('Create Post Modal Component', () => {
  let wrapper;
  const propsData = { value: false };
  const localVue = createLocalVue();
  const $store = {
    dispatch: jest.fn().mockName('dispatch')
  };
  Object.keys(CreatePostModal.methods).forEach(methodName => {
    jest.spyOn(CreatePostModal.methods, methodName).mockName(methodName);
  });

  localVue.use(Dialog);
  localVue.use(Button);

  beforeEach(() => {
    wrapper = mount(CreatePostModal, {
      stubs: ['el-input'],
      propsData,
      localVue,
      mocks: {
        $store
      }
    });

    jest.clearAllMocks();
  });

  describe('RENDER', () => {
    it('should render Create post modal', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render close button', () => {
      const cancelBtn = wrapper.find('.close-btn');

      expect(cancelBtn.exists()).toBe(true);
    });

    it('should render submit button', () => {
      const submitBtn = wrapper.find('.submit-btn');

      expect(submitBtn.exists()).toBe(true);
    });
  });

  describe('PROPS', () => {
    describe('value', () => {
      it('should be hide when is false', async () => {
        await wrapper.setProps({ value: false });

        expect(wrapper.find('.el-dialog__wrapper').isVisible()).toBe(false);
      });

      it('should be visible when is true', async () => {
        await wrapper.setProps({ value: true });

        expect(wrapper.find('.el-dialog__wrapper').isVisible()).toBe(true);
      });
    });
  });

  describe('EMITS', () => {
    it('should calls method "close" if "close" event emits', () => {
      wrapper.getComponent({ name: 'el-dialog' }).vm.$emit('close');

      expect(CreatePostModal.methods.close).toHaveBeenCalled();
    });
  });

  describe('BUTTONS CLICKS', () => {
    async function triggerButton (buttonClass) {
      const button = wrapper.find(buttonClass);

      await button.trigger('click');
    }

    it('should call method "close" by clicking "Cancel" button', async () => {
      await triggerButton('.close-btn');

      expect(CreatePostModal.methods.close).toHaveBeenCalled();
    });

    it('should call method "submit" by clicking "Submit" button', async () => {
      await triggerButton('.submit-btn');

      expect(CreatePostModal.methods.submit).toHaveBeenCalled();
    });
  });

  describe('METHODS', () => {
    describe('submit', () => {
      it('shouldn\'t dispatch action "addPost" if title is empty', async () => {
        const title = '';
        const body = 'Как научится писать тесты';

        await wrapper.setData({ title, body });
        await wrapper.vm.submit();

        expect(CreatePostModal.methods.submit).toHaveBeenCalled();
        expect($store.dispatch).not.toHaveBeenCalled();
      });

      it('shouldn\'t dispatch action "addPost" if body is empty', async () => {
        const title = 'Тестирование';
        const body = '';

        await wrapper.setData({ title, body });
        await wrapper.vm.submit();

        expect(CreatePostModal.methods.submit).toHaveBeenCalled();
        expect($store.dispatch).not.toHaveBeenCalled();
      });

      it('shouldn\'t dispatch action "addPost" if title and body are empty', async () => {
        const title = '';
        const body = '';

        await wrapper.setData({ title, body });
        await wrapper.vm.submit();

        expect(CreatePostModal.methods.submit).toHaveBeenCalled();
        expect($store.dispatch).not.toHaveBeenCalled();
      });

      it('should dispatch action "addPost" if title and body aren\'t empty', async () => {
        const title = 'Тестирование';
        const body = 'Как научится писать тесты';
        const payload = { title, body };

        await wrapper.setData({ title, body });
        await wrapper.vm.submit();

        expect($store.dispatch).toHaveBeenCalledWith('addPost', payload);
      });

      it('should call method "close" if title and body aren\'t empty', async () => {
        const title = 'Тестирование';
        const body = 'Как научится писать тесты';

        await wrapper.setData({ title, body });
        await wrapper.vm.submit();

        expect(CreatePostModal.methods.close).toHaveBeenCalled();
      });
    });

    describe('close', () => {
      it('should call method "clearData"', async () => {
        await wrapper.vm.close();

        expect(CreatePostModal.methods.clearData).toHaveBeenCalled();
      });

      it('should emit "input" with false', async () => {
        await wrapper.vm.close();

        expect(wrapper.emitted('input')[0]).toEqual([false]);
      });
    });

    describe('prepareData', () => {
      it('should return title and body without spaces', async () => {
        let title = ' Тестирование  ';
        let body = '   Как научится писать тесты ';
        const expectedTitle = 'Тестирование';
        const expectedBody = 'Как научится писать тесты';

        await wrapper.setData({ title, body });

        ({
          title,
          body
        } = wrapper.vm.prepareData());

        expect(title).toBe(expectedTitle);
        expect(body).toBe(expectedBody);
      });
    });

    describe('clearData', () => {
      it('should reset title and body', async () => {
        const title = 'Тестирование';
        const body = 'Как научится писать тесты';

        await wrapper.setData({ title, body });
        wrapper.vm.clearData();

        expect(wrapper.vm.title).toBe('');
        expect(wrapper.vm.body).toBe('');
      });
    });
  });
});
