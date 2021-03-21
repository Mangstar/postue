import axios from 'axios';
import * as postService from './posts';
import * as userService from './users';
import store from '../store';

const transport = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/'
});

transport.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);
transport.interceptors.response.use(
  response => {
    return {
      success: true,
      ...response
    };
  },
  error => {
    if (error.response) {
      const { status, config, data } = error.response;
      const errorData = {
        status: status,
        success: false,
        url: config.baseURL + config.url,
        message: data.message
      };

      store.dispatch('setApiResponseError', errorData);

      return errorData;
    }

    return Promise.reject(error);
  }
);

export default transport;

export { postService, userService };
