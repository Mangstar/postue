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

  describe('GETTERS', () => {
    const messages = {
      currentUserId: 'should return id of the current user',
      selectOptions: 'should return an array of objects: { value, label }[]',
      visiblePosts: 'should return a list of visible posts which matches with filter.name & filter.users'
    };

    it(messages.currentUserId, () => {
      const { currentUserId } = getters;
      const { setCurrentUser } = mutations;
      const currentUser = getCurrentUser();
      const expectedID = 1;

      setCurrentUser(state, currentUser);

      expect(currentUserId(state)).toBe(expectedID);
    });

    it(messages.selectOptions, () => {
      const { selectOptions } = getters;
      const { setPosts } = mutations;
      const posts = getPosts(5);
      const expectedOptions = [
        { value: 1, label: 'Post 1' },
        { value: 2, label: 'Post 2' },
        { value: 3, label: 'Post 3' },
        { value: 4, label: 'Post 4' },
        { value: 5, label: 'Post 5' }
      ];

      setPosts(state, posts);

      expect(selectOptions(state)).toEqual(expectedOptions);
    });

    describe(messages.visiblePosts, () => {
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

  describe('MUTATIONS', () => {
    const messages = {
      startLoading: 'should toggle state.isLoading in true',
      finishLoading: 'should toggle state.isLoading in false',
      setCurrentUser: 'should set user data object in state.currentUser',
      setPosts: 'should set array of post data objects in state.posts',
      addPost: 'should add a new post into the 1st position at state.posts',
      deletePost: 'should remove a post by id',
      setFilterName: 'should set a filter.name as a string',
      setFilterUsers: 'should set a filter.users as an array of user\'s id'
    };

    it(messages.startLoading, () => {
      const { startLoading } = mutations;

      startLoading(state);

      expect(state.isLoading).toBe(true);
    });

    it(messages.finishLoading, () => {
      const { finishLoading } = mutations;

      finishLoading(state);

      expect(state.isLoading).toBe(false);
    });

    it(messages.setCurrentUser, () => {
      const { setCurrentUser } = mutations;
      const currentUser = getCurrentUser();

      setCurrentUser(state, currentUser);

      expect(state.currentUser).toEqual(currentUser);
    });

    it(messages.setPosts, () => {
      const { setPosts } = mutations;
      const posts = getPosts();

      setPosts(state, posts);

      expect(state.posts).toEqual(posts);
    });

    it(messages.addPost, () => {
      const { addPost } = mutations;

      expect(state.posts).toHaveLength(0);

      for (let i = 1; i < 4; i++) {
        const createdPost = createPost(i);

        addPost(state, createdPost);
        expect(state.posts[0]).toEqual(createdPost);
      }

      expect(state.posts).toHaveLength(3);
    });

    it(messages.deletePost, () => {
      const { setPosts, deletePost } = mutations;
      const posts = getPosts(20);
      const postIdToDelete = 2;

      setPosts(state, posts);
      expect(state.posts).toHaveLength(20);

      deletePost(state, postIdToDelete);
      expect(state.posts).toHaveLength(19);
      expect(state.posts.find(post => post.id === postIdToDelete)).toBeUndefined();
    });

    it(messages.setFilterName, () => {
      const { setFilterName } = mutations;
      const title = 'some string';

      setFilterName(state, title);
      expect(state.filter.name).toBe('some string');
    });

    it(messages.setFilterUsers, () => {
      const { setFilterUsers } = mutations;
      const users = [1, 2];

      setFilterUsers(state, users);
      expect(state.filter.users).toEqual(users);
    });
  });

  describe('ACTIONS', () => {
    const commit = jest.fn().mockName('commit');

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('fetchCurrentUser', () => {
      const { fetchCurrentUser } = actions;
      const commitName = 'setCurrentUser';
      const serviceName = 'userService.fetchCurrent';
      const currentUser = getCurrentUser();
      const messages = {
        success: 'should invoke commit "' + commitName + '" with "' + currentUser + '" when "' + serviceName + '" request is successful',
        error: 'shouldn\'t invoke commit "' + commitName + '" when "' + serviceName + '" request is failed'
      };

      it(messages.error, async () => {
        userService.fetchCurrent.mockResolvedValueOnce({ success: false });

        await fetchCurrentUser({ state, commit });

        expect(userService.fetchCurrent).toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
      });

      it(messages.success, async () => {
        await fetchCurrentUser({ state, commit });

        expect(userService.fetchCurrent).toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith(commitName, currentUser);
      });
    });

    describe('fetchAll', () => {
      const { fetchAll } = actions;
      const commitName = 'setPosts';
      const serviceName = 'postService.fetchAll';
      const posts = getPosts(50);
      const messages = {
        success: 'should invoke commit "' + commitName + '" with "' + posts + '" when "' + serviceName + '" request is successful',
        error: 'shouldn\'t invoke commit "' + commitName + '" when "' + serviceName + '" request is failed'
      };

      it(messages.error, async () => {
        postService.fetchAll.mockResolvedValueOnce({ success: false });

        await fetchAll({ commit });

        expect(postService.fetchAll).toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
      });

      it(messages.success, async () => {
        await fetchAll({ commit });

        expect(postService.fetchAll).toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith(commitName, posts);
      });
    });

    describe('fetchOne', () => {
      const { fetchOne } = actions;
      const postID = 14;
      const postServiceName = 'postService.fetchOne';
      const commentsServiceName = 'postService.fetchPostComments';
      const servicesNames = [postServiceName, commentsServiceName].join(', ');
      const expectedPost = {
        ...createPost(postID),
        comments: getPostComments(10, postID)
      };
      const messages = {
        successBothFetch: 'should return "' + expectedPost + '" when ' + servicesNames + ' requests are successful',
        errorFetchOne: 'should return null when "' + postServiceName + '" request is failed',
        errorBothFetch: 'should return null when "' + servicesNames + '" requests are failed',
        errorFetchComments: 'should return null when "' + commentsServiceName + '" request is failed'
      };

      it(messages.errorFetchOne, async () => {
        postService.fetchOne.mockResolvedValueOnce({ success: false });

        const responseError = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseError).toBeNull();
      });

      it(messages.errorFetchComments, async () => {
        postService.fetchPostComments.mockResolvedValueOnce({ success: false });

        const responseError = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseError).toBeNull();
      });

      it(messages.errorBothFetch, async () => {
        postService.fetchOne.mockResolvedValueOnce({ success: false });
        postService.fetchPostComments.mockResolvedValueOnce({ success: false });

        const responseErrorThree = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseErrorThree).toBeNull();
      });

      it(messages.successBothFetch, async () => {
        const responseSuccess = await fetchOne(null, postID);

        expect(postService.fetchOne).toHaveBeenCalledWith(postID);
        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseSuccess).toEqual(expectedPost);
      });
    });

    describe('fetchPreview', () => {
      const { fetchPreview } = actions;
      const previewPostID = 1;
      const expectedPost = createPost();
      const serviceName = 'postService.fetchPreview';
      const messages = {
        success: 'should return "' + expectedPost + '" when "' + serviceName + '" request is successful',
        error: 'should return null when "' + serviceName + '" request is failed'
      };

      it(messages.error, async () => {
        postService.fetchPreview.mockResolvedValueOnce({ success: false });

        const responseError = await fetchPreview(null, previewPostID);

        expect(postService.fetchPreview).toHaveBeenCalledWith(previewPostID);
        expect(responseError).toBeNull();
      });

      it(messages.success, async () => {
        const responseSuccess = await fetchPreview(null, previewPostID);

        expect(postService.fetchPreview).toHaveBeenCalledWith(previewPostID);
        expect(responseSuccess).toEqual(expectedPost);
      });
    });

    describe('fetchPostComments', () => {
      const { fetchPostComments } = actions;
      const serviceName = 'postService.fetchPostComments';
      const expectedComments = getPostComments(10);
      const postID = 1;
      const messages = {
        success: 'should return "' + expectedComments + '" when "' + serviceName + '" request is successful',
        error: 'should return null when "' + serviceName + '" request is failed'
      };

      it(messages.error, async () => {
        postService.fetchPostComments.mockResolvedValueOnce({ success: false });

        const responseError = await fetchPostComments(null, postID);

        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseError).toBeNull();
      });

      it(messages.success, async () => {
        const responseSuccess = await fetchPostComments(null, postID);

        expect(postService.fetchPostComments).toHaveBeenCalledWith(postID);
        expect(responseSuccess).toEqual(expectedComments);
      });
    });

    describe('addPost', () => {
      const { addPost } = actions;
      const commitName = 'addPost';
      const serviceName = 'postService.createPost';
      const newPostData = {
        title: 'New post',
        body: 'New post content',
        userId: getCurrentUser().id
      };
      const createdPost = {
        id: 101,
        ...newPostData
      };
      const messages = {
        success: 'should invoke commit "' + commitName + ' with ' + newPostData + '" when "' + serviceName + '" request is successful',
        error: 'shouldn\'t invoke commit "' + commitName + '" when "' + serviceName + '" request is failed'
      };

      it(messages.error, async () => {
        postService.createPost.mockResolvedValueOnce({ success: false });

        await addPost({ state, commit }, newPostData);

        expect(postService.createPost).toHaveBeenCalledWith(newPostData);
        expect(commit).not.toHaveBeenCalled();
      });

      it(messages.success, async () => {
        await addPost({ state, commit }, newPostData);

        expect(postService.createPost).toHaveBeenCalledWith(newPostData);
        expect(commit).toHaveBeenCalledWith(commitName, createdPost);
      });
    });

    describe('deletePost', () => {
      const { deletePost } = actions;
      const commitName = 'deletePost';
      const serviceName = 'postService.deletePost';
      const deletedPostId = 2;
      const messages = {
        success: 'should invoke commit "' + commitName + ' with "' + deletedPostId + '" when "' + serviceName + '" request is successful',
        error: 'shouldn\'t invoke commit "' + commitName + '" when "' + serviceName + '" request is failed'
      };

      it(messages.error, async () => {
        postService.deletePost.mockResolvedValueOnce({ success: false });

        await deletePost({ state, commit }, deletedPostId);

        expect(postService.deletePost).toHaveBeenCalledWith(deletedPostId);
        expect(commit).not.toHaveBeenCalled();
      });

      it(messages.success, async () => {
        await deletePost({ state, commit }, deletedPostId);

        expect(postService.deletePost).toHaveBeenCalledWith(deletedPostId);
        expect(commit).toHaveBeenCalledWith(commitName, deletedPostId);
      });
    });
  });
});
