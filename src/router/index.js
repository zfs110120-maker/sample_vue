import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode:"hash",
  routes: [
    {
      path: '/',
      name: 'Login',
      component: ()=> import("../Login.vue")
    },
    {
      path: '/login',
      name: 'Login',
      component: ()=> import("../Login.vue")
    },
    {
      path: '/home',
      name: 'home',
      component: ()=> import("../components/common/Home.vue"),
      redirect: "/homedata",
          children: [
            {
              path: "/homedata",
              name: "homedata",
              component: () => import("../components/page/HomeMenu.vue")
            },
            {
              path: "/homepreview",
              name: "homepreview",
              component: () => import("../components/page/HomeFree.vue"),
              meta: {
                keepAlive: true
              }
            },
            {
              path: "/homeList",
              name: "homeList",
              component: () => import("../components/page/HomeList.vue")
            },
            {
              path: "/homeinstall",
              name: "homeinstall",
              component: () => import("../components/page/HomeAnalyse.vue")
            },
            // {
            //   path: "/demo",
            //   name: "demo",
            //   component: () => import("../components/page/demo.vue")
            // },
          ]
    },

  ]
})
