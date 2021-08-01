/**
 * Nuxt.js 配置文件
 */

// 现在的规则完全按我们自己的规则走，可以把pages 下面的 index.vue 删掉了
module.exports = {
  router: {
    linkActiveClass: 'active',
    // 记得要给 Home那里加exact来精确匹配也就是 /的时候Home才高亮，而不是/xxx的是 home那里也高亮

    // 自定义路由规则
    extendRoutes(routes, resolve) {
      // console.log(routes)
      routes.splice(0) // 把它默认的路由规则给清掉，nuxt会自己有一套路由规则，不用我们配，想自定义的话，要先清掉他们。
      routes.push(...[
        {
          path: '/', // 如果没有配置children，访问根的话，就到layout那个index啦。这里我们有配默认子路由
          component: resolve(__dirname, 'pages/layout'), 
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login')
            },
            // 个人的profile应该是个动态路由
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings')
            },
            {
              path: '/editor',
              name: 'editor',
              component: resolve(__dirname, 'pages/editor')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article')
            }
          ]
        }
      ])
    }
  },

  server: {
    host: '0.0.0.0',// 如果你想要让他对外提供访问，一定要把它设置成 0.0.0.0
    // 说白了就是它就会监听所有的网卡地址，然后通过外网地址就能访问了
    port: 3000
  },


  // 注册插件
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ]
}