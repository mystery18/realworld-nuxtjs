<template>
  <div>
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">
              <!-- Sign up -->
              {{ isLogin ? "Sign in" : "Sign up" }}
            </h1>
            <p class="text-xs-center">
              <!-- <a href="">Have an account?</a> -->
              <router-link v-if="isLogin" to="/register"
                >Need an account?</router-link
              >
              <router-link v-else to="/login">Have an account?</router-link>
            </p>

            <ul class="error-messages">
              <template v-for="(messages, field) in errors" >
                <!-- 内层是遍历这个对象的属性值 -->
                <li v-for="(message, index) in messages" :key="index">{{ field }} {{ message }} </li>
              </template>
            </ul>

            <!-- 防止默认的同步提交行为，加个prevent阻止默认的提交行为 -->
            <!-- 自己发起异步请求来提交表单 -->
            <form @submit.prevent="onSubmit">
              <fieldset v-show="!isLogin" class="form-group">
                <input v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required minlength="8"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                <!-- Sign up -->
                {{ isLogin ? "Sign in" : "Sign up" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import request from '@/utils/request'
import { login } from "@/api/user";
// 仅在客户端加载这个js-cookie 的第三方包
// 这个process.client是nuxt中特殊提供的一个数据，如他是true表示代码运行在客户端 false 就在服务端
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'notAuthenticated',
  name: "loginIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
      // return this.$route.path === '/login'
    },
  },
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      errors: {}, // 错误信息
      // errors: {
        // email: ['a', 'b'],
        // password: ['aaa', 'bbb']
        // 错误信息的的话可能会这样。所以先遍历错误对象
      // },
    };
  },
  methods: {
    async onSubmit() {
      // 捕获这个请求异常，登录/注册的错误处理
      // 手动捕获就不会走它那个失败提示页面了
      try {

        // 提交表单 请求登录
        const { data } = this.isLogin ? await login({
          user: this.user,
        }) : await register({
          user: this.user
        })
        // 要保存用户的登录状态
        console.log(data)

        this.$store.commit('setUser', data.user)
        // 放到cookie里面，因为cookie的话前后端都能拿到
        // 为了防止刷新页面数据丢失，我们需要把数据持久化
        Cookie.set('user', data.user)
        
        // 成功后要跳到首页咯！
        this.$router.push("/");
      } catch (err) {
        // console.log(error)
        // 如果想把错误信息返回到页面，上面那样是是打印不出错误对象的
        console.dir(err);
        this.errors = err.response.data.errors;
      }
    },
  },
};

// 其实不太建议直接在项目中直接去写请求代码，主要涉及到接口它的改动。
// 一旦改动还得去项目中各个地方找用到请求的地方，要统一组织管理，更多是方便维护以及重用之类的！
// 把请求封装成一个方法！根 建一个api文件 专门处理封装请求操作
</script>

<style>
</style>