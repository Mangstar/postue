export const createResponseErrorData = (error) => {
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
    const message = !window.navigator.onLine
      ? 'Отсутствует подключение к сети'
      : 'Ошибка сети. Повторите попытку';

    errorData = {
      status,
      success: false,
      url: config.baseURL + config.url,
      message
    };
  } else {
    errorData = {
      success: false,
      message: error.message
    };
  }

  return errorData;
};
