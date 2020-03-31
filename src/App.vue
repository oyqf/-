<template>
  <div id="app">
    <transition :name="transitionName">   
    <router-view v-if="isRouterAlive"/>
    </transition>
  </div>
</template>

<script>
import { createMenu} from './request/api';
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      transitionName:'',
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive=false;
      this.$nextTick(function(){
        this.isRouterAlive=true;
      })
    }
  },
  watch: {
    $route(to, from) {
      if(to.meta.index > from.meta.index){
        this.transitionName = 's-left';
      }else if(to.meta.index < from.meta.index){
        this.transitionName = 's-right';
      }
    }
  },
}
</script>

<style>
.s-right-enter-active,
.s-right-leave-active,
.s-left-enter-active,
.s-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.s-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.s-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.s-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.s-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
