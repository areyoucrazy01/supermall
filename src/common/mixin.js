import {debounce} from "./utils";
import BackTop from 'components/content/backTop/BackTop'
import {BACKTOP_DISTANCE} from "common/const";

export const itemListenerMixin={
  data(){
    return{
      itemImgListener:null,
      refresh:null
    }
  },
  mounted(){
    this.refresh = debounce(this.$refs.scroll.refresh,50)
    this.itemImgListener=() => {
      this.refresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener)
    // console.log('---');
  }
}

export const backTopMixin={
  name:'Home',
  components:{
    BackTop
  },
  data(){
    return{
      isShowBackTop:false
    }
  },
  methods:{
    backClick(){
    this.$refs.scroll.scrollTo(0,0)
  },
    listenShowBackTop(position){
      this.isShowBackTop = position.y < -BACKTOP_DISTANCE
    }
  }
}