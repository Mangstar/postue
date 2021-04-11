import { getPosts, getPostComments, createPost as createPostData } from '../../../faker';

export const fetchAll = jest
  .fn(() => ({
    success: true,
    data: getPosts(50)
  }))
  .mockName('fetchAll');

export const fetchOne = jest
  .fn(id => ({
    success: true,
    data: createPostData(id)
  }))
  .mockName('fetchOne');

export const fetchPreview = jest
  .fn(id => ({
    success: true,
    data: createPostData(id)
  }))
  .mockName('fetchPreview');

export const fetchPostComments = jest
  .fn(postID => {
    return Promise.resolve({
      success: true,
      data: getPostComments(10, postID)
    });
  })
  .mockName('fetchPostComments');

export const createPost = jest
  .fn(data => ({
    success: true,
    data: Object.assign({
      id: 100
    }, data)
  }))
  .mockName('createPost');

export const deletePost = jest
  .fn(() => {
    return Promise.resolve({
      success: true
    });
  })
  .mockName('deletePost');
