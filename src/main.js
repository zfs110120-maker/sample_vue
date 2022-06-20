// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import raphael from 'raphael'
import store from "./store/index"
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)

import './assets/icon/iconfont.css'

// 引入easy-ui
import 'vx-easyui/dist/themes/default/easyui.css';
import 'vx-easyui/dist/themes/icon.css';
import 'vx-easyui/dist/themes/vue.css';
import locale from 'vx-easyui/dist/locale/easyui-lang-zh_CN.js'; 
import EasyUI from 'vx-easyui';
Vue.use(EasyUI,{locale: locale});

import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
Vue.use(ElementUI) //使用elementUI

import VueDragResize from 'vue-drag-resize' //缩放、拖拽
Vue.component('vue-drag-resize', VueDragResize);
Vue.prototype.$raphael = raphael;


import Meta from 'vue-meta'
Vue.use(Meta)

// 表格自动滚动
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

// import ApiUrl from "../static/config";
import axios from "axios";
import Qs from "qs";
// var baseURL = window.g.serverUrl ;
var baseURL = '/api' ;
axios.defaults.headers.post['Content-Type'] = "text/plain";
// axios.defaults.transformRequest = [obj => Qs.stringify(obj)];
axios.defaults.baseURL = baseURL;
Vue.prototype.$http  = axios;

import VueCron from 'vue-cron'
Vue.use(VueCron);
Vue.config.productionTip = false

// axios.interceptors.request.use(function (config) {
//   if(config.data){
//     var token = localStorage.getItem('token')
//     if(token) {
//       config.headers.Authorization = token;
//     } else {
//       router.push("/login")
//     }
//   }
//   return config;
// }, function (error) {
//   return Promise.reject(error);
// });

// Add a response interceptor
axios.interceptors.response.use(response => {
  // Do something with response data
  if (response.status === 200) {
    return Promise.resolve(response);
  } else {
      return Promise.reject(response);
  }
},
error => {
  if (error.response.status) {
      switch (error.response.status) {
          // 401: 未登录
          // 未登录则跳转登录页面，并携带当前页面的路径
          // 在登录成功后返回当前页面，这一步需要在登录页操作。
          case 401:
              router.replace({
                  path: '/login'
              });
              break;

          // 403 token过期
          // 登录过期对用户进行提示
          // 清除本地token和清空vuex中token对象
          // 跳转登录页面
          case 403:
              // Toast({
              //     message: '登录过期，请重新登录',
              //     duration: 1000,
              //     forbidClick: true
              // });
              // 清除token
              localStorage.removeItem('token');
              // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
              setTimeout(() => {
                  router.replace({
                      path: '/login',
                      query: {
                          redirect: router.currentRoute.fullPath
                      }
                  });
              }, 1000);
              break;

          // 404请求不存在
          case 404:
            // this.$notify({
            //   message: '网络请求不存在',
            //   type: 'error',
            //   position: 'bottom-right'
            // });
            break;
          // 其他错误，直接抛出错误提示
          default:
            // this.$notify({
            //   message: error.response.data.message,
            //   type: 'error',
            //   position: 'bottom-right'
            // });
      }
      return Promise.reject(error.response);
  }
});
/* eslint-disable no-new */
// import echarts from 'echarts';
// Vue.prototype.$echarts =  echarts
// echarts版本号用的是4.9.0
// echarts-liquidfill 版本号用的是2.0.2

// router.beforeEach((to, from, next) => {
//   var token = localStorage.getItem('token');
//   if(token) {  //token存在
//     axios.post("api/checkToken",{
//       "token": token
//     }).then((res) => {
//       if(res && to.name === "Login") {
//         router.push("/home");
//         return;
//       }
//       if(!res && from.name !== "Login" &&to.name == "Login") { 
//         router.push("/login");
//         return;
//       }
//       if(!res) {
//         router.push("/login");
//         return;
//       }
      
//     }).catch((err) => {
//       console.log(err);
//     })
//   } else {  //token不存在
//     if(to.name === "Login") {  //跳转的是登录页
//       token = localStorage.getItem('token');
//     } else {  //跳转的不是登录页
//       router.push("/login");
//     }
//   }
//   next();
// });
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
