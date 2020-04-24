<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot  name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot  name="item-text"></slot></div>

    <!--<img src="../../assets/img/tabbar/home.svg"/>-->
    <!--<div>首页</div>-->
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    props:{
      path:String,
      activeColor:{
        type:String,
        default:'red'
      }
    },
    data(){
      return{
        // isActive: true,
      }
    },
    computed:{
      isActive(){
        //home->item1(home)=true
        return this.$route.path.indexOf(this.path)!==-1
        //$route那个路由最活跃就是他
      },
      activeStyle(){
        return this.isActive?{color:this.activeColor}:{}
        //是否处于活跃，是给color不是为空
      }
    },
    methods:{
      itemClick(){
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1;
    height: 49px;
    text-align: center;
    font-size: 14px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    /*祛空间像素*/
    margin-bottom: 2px;
  }
  .active{
    /*color: red;*/
  }
</style>
