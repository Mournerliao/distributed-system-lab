import axios from 'axios'
import qs from 'qs'

// axios.defaults.baseURL = 'https://www.xiaoqw.online:3000'; // 设置全局默认基本信息
axios.defaults.baseURL = 'http://localhost:3000'; // 设置全局默认基本信息
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'; // 设置默认的请求头的Content-Type

const getRequest = (url, data) => axios.get(url, {params: data});
const postRequest = (url, data) => axios.post(url, data);

// 请求拦截器
axios.interceptors.request.use(config => {
  if (Object.prototype.toString.call(config.data) !== '[object FormData]') {
    config.data = qs.stringify(config.data);
  }
  return config
});
// 响应拦截器
axios.interceptors.response.use(response => response.data);

const axiosOp = {
  postRequest,
  getRequest,
};

export default axiosOp;
