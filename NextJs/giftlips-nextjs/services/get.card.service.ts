import axios from "axios";

const get = {
  request: axios,
  create: axios.create,
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};

export default get;
