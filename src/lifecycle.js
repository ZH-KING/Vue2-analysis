/*
 * @Author: JLDiao
 * @Date: 2022-09-09 16:51:07
 * @LastEditors: ***
 * @LastEditTime: 2022-09-09 16:55:52
 * @FilePath: \vue2-rollup\src\lifecycle.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */

export function initLifeCycle(Vue){
    Vue.prototype._render = function(){

    }
    Vue.prototype._update = function(){
        
    }
}

export function mountComponent(){

    // 1、调用render方法产生虚拟节点 虚拟DOM

    // 2、根据虚拟DOM产生真实DOM

    // 3、插入到el元素中
}