<template>
  <div>
    <div class="article-page">
      <div class="banner">
        <div class="container">
          <h1>{{ article.title }}</h1>
          <article-meta :article="article"></article-meta>
        </div>
      </div>

      <div class="container page">
        <div class="row article-content">
          <div class="col-md-12" v-html="article.body">
            <!-- {{ article.body }} -->
          </div>
        </div>

        <hr />

        <div class="article-actions">
          <article-meta :article="article"></article-meta>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-8 offset-md-2">

            <article-comments :article="article"></article-comments>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from "@/api/article";
import MarkdownIt from "markdown-it";
import ArticleMeta from "./components/article-meta";
import ArticleComments from "./components/article-comments";

export default {
  name: "articleIndex",
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug);
    const { article } = data;
    // 把文章的内容在渲染到页面之前，就把markdown转换成html格式的字符串
    const md = new MarkdownIt();
    article.body = md.render(article.body);

    return {
      article,
    };
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld` ,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description", //最好和name一样
          name: "description",
          content: this.article.description,
        },
      ],
    };
  },
};
</script>

<style>
</style>