/*
 * @Author: JLDiao
 * @Date: 2022-09-08 13:40:22
 * @LastEditors: ***
 * @LastEditTime: 2022-09-08 14:19:28
 * @FilePath: \vue2-rollup\src\observe\array.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
// 获取数组原型
let oldArrayProto = Array.prototype;
// newArrayProto.__proto__ = oldArrayProto
export let newArrayProto = Object.create(oldArrayProto)

let methods = [
    "push",
    "pop",
    "shift",
    "unshift",
    "sort",
    "reverse",
    "splice"
]

methods.forEach(method=>{
    // 重写数组方法
    newArrayProto[method] = function(...args){
        // 调用原数组方法，切片编程
        const result = oldArrayProto[method].call(this, ...args)

        // 对新增的数据进行劫持
        let inserted;
        let ob = this.__ob__;
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default: 
                break;
        }
        // 对新增的数据进行观测
        if(inserted){
            ob.observeArray(inserted)
        }
        console.log("method", ob)
        return result
    }
})