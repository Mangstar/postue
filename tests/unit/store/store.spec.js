import { state as initialState, getters, mutations, actions } from '@/store';
import { postService, userService } from '@/services';
import { cloneDeep } from 'lodash-es';
import { createPost, getPosts, getCurrentUser, getPostComments } from 'faker';

jest.mock('@/services/posts');
jest.mock('@/services/users');

describe('Root store module', () => {
  let state;

  beforeEach(() => {
    state = cloneDeep(initialState);
  });

  describe('Getters', () => {
    const names = {
      currentUserId: '"currentUserId" should return id of the current user',
      selectOptions: '"selectOptions" should return an array of objects of structure: { value, label }',
      visiblePosts: '"visiblePosts" should return a list of visible posts which matches with filter.name & filter.users'
    };

    it(names.currentUserId, () => {
      const { currentUserId } = getters;
      const { setCurrentUser } = mutations;
      const currentUser = getCurrentUser();

      setCurrentUser(state, currentUser);

      expect(currentUserId(state)).toBe(1);
    });

    it(names.selectOptions, () => {
      const { selectOptions } = getters;
      const { setPosts } = mutations;
      const posts = getPosts();
      const expectedOptions = posts.map(post => ({
        value: post.id,
        label: post.title
      }));

      setPosts(state, posts);

      expect(selectOptions(state)).toEqual(expectedOptions);
    });

    describe(names.visiblePosts, () => {
      const { visiblePosts } = getters;
      const { setPosts } = mutations;
      const posts = getPosts(21);

      beforeEach(() => {
        setPosts(state, posts);
      });

      it('filter.name = "", filter.users = []. visiblePosts length should be 21', () => {
        expect(visiblePosts(state)).toHaveLength(posts.length);
      });

      it('filter.name = "1", filter.users = []. visiblePosts length should be 12', () => {
        state.filter.name = '1';
        expect(visiblePosts(state)).toHaveLength(12);
      });

      it('filter.name = "21", filter.users = []. visiblePosts length should be 1', () => {
        state.filter.name = '21';
        expect(visiblePosts(state)).toHaveLength(1);
      });

      it('filter.name = "100", filter.users = []. visiblePosts length should be 0', () => {
        state.filter.name = '100';
        expect(visiblePosts(state)).toHaveLength(0);
      });

      it('filter.name = "", filter.users = [3]. visiblePosts length should be 1', () => {
        state.filter.users = [3];
        expect(visiblePosts(state)).toHaveLength(1);
      });

      it('filter.name = "", filter.users = [2]. visiblePosts length should be 10', () => {
        state.filter.users = [2];
        expect(visiblePosts(state)).toHaveLength(10);
      });

      it('filter.name = "", filter.users = [1, 3]. visiblePosts length should be 11', () => {
        state.filter.users = [1, 3];
        expect(visiblePosts(state)).toHaveLength(11);
      });

      it('filter.name = "", filter.users = [4]. visiblePosts length should be 0', () => {
        state.filter.users = [4];
        expect(visiblePosts(state)).toHaveLength(0);
      });

      it('filter.name = "2", filter.users = [1]. visiblePosts length should be 1', () => {
        state.filter.name = '2';
        state.filter.users = [1];
        expect(visiblePosts(state)).toHaveLength(1);
      });

      it('filter.name = "2", filter.users = [2]. visiblePosts length should be 2', () => {
        state.filter.name = '2';
        state.filter.users = [2];
        expect(visiblePosts(state)).toHaveLength(2);
      });

      it('filter.name = "2", filter.users = [4]. visiblePosts length should be 0', () => {
        state.filter.name = '2';
        state.filter.users = [4];
        expect(visiblePosts(state)).toHaveLength(0);
      });
    });
  });

  describe('Mutations', () => {
    const names = {
      startLoading: '"startLoading" should toggle state.isLoading in <true>',
      finishLoading: '"finishLoading" should toggle state.isLoading in <false>',
      setCurrentUser: '"setCurrentUser" should set user data object as a state.currentUser',
      setPosts: '"setPosts" should set state.posts as an array of objects',
      addPost: '"addPost" should add a new post data object into the 1st position at state.posts',
      deletePost: '"deletePost" should remove a post by id',
      setFilterName: '"setFilterName" should set a filter.name value',
      setFilterUsers: '"setFilterUsers" should set a filter.users as an array of user\'s id'
    };

    it(names.startLoading, () => {
      const { startLoading } = mutations;

      startLoading(state);

      expect(state.isLoading).toBe(true);
    });

    it(names.finishLoading, () => {
      const { finishLoading } = mutations;

      finishLoading(state);

      expect(state.isLoading).toBe(false);
    });

    it(names.setCurrentUser, () => {
      const { setCurrentUser } = mutations;
      const currentUser = getCurrentUser();

      setCurrentUser(state, currentUser);

      expect(state.currentUser).toEqual(currentUser);
    });

    it(names.setPosts, () => {
      const { setPosts } = mutations;
      const posts = getPosts();

      setPosts(state, posts);

      expect(state.posts).toEqual(posts);
    });

    it(names.addPost, () => {
      const { addPost } = mutations;

      for (let i = 1; i < 4; i++) {
        const createdPost = createPost(i);

        addPost(state, createdPost);
        expect(state.posts[0]).toEqual(createdPost);
      }
    });

    it(names.deletePost, () => {
      const { setPosts, deletePost } = mutations;
      const posts = getPosts(20);
      const postIdToDelete = 2;

      setPosts(state, posts);
      expect(state.posts).toHaveLength(20);

      deletePost(state, postIdToDelete);
      expect(state.posts).toHaveLength(19);
      expect(state.posts.find(post => post.id === postIdToDelete)).toBeUndefined();
    });

    it(names.setFilterName, () => {
      const { setFilterName } = mutations;
      const title = 'some string';

      setFilterName(state, title);
      expect(state.filter.name).toBe('some string');
    });

    it(names.setFilterUsers, () => {
      const { setFilterUsers } = mutations;
      const users = [1, 2];

      setFilterUsers(state, users);
      expect(state.filter.users).toEqual(users);
    });
  });

  describe('Actions', () => {
    const commit = jest.fn().mockName('commit');

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('fetchCurrentUser', () => {
      const { fetchCurrentUser } = actions;
      const commitName = 'setCurrentUser';
      const currentUser = getCurrentUser();

      it('Current user data doesn\'t fetch', async () => {
        userService.fetchCurrent.mockResolvedValueOnce({ success: false });

        await fetchCurrentUser({ state, commit });

        expect(userService.fetchCurrent).toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
      });

      it('Current user data fetched successfully', async () => {
        await fetchCurrentUser({ state, commit });

        expect(userService.fetchCurrent).toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith(commitName, currentUser);
      });
    });

    describe('fetchAll', () => {
      const { fetchAll } = actions;
      const commitName = 'setPosts';
      const posts = getPosts(50);

      it('Posts data doesn\'t fetch', async () => {
        postService.fetchAll.mockResolvedValueOnce({ success: false });

        await fetchAll({ commit });

        expect(postService.fetchAll).toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
      });

      it('Posts data fetched successfully', async () => {
        await fetchAll({ commit });

        expect(commit).toHaveBeenCalledWith(commitName, posts);
        expect(postService.fetchAll).toHaveBeenCalled();
      });
    });

    describe('fetchOne', () => {
      const { fetchOne } = actions;
      const postID = 14;
      const expectedPost = {
        ...createPost(postID),
        comments: getPostComments(10, postID)
      };

      it('Post data doesn\'t fetch', async () => {
        postService.fetchOne.mockResolvedValueOnce({ success: false });

        const responseErrorOne = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseErrorOne).toBeNull();
      });

      it('Post comments doesn\'t fetch', async () => {
        postService.fetchPostComments.mockResolvedValueOnce({ success: false });

        const responseErrorTwo = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseErrorTwo).toBeNull();
      });

      it('Post data and posts comments doesn\'t fetch', async () => {
        postService.fetchOne.mockResolvedValueOnce({ success: false });
        postService.fetchPostComments.mockResolvedValueOnce({ success: false });

        const responseErrorThree = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseErrorThree).toBeNull();
      });

      it('Post data and comments fetched successfully', async () => {
        const responseSuccess = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(responseSuccess).toEqual(expectedPost);
      });
    });

    describe('fetchPreview', () => {
      const { fetchPreview } = actions;
      const postID = 1;
      const expectedPost = createPost();

      it('Post preview data doesn\'t fetch', async () => {
        postService.fetchPreview.mockResolvedValueOnce({ success: false });

        const responseError = await fetchPreview(null, postID);

        expect(postService.fetchPreview).toHaveBeenCalledWith(postID);
        expect(responseError).toBeUndefined();
      });

      it('Post preview data fetched successfully', async () => {
        const responseSuccess = await fetchPreview(null, postID);

        expect(postService.fetchPreview).toHaveBeenCalledWith(postID);
        expect(responseSuccess).toEqual(expectedPost);
      });
    });

    describe('fetchPostComments', () => {
      const { fetchPostComments } = actions;
      const expectedComments = getPostComments(10);
      const postID = 1;

      it('Post comments doesn\'t fetch', async () => {
        postService.fetchPostComments.mockResolvedValueOnce({ success: false });

        const responseError = await fetchPostComments(null, postID);

        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseError).toBeUndefined();
      });

      it('Post comments fetched successfully', async () => {
        const responseSuccess = await fetchPostComments(null, postID);

        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseSuccess).toEqual(expectedComments);
      });
    });

    describe('addPost', () => {
      const { addPost } = actions;
      const commitName = 'addPost';
      const newPostData = {
        title: 'New post',
        body: 'New post content',
        userId: 1
      };
      const createdPost = {
        id: 100,
        ...newPostData
      };

      it('Post didn\'t create', async () => {
        postService.createPost.mockResolvedValueOnce({ success: false });

        await addPost({ state, commit }, newPostData);

        expect(postService.createPost).toHaveBeenCalledWith(newPostData);
        expect(commit).not.toHaveBeenCalled();
      });

      it('Post created successfully', async () => {
        await addPost({ state, commit }, newPostData);

        expect(postService.createPost).toHaveBeenCalledWith(newPostData);
        expect(commit).toHaveBeenCalledWith(commitName, createdPost);
      });
    });

    describe('deletePost', () => {
      const { deletePost } = actions;
      const commitName = 'deletePost';
      const deletedPostId = 2;

      it('Post didn\'t delete', async () => {
        postService.deletePost.mockResolvedValueOnce({ success: false });

        await deletePost({ state, commit }, deletedPostId);

        expect(postService.deletePost).toHaveBeenCalledWith(deletedPostId);
        expect(commit).not.toHaveBeenCalled();
      });

      it('Post deleted successfully', async () => {
        await deletePost({ state, commit }, deletedPostId);

        expect(postService.deletePost).toHaveBeenCalledWith(deletedPostId);
        expect(commit).toHaveBeenCalledWith(commitName, deletedPostId);
      });
    });
  });
});
