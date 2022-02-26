const library = {};

library.createResponseData = (statusCode, status, data, message) => ({
  statusCode,
  status,
  data,
  message,
});

module.exports = library;