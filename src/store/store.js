import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store=new Vuex.Store({
    state:{
        userid:"",
        title:"",
        menu:[],
        nodeList:[]
    },
    mutations:{
        setUserID(state,userid){
            state.userid=userid;
        },
        setTitle(state,title){
            state.title=title;
        },
        setMenu(state,menu){
            state.menu=menu;
        },
        setNodeList(state,nodeList){
            state.nodeList=nodeList
        }
    }
})

export default store
