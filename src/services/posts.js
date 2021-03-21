import transport from './index';

export const fetchAll = async () => {
  return await transport.get('posts');
};

export const createPost = async (payload) => {
  return await transport.post('posts', payload);
};

export const deletePost = async (id) => {
  return await transport.delete('posts' + '/' + id);
};
