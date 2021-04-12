import { mount, createLocalVue } from '@vue/test-utils';
import { Card, Button } from 'element-ui';
import VueRouter from 'vue-router';
import Post from '@/components/post';
import { routes } from '@/router';

describe('Post Item Component', () => {
  let wrapper;
  const propsData = { id: 1, title: '', body: '' };
  const SPREAD = '...';
  const MAX_TITLE_LENGTH = 15;
  const MAX_BODY_LENGTH = 40;
  const localVue = createLocalVue();
  const router = new VueRouter({ routes });

  localVue.use(VueRouter);
  localVue.use(Card);
  localVue.use(Button);

  beforeEach(() => {
    wrapper = mount(Post, {
      propsData,
      localVue,
      router
    });
  });

  it('should render post', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render title', () => {
    const title = wrapper.find('.base-link');

    expect(title).toBeDefined();
  });

  it('should render title text', async () => {
    const shortTitle = 'Название';

    await wrapper.setProps({ title: shortTitle });

    const title = wrapper.find('.base-link');
    const titleText = title.text();

    expect(titleText).toBe(shortTitle);
  });

  it('should render sliced title text with ... in the end when it\'s longer 15 characters', async () => {
    const longTitleText = 'Название интересного поста';

    await wrapper.setProps({ title: longTitleText });

    const title = wrapper.find('.base-link');
    const titleText = title.text();
    const expectedTitleText = longTitleText.slice(0, MAX_TITLE_LENGTH) + SPREAD;

    expect(titleText).toBe(expectedTitleText);
  });

  it('should render body', () => {
    const body = wrapper.find('.post-body');

    expect(body.exists()).toBeDefined();
  });

  it('should render body text', async () => {
    const shortBodyText = 'Содержание поста';

    await wrapper.setProps({ body: shortBodyText });

    const body = wrapper.find('.post-body');
    const bodyText = body.text();

    expect(bodyText).toBe(shortBodyText);
  });

  it('should render sliced body text with ... in the end when it\'s longer 40 characters', async () => {
    const longBodyText = 'Содержание интересного поста, и многое многое другое';

    await wrapper.setProps({ body: longBodyText });

    const body = wrapper.find('.post-body');
    const bodyText = body.text();
    const expectedBodyText = longBodyText.slice(0, MAX_BODY_LENGTH) + SPREAD;

    expect(bodyText).toBe(expectedBodyText);
  });

  it('should render delete button', () => {
    const deleteBtn = wrapper.find('.delete-btn');

    expect(deleteBtn.exists()).toBe(true);
  });

  it('should render show preview button', () => {
    const deleteBtn = wrapper.find('.show-preview-btn');

    expect(deleteBtn.exists()).toBe(true);
  });

  it('should render share button', () => {
    const deleteBtn = wrapper.find('.share-btn');

    expect(deleteBtn.exists()).toBe(true);
  });

  it('should emit "delete-post" event when delete button triggers', () => {
    const deleteBtn = wrapper.find('.delete-btn');
    const eventName = 'delete-post';

    deleteBtn.trigger('click');

    expect(wrapper.emitted(eventName)[0]).toEqual([propsData.id]);
  });

  it('should emit "show-preview" event when show-preview button triggers', () => {
    const showPreviewBtn = wrapper.find('.show-preview-btn');
    const eventName = 'show-preview';

    showPreviewBtn.trigger('click');

    expect(wrapper.emitted(eventName)[0]).toEqual([propsData.id]);
  });

  it('should emit "share-post" event when share button triggers', () => {
    const shareBtn = wrapper.find('.share-btn');
    const eventName = 'share-post';

    shareBtn.trigger('click');

    expect(wrapper.emitted(eventName)[0]).toEqual([propsData.id]);
  });

  it('should navigate to the post page', () => {
    const routerLink = wrapper.find('.post-title');
    const linkHref = routerLink.attributes('href');
    const expectedHref = '#/posts/1';

    expect(linkHref).toBe(expectedHref);
  });
});
