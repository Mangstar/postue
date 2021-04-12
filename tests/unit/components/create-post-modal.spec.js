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
  const submit = jest.spyOn(CreatePostModal.methods, 'submit');
  const close = jest.spyOn(CreatePostModal.methods, 'close');
  const clearData = jest.spyOn(CreatePostModal.methods, 'clearData');

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

  describe('PROP VALUE', () => {
    it('should be hide when is false', async () => {
      await wrapper.setProps({ value: false });

      expect(wrapper.find('.el-dialog__wrapper').isVisible()).toBe(false);
    });

    it('should be visible when is true', async () => {
      await wrapper.setProps({ value: true });

      expect(wrapper.find('.el-dialog__wrapper').isVisible()).toBe(true);
    });
  });

  describe('Click on "Submit" button', () => {
    let submitBtn;

    beforeEach(() => {
      submitBtn = wrapper.find('.submit-btn');
    });

    it('shouldn\'t dispatch action "addPost" if title is empty', async () => {
      const title = '';
      const body = 'Как научится писать тесты';

      await wrapper.setData({ title, body });
      await submitBtn.trigger('click');

      expect(submit).toHaveBeenCalled();
      expect($store.dispatch).not.toHaveBeenCalled();
    });

    it('shouldn\'t dispatch action "addPost" if body is empty', async () => {
      const title = 'Тестирование';
      const body = '';

      await wrapper.setData({ title, body });
      await submitBtn.trigger('click');

      expect(submit).toHaveBeenCalled();
      expect($store.dispatch).not.toHaveBeenCalled();
    });

    it('shouldn\'t dispatch action "addPost" if title and body are empty', async () => {
      const title = '';
      const body = '';

      await wrapper.setData({ title, body });
      await submitBtn.trigger('click');

      expect(submit).toHaveBeenCalled();
      expect($store.dispatch).not.toHaveBeenCalled();
    });

    describe('title and body aren\'t empty', () => {
      async function triggerSubmitButton () {
        await wrapper.setData({ title, body });
        await submitBtn.trigger('click');
      }

      const title = 'Тестирование';
      const body = 'Как научится писать тесты';
      const payload = { title, body };

      beforeEach(async () => {
        await triggerSubmitButton();

        expect(submit).toHaveBeenCalled();
      });

      it('should dispatch action "addPost"', () => {
        expect($store.dispatch).toHaveBeenCalledWith('addPost', payload);
      });

      it('should call method "close"', () => {
        expect(close).toHaveBeenCalled();
      });
    });
  });

  describe('Click on "Cancel" button', () => {
    it('should call method "close"', async () => {
      const cancelBtn = wrapper.find('.close-btn');

      await cancelBtn.trigger('click');

      expect(close).toHaveBeenCalled();
    });
  });

  describe('Method "close"', () => {
    async function triggerCloseButton () {
      const cancelBtn = wrapper.find('.close-btn');

      await cancelBtn.trigger('click');
    }

    it('should call method "clearData"', async () => {
      await triggerCloseButton();

      expect(clearData).toHaveBeenCalled();
    });

    it('should emit "input" with false', async () => {
      await triggerCloseButton();

      expect(wrapper.emitted('input')[0]).toEqual([false]);
    });
  });

  describe('Method "prepareData"', () => {
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

  describe('Method "clearData"', () => {
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
