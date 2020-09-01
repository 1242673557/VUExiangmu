import {requestCateList} from "../../util/request"
// 数据存放
const state={
    // 列表数据
    list:[]
}
// 数据修改
const mutations={
    // 修改list
    changeList(state,arr){
        state.list=arr
    }
}

// 触发mtations修改
const actions={
    requestList(context){
        requestCateList({istree:true}).then(res=>{
            context.commit("changeList",res.data.list)
        })
    }
}
// 输出
const getters={
    list(state){
        return state.list
    }
}
export default{
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}