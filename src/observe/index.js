/*
 * @Author: JLDiao
 * @Date: 2022-09-07 17:11:23
 * @LastEditors: ***
 * @LastEditTime: 2022-09-08 14:20:17
 * @FilePath: \vue2-rollup\src\observe\index.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */

import { isObject } from "../utils/index";
import { newArrayProto } from "./array";

class Observer{
    constructor(data){
        // 将__ob__变成不可枚举（循环的时候无法获取）
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        // data.__ob__ = this;
        if(Array.isArray(data)){
            // 保留数组原有的特性，并且重写部分方法
            data.__proto__ =  newArrayProto
            this.observeArray(data)
        }else{
            this.walk(data)
        }
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            // 对 data 中的每个属性进行响应式处理
            defineReactive(data, key, data[key])
        })
    }
    observeArray(data){
        data.forEach(item => observe(item))
    }
}

function defineReactive(data, key, value){
    // 对深层次对象进行递归处理
    observe(value)
    // 重写对象，给每个属性添加get和set
    Object.defineProperty(data, key, {
        get(){
            return value
        },
        set(newVal){
            if(newVal === value) return;
            // 对象赋值  重新代理
            observe(newVal)
            value = newVal
        }
    })
}

export function observe(data){
    // 判断data是否返回一个对象，vue要求data return {}
    if(!isObject(data)) return
    // 说明这个对象已经被代理过了
    if(data.__ob__ instanceof Observer){
        return data.__ob__;
    }
    // 返回一个响应式对象
    return new Observer(data)
}