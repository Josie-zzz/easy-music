import axios from 'axios'

export default function(param) {
  const http = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 3000
  }) 

  //拦截器
  http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

  return http(param)
}
