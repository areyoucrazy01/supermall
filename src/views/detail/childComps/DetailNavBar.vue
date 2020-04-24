<template>
  <nav-bar class="detail-nav">
    <img slot="left" class="back" @click="backClick" src="~assets/img/common/back.svg">
    <div class="title" slot="center">
      <span class="title-item"
            v-for="(item, index) in titles" :key="index"
            :class="{'active': index===currentIndex}" @click="titleClick(index)">
        {{item}}
      </span>
    </div>
  </nav-bar>
</template>

<script>
  import NavBar from '../../../components/common/nav/NavBar'
  export default {
    name: "DetailNavBar",
    components:{
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    methods: {
      titleClick(index) {
        this.currentIndex = index
        this.$emit('titleClick',index)
      },
      backClick() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .title {
    display: flex;
    font-size: 13px;
  }

  .title-item {
    flex: 1;
  }
  .active {
    color: var(--color-high-text)
  }

  .back img {
    margin-top: 12px;
  }
</style>