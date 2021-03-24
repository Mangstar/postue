import axios from 'axios';
import * as postService from './posts';
import * as userService from './users';
import store from '../store';
// import router from '../router';
import { createResponseErrorData } from './utils';

const transport = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/'
});

transport.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);
transport.interceptors.response.use(
  response => {
    const successRequest = { success: true };

    return Object.assign(successRequest, response);
  },
  error => {
    const errorData = createResponseErrorData(error);

    store.dispatch('setUIError', errorData);

    return errorData;
  }
);

export default transport;

export { postService, userService };
