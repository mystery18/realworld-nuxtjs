<template>
  <div>
    <div class="home-page">
      <div class="banner">
        <div class="container">
          <h1 class="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                <li v-show="user" class="nav-item">
                  <nuxt-link class="nav-link" :class="{ active: tab == 'your_feed' }" exact :to="{ name:'home', query: {tab: 'your_feed'} }">Your Feed</nuxt-link>
                </li>
                <li class="nav-item">
                  <nuxt-link class="nav-link" :class="{ active: tab == 'global_feed' }" exact :to="{ name:'home', query: {tab: 'global_feed'} }">Global Feed</nuxt-link>
                </li>
                <li class="nav-item" v-show="tag">
                  <nuxt-link class="nav-link" :class="{ active: tab == 'tag' }" exact :to="{ name:'home', query: {tab: 'tag', tag: tag} }">#{{ tag }}</nuxt-link>
                </li>
              </ul>
            </div>

            <div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
            >
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: { username: article.author.username },
                  }"
                  ><img :src="article.author.image"
                /></nuxt-link>

                <div class="info">
                  <!-- <a href="" class="author">Eric Simons</a> -->
                  <nuxt-link
                    :to="{
                      name: 'profile',
                      params: { username: article.author.username },
                    }"
                    >{{ article.author.username }}</nuxt-link
                  >
                  <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
                  @click="onFavorite(article)"
                  :disabled="article.favoriteDisabled"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                :to="{ name: 'article', params: { slug: article.slug } }"
                class="preview-link"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>

            <!-- <div class="article-preview">
              <div class="article-meta">
                <a href="profile.html"
                  ><img src="http://i.imgur.com/N4VcUeJ.jpg"
                /></a>
                <div class="info">
                  <a href="" class="author">Albert Pai</a>
                  <span class="date">January 20th</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                  <i class="ion-heart"></i> 32
                </button>
              </div>
              <a href="" class="preview-link">
                <h1>
                  The song you won't ever stop singing. No matter how hard you
                  try.
                </h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
              </a>
            </div> -->

            <!-- 分页列表 -->
            <nav>
              <ul class="pagination">
                <!-- ngRepeat: pageNumber in $ctrl.pageRange($ctrl.totalPages) -->
                <li
                  class="page-item"
                  :class="{ active: item == page }"
                  v-for="item in totalPage"
                  :key="item"
                >
                  <nuxt-link
                    class="page-link"
                    :to="{ name: 'home', query: { page: item, tag: $route.query.tag, tab: tab } }"
                    >{{ item }}</nuxt-link
                  >
                </li>
              </ul>
            </nav>

            <!-- E=分页列表 -->
          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>

              <div class="tag-list">
                <nuxt-link
                  :to="{ name: 'home', query: { tag: item, tab: 'tag'} }"
                  class="tag-pill tag-default"
                  v-for="item in tags"
                  :key="item"
                  >{{ item }}</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from 'vuex'
// 我们这个数据是否想要提高首屏渲染速度？想要SEO或者首屏渲染速度。
// 最好把动态的异步数据 放到 asyncData
export default {
  name: "HomeIndex",
  async asyncData({ query, store }) {
    const page = parseInt(query.page || 1);
    const limit = 20;
    const { tag } = query

    const tab = query.tab || 'global_feed'
    const loadArticles = store.state.user && tab == 'your_feed' ? getFeedArticles : getArticles

    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit, // 跳过多少条数据，开始取数据
        tag
      }),
      getTags(),
    ]);
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;

    articles.forEach(article => article.favoriteDisabled = false );

    // console.log(tagData)

    // 当你有多个连续的异步操作时，如果他们之间没有什么依赖，不用说a任务要等b任务 b任务等a任务之类的。
    // 可以提高很多速度

    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab: query.tab || 'global_feed'
    };
  },
  watchQuery: ["page", "tag", "tab"], // 当query里面的tag发生变化，也会重新触发asyncData方法的执行
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit); // 向上取整
    },
    ...mapState(['user'])
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true
      if(article.favorited){
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      }else{
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
};

// 返回401，原因是你没有提供你的身份！你要告诉他你是谁，你登录之后存到容器里面的的token字段
// token就是你的身份，后端才知道你是谁。需要授权的接口必须提供token
</script>




<style>
</style>