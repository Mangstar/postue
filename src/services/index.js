import axios from 'axios';
import * as postService from './posts';
import * as userService from './users';
import store from '../store';

const createResponseErrorData = (error) => {
  let errorData;

  if (error.response) {
    const { status, config, data } = error.response;
    errorData = {
      status,
      success: false,
      url: config.baseURL + config.url,
      message: data.message
    };
  } else if (error.request) {
    const { status } = error.request;
    const { config } = error.toJSON();

    errorData = {
      status,
      success: false,
      url: config.baseURL + config.url,
      message: 'Ошибка сети. Повторите попытку.'
    };
  } else {
    errorData = {
      success: false,
      message: error.message
    };
  }

  return errorData;
};

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
