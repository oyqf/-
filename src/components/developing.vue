<template>
  <div class="developing">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="developing-body">
        报表开发中，尽请期待
    <van-icon name="like-o" />
    </div>
    
  </div>
</template>
<script>
export default {
  name: "developing",
  data() {
    return {
    };
  },
  mounted(){
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
  }
};
</script>

<style scoped>
.developing-body{
    width: 375px;
    margin-top: 200px;
    text-align: center;
    line-height: 200px;
    font-size: 30px;
}
</style>