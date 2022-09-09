/*
 * @Author: JLDiao
 * @Date: 2022-09-07 16:46:24
 * @LastEditors: ***
 * @LastEditTime: 2022-09-07 17:27:13
 * @FilePath: \vue2-rollup\src\state.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
import { observe } from './observe/index';
import { isFunction } from './utils/index'
export function initState(vm){
    const opts = vm.$options;
    // 初始化data
    if(opts.data){
        initData(vm)
    }
}
// 初始化data
function initData(vm){
    let data = vm.$options.data;
    // 往实例上添加一个 _data 属性，即传入的data
    // vue组件data推荐使用函数，防止数据在组件之间共享
    data = vm._data = isFunction(data) ? data.call(vm) : data;
    // 将vm._data上的数据代理到vm上
    for(let key in data){
        proxy(vm, "_data", key)
    }
    // 对数据进行观测
    observe(data)
}
// 代理数据
function proxy(vm, source, key){
    Object.defineProperty(vm, key, {
        get(){
            return vm[source][key]
        },
        set(newVal){
            vm[source][key] = newVal
        }
    })
}
