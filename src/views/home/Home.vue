<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"/>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recomend-view :recommends="recommends"></recomend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <good-list :goods="showGoods"></good-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecomendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/nav/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from '../../components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "common/utils";
  import {itemListenerMixin,backTopMixin} from "../../common/mixin";


  export default {
  name: "Home",
  components:{
    NavBar,
    HomeSwiper,
    RecomendView,
    FeatureView,
    TabControl,
    GoodList,
    Scroll,
  },
  mixin:[itemListenerMixin,backTopMixin],
  data(){
    return{
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]},
      },
      currentType:'pop',
      tabOffsetTop:0,
      isTabFixed:false,
      saveY: 0,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  destroyed() {
    console.log('home destroyed');
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
  //保存Y值
    this.saveY = this.$refs.scroll.getScrollY()

    //取消全局事件监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  created(){
    //请求多个数据
    this.getHomeMultidata()
    //请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted(){
    // const refresh = debounce(this.$refs.scroll.refresh,50)
    // //监听item中图片加载
    // this.itemImgListener=() => {
    //   refresh()
    // }
    // this.$bus.$on('itemImageLoad',this.itemImgListener )
    //获取tabControl的offsetTop
    //所有组件都有一个属性$el：用于获取组件中的元素
  },
  methods:{
    /**
     * 事件
     */

    tabClick(index){
      switch (index) {
        case 0:
          this.currentType='pop'
          break
        case 1:
          this.currentType='new'
          break
        case 2:
          this.currentType='sell'
          break
      }
      this.$refs.tabControl1.currentIndex=index
      this.$refs.tabControl2.currentIndex=index
    },
    contentScroll(position){
      //判断BackTop是否显示
      this.listenShowBackTop(position)

      //判断tabControl是否吸顶(position:fixed)
      this.isTabFixed=(-position.y)>this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      //获取tabControl的offsetTop
      //所有组件都有一个属性$el：用于获取组件中的元素
      this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop
    },
    /**
     * 网络
     */
    getHomeMultidata(){
      getHomeMultidata().then(res=>{
        this.banners=res.data.banner.list
        this.recommends=res.data.recommend.list
      })
    },
    getHomeGoods(type){
      const page=this.goods[type].page + 1
      getHomeGoods(type,page).then(res =>{
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        //完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home{
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}
.home-nav{
  background-color: var(--color-tint);
  color: #fff;

  /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

/*.content{*/
  /*height:calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 51px;*/
/*}*/

.content{
  /*height: 300px;*/
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  z-index: 9;
}

/*.fixed{*/
  /*!*吸顶效果*!*/
  /*!*tab-control:class="{fixed:isTabFixed}*!*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top:44px;*/
/*}*/
</style>
