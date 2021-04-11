export const createPost = (id = 1, userId = 1) => ({
  id,
  title: 'Post ' + id,
  body: 'Post content ' + id,
  userId
});

export const createComment = (id, postId = 1) => ({
  postId,
  id,
  name: 'Комментарий ' + id,
  email: 'mail' + id + '@mail.ru',
  body: 'Содержание комментария ' + id
});

export const getPosts = count => {
  let userId = 1;

  return Array.from({ length: count }).map((post, index) => {
    const postId = index + 1;

    // У каждого нового 10-ка постов userId меняется
    if (postId > 10 && postId % 10 === 1) {
      userId++;
    }

    return createPost(postId, userId);
  });
};

export const getPostComments = (count, postID) => {
  let postId = postID ?? 1;

  return Array
    .from({ length: count })
    .map((comment, index) => {
      const commentId = index + 1;

      // У каждого нового 10-ка комментариев postId меняется
      if (postID === undefined && commentId > 10 && commentId % 10 === 0) {
        postId++;
      }

      return createComment(commentId, postId);
    });
};

export const getUsers = () => [
  { id: 1, name: 'Leanne Graham', age: 24, username: 'Bret', email: 'Sincere@april.biz' },
  { id: 2, name: 'Ervin Howell', age: 29, username: 'Antonette', email: 'Shanna@melissa.tv' },
  { id: 3, name: 'Clementine Bauch', age: 31, username: 'Samantha', email: 'Nathan@yesenia.net' },
  { id: 4, name: 'Patricia Lebsack', age: 20, username: 'Karianne', email: 'Julianne.OConner@kory.org' },
  { id: 5, name: 'Chelsey Dietrich', age: 43, username: 'Kamren', email: 'Lucio_Hettinger@annie.ca' }
];

export const getCurrentUser = () => getUsers()[0];
